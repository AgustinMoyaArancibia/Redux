/* ==========================
   Imports Angular / RxJS / PrimeNG / NgRx
   ========================== */
/**
 * Este archivo define el componente standalone `SystemsInfosComponent`, pantalla principal
 * del catálogo de sistemas. Muestra un listado paginado con búsqueda, filtrado por ambiente
 * (DEV/TST/PRD), apertura de diálogos de detalle/edición/alta, y controla qué acciones
 * se habilitan en la UI según el `userName` obtenido desde `sessionStorage['auth.snapshot']`.
 *
 * 🔐 Permisos de UI:
 * - Se usa una lista blanca (whitelist) `ELEVATED_USERS` para habilitar acciones "Crear" y "Editar".
 * - El `userName` se normaliza (quita dominio `DOM\` y sufijo `@empresa`) para comparar correctamente.
 *
 * 🔄 Estado y flujo de datos:
 * - Los datos se obtienen vía NgRx (selectors `selectSystemInfos`, `selectSystemInfoTotal`, etc.).
 * - Paginación: se mantiene estado local `currentPage`, `currentSize`, etc., y se despachan acciones `loadSystemInfos`.
 * - Búsqueda: se usa `searchTerm$` con debounce (300ms).
 * - Cambio de ambiente: reinicia página a 1 y recarga.
 *
 * 🖼️ Imágenes:
 * - `rawImgUrlSafe` arma el endpoint del backend y añade un query param `v` para bust de caché
 *   cuando se edita una imagen (incrementando `imgVersion` después de guardar).
 * - `inlinePlaceholder` sirve de fallback minimalista en SVG.
 *
 * 🧱 Infra:
 * - `API_URL` se inyecta (token), por defecto `https://localhost:7209/api` si no está disponible.
 * - `authLogout` se dispara con un pequeño delay para permitir mostrar un toast antes de navegar.
 */

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { AppState } from '../../../store/app.state';
import { createSystemInfo, loadSystemInfos } from '../../../store/actions/systemInfos/systemInfo.action';
import { selectSystemInfos, selectSystemInfoTotal, selectSystemInfoPage, selectSystemInfoSize, selectSystemInfoLoading } from '../../../store/selectors/systemInfos/systemInfo.selector';
import { MenuItem, MessageService } from 'primeng/api';
import { authLogout } from '../../../store/actions/auth/auth.action';
import { SystemInfoComponent } from '../system-info/system-info.component';
import { SystemInfoEditComponent } from '../system-info-edit/system-info-edit.component';
import { SystemInfoCreateDialogComponent } from '../system-info-create/system-info-create/system-info-create.component';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { API_URL } from '../../../api/providers/api-url.token';
import { Router } from '@angular/router';
import { ScrollTopModule } from 'primeng/scrolltop';
/* =====================================================================
   🔐 Lista blanca: usuarios con permisos elevados para crear/editar
   - Editá este arreglo para añadir o quitar usuarios habilitados.
   - Las comparaciones son case-insensitive (todo a lower-case).
   ===================================================================== */
const ELEVATED_USERS = ['amoya', 'admin', 'msuarez', 'jdoe']; // ← agregá/quitá acá
const ELEVATED_USER_SET = new Set(ELEVATED_USERS.map(u => u.toLowerCase()));

/**
 * Normaliza distintas representaciones del usuario de dominio a un `userName` base.
 * Ejemplos:
 *   - "DOM\\amoya"      → "amoya"
 *   - "amoya@empresa"   → "amoya"
 *   - "  A.MOYA  "      → "a.moya" (respeta contenido pero reduce a minúsculas)
 *
 * @param u Cadena original (puede venir con dominio prefijo o sufijo)
 * @returns `userName` en minúscula, sin prefijo/sufijo de dominio ni espacios.
 */
function normalizeUser(u: string): string {
  return (u || '')
    .trim()
    .toLowerCase()
    .replace(/^.*\\/, '')   // saca prefijo de dominio "DOM\"
    .replace(/@.*$/, '');   // saca sufijo de dominio "@empresa"
}

/**
 * Estructura mínima esperada en `sessionStorage['auth.snapshot']`.
 * Solo `userName` es obligatorio para este componente.
 */
type AuthSnapshot = {
  userName: string;
  nombreCompleto?: string;
  grupos?: string[];
  mail?: string;
  idEmpleado?: number;
  sectorId?: number;
  sector?: string;
  gerenciaId?: number;
  gerencia?: string;
};

@Component({
  selector: 'app-systems-infos',
  standalone: true,
  imports: [
    // Módulos UI/Angular/PrimeNG/NgRx usados por la plantilla y el componente
    ButtonModule, CommonModule, MenuModule, FormsModule,ScrollTopModule,
    AsyncPipe, DatePipe, NgFor, NgIf,
    PaginatorModule, InputTextModule, DividerModule, TagModule,
    ToastModule, DropdownModule, SkeletonModule
  ],
  providers: [DialogService, MessageService],
  templateUrl: './systems-infos.component.html',
  styleUrls: ['./systems-infos.component.scss']
})
export class SystemsInfosComponent implements OnInit, OnDestroy {
  /* ==========================
     Inyección de dependencias
     ========================== */
       private router = inject(Router);
  /** Store global de la app (NgRx) para despachar acciones y leer selectors. */
  private store = inject(Store<AppState>);
  /** Servicio para abrir diálogos modales (PrimeNG DynamicDialog). */
  private dialogService = inject(DialogService);
  /** Servicio de mensajes tipo toast (PrimeNG). */
  private messageService = inject(MessageService);
  /** Notificador para desuscribirse de streams al destruir el componente. */
  private destroy$ = new Subject<void>();
  /**
   * Base URL del API. Se intenta inyectar por `API_URL`; si no existe token, fallback a localhost.
   * Útil para armar URLs de imagen `raw`.
   */
  private apiBase = inject(API_URL) ?? 'https://localhost:7209/api';

  /* ==========================
     Autenticación (session)
     ========================== */
  /** Clave en SessionStorage donde se guarda el snapshot de autenticación. */
  private readonly SNAP_KEY = 'auth.snapshot';
  /** userName normalizado (o `null` si no hay snapshot válido). */
  userName: string | null = null;

  /* ==========================
     Estado local de filtros/paginación
     ========================== */
  /** Campo de orden actual (null = sin orden específico). */
  private currentSortBy: string | null = 'id';
  /** Dirección de orden actual (true = DESC, false = ASC). */
  private currentDesc = false;
  /** Término de búsqueda actual (null = sin filtro). */
  private currentSearch: string | null = null;
  /** Tamaño de página actual. */
  private currentSize = 20;
  /** Página actual (1-based). */
  private currentPage = 1;

  /** Stream para control de debounce de la búsqueda libre. */
  private searchTerm$ = new Subject<string | null>();

  /**
   * `trackBy` para *ngFor de listas de sistemas. Evita re-render innecesario.
   * @param _ idx del item (no se usa)
   * @param it item con propiedad `id`
   */
  trackById = (_: number, it: { id: number }) => it.id;

  /* ==========================
     Menú contextual (kebab)
     ========================== */
  /** Ítems de menú de acciones globales (Refresh, Crear, Logout). */
  items: MenuItem[] | undefined;

  /* ==========================
     Caching/refresh de imágenes
     ========================== */
  /**
   * Incremental para bustear el caché de imágenes cuando se edita.
   * Se añade como query param `?v={imgVersion}`.
   */
  private imgVersion = 0;

  /* ==========================
     Observables desde el Store (NgRx)
     ========================== */
  /** Flujo con la lista principal sin filtros extra, tal como viene del store. */
  systems$ = this.store.select(selectSystemInfos);
  /** Total de elementos para la paginación. */
  total$ = this.store.select(selectSystemInfoTotal);
  /** Página actual leída desde el estado del módulo. */
  page$ = this.store.select(selectSystemInfoPage);
  /** Tamaño de página leída desde el estado del módulo. */
  size$ = this.store.select(selectSystemInfoSize);
  /** Flag de carga (para skeletons/spinners). */
  loading$ = this.store.select(selectSystemInfoLoading);

  /* ==========================
     Controles de la UI (search / filter)
     ========================== */
  /** Texto de búsqueda ligado a un input (two-way binding). */
  searchText: string | null = null;
  /** Ambiente seleccionado para filtrar (DEV/TST/PRD). */
  selectedEnv: string | null = null;
  /** Opciones del dropdown de ambientes. */
  envOptions = [
    { label: 'DEV', value: 'DEV' },
    { label: 'TST', value: 'TST' },
    { label: 'PRD', value: 'PRD' },
  ];

  /* ==========================
     Permisos de UI (habilitar botones)
     ========================== */
  /** Si el usuario puede ver y usar el botón "Crear". */
  canCreate = false;
  /** Si el usuario puede ver y usar el botón "Editar". */
  canEdit = false;

  /**
   * Determina si `u` pertenece a la lista blanca con permisos elevados.
   * @param u `userName` sin dominio (o null)
   * @returns `true` si `u` está whitelisteado; de lo contrario `false`.
   */
  private isPowerUser(u: string | null): boolean {
    if (!u) return false;
    return ELEVATED_USER_SET.has(normalizeUser(u));
  }

  /* ==========================
     Ciclo de vida
     ========================== */
  ngOnInit(): void {
    // 1) Leer userName desde sessionStorage['auth.snapshot'] de forma segura (con try/catch)
    const snap = this.readAuthSnapshot();
    this.userName = snap?.userName ?? null;

    // 2) Calcular permisos de UI según whitelist
    const isSuperUser = this.isPowerUser(this.userName);
    this.canCreate = isSuperUser;
    this.canEdit = isSuperUser;

    // 3) Construir menú contextual: "Crear" queda deshabilitado si no es superuser
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Refresh',
            icon: 'pi pi-refresh',
            command: () => {
              // Re-despacha carga con los filtros/paginación actuales
              this.store.dispatch(loadSystemInfos({
                page: this.currentPage,
                size: this.currentSize,
                search: this.currentSearch,
                sortBy: this.currentSortBy,
                desc: this.currentDesc,
                env: this.selectedEnv ?? null,
              }));
            }
          },
          {
            label: 'Crear',
            icon: 'pi pi-plus',
            command: () => this.createSystem(),
            disabled: !this.canCreate
          },
          {
            label: 'Logs',
            icon: 'pi pi-server',
            command: () => this.navigateLogs(),
            disabled: !this.canCreate
          },
          { label: 'Cerrar Sesión', icon: 'pi pi-sign-out', command: () => this.logout() }
        ]
      }
    ];

    // 4) Carga inicial (primer page load) sin filtros de búsqueda/ambiente
    this.store.dispatch(loadSystemInfos({
      page: 1,
      size: this.currentSize,
      search: null,
      sortBy: this.currentSortBy,
      desc: this.currentDesc,
      env: null
    }));

    // 5) Configurar debounce para búsqueda libre
    //    - espera 300ms entre tipeos
    //    - ignora si el término no cambió (distinctUntilChanged)
    //    - al cambiar, resetea a página 1 y recarga con el nuevo `search`
    this.searchTerm$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(term => {
        this.currentSearch = term?.trim() || null;
        this.currentPage = 1;
        this.store.dispatch(loadSystemInfos({
          page: this.currentPage,
          size: this.currentSize,
          search: this.currentSearch,
          sortBy: this.currentSortBy,
          desc: this.currentDesc,
          env: this.selectedEnv ?? null
        }));
      });
  }

  /**
   * Lee y parsea con seguridad el snapshot de autenticación desde SessionStorage.
   * Evita errores en SSR / entornos sin `window`.
   * @returns `AuthSnapshot` válido o `null` si no existe/está malformado.
   */
  private readAuthSnapshot(): AuthSnapshot | null {
    try {
      const isBrowser = typeof window !== 'undefined' && !!window.sessionStorage;
      if (!isBrowser) return null;
      const raw = sessionStorage.getItem(this.SNAP_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AuthSnapshot;
      return typeof parsed?.userName === 'string' ? parsed : null;
    } catch {
      // Si hay JSON inválido o falla el acceso, se retorna null silenciosamente.
      return null;
    }
  }

  /* ==========================
     Helpers de imagen (raw + placeholder)
     ========================== */
  /**
   * Construye una URL segura a la imagen raw del sistema.
   * - Si no hay `id` → devuelve inline placeholder SVG.
   * - Si `bump` > 0 → agrega `?v={bump}` para forzar refresh de caché.
   * @param id ID del SystemInfo (opcional)
   * @param bump Versión para cache-busting (opcional)
   */
  rawImgUrlSafe(id?: number | null, bump?: number): string {
    if (!id) return this.inlinePlaceholder;
    const base = `${this.apiBase}/system-info/${id}/image/raw`;
    return (typeof bump === 'number' && bump > 0) ? `${base}?v=${bump}` : base;
  }

  /**
   * Atajo a `rawImgUrlSafe` usando el `imgVersion` actual para bustear caché tras edición.
   * @param id ID del SystemInfo (opcional)
   */
  rawImgUrl(id?: number | null): string {
    return this.rawImgUrlSafe(id, this.imgVersion);
  }

  /** Placeholder SVG inline para mostrar mientras carga o si hay error 404/500. */
  inlinePlaceholder =
    'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <g fill="#9ca3af">
          <rect x="120" y="100" width="400" height="200" rx="12"/>
          <circle cx="220" cy="180" r="36"/>
          <path d="M220 230 L300 155 L360 205 L420 185 L495 260 L220 260Z"/>
        </g>
      </svg>
    `);

  /**
   * Fallback de imagen: ante error al cargar, se reemplaza por `inlinePlaceholder`.
   * @param ev Evento `error` del tag `<img>`
   */
  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = this.inlinePlaceholder;
  }

  /* ==========================
     Acciones de UI (diálogos / toasts / logout)
     ========================== */
  /**
   * Abre diálogo de creación (`SystemInfoCreateDialogComponent`).
   * Al cerrar:
   * - Si `created` y hay `body`, despacha `createSystemInfo` (con `file` opcional) y muestra toast de éxito.
   * - Si cancela, muestra toast informativo sin cambios.
   */
  createSystem() {
    const ref = this.dialogService.open(SystemInfoCreateDialogComponent, {
      header: 'Crear sistema', modal: true, width: '95vw'
    });

    ref.onClose.subscribe((res: any) => {
      if (res?.created && res?.body) {
        this.store.dispatch(createSystemInfo({ body: res.body, file: res.file ?? null }));
        this.messageService.add({ severity: 'success', summary: 'Guardando…', detail: 'Alta completa.', life: 2500 });
      } else if (res && res.cancelled) {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'No se hicieron cambios.', life: 2000 });
      }
    });
  }

  /**
   * Abre diálogo de vista de información (`SystemInfoComponent`) para un `id`.
   * Muestra un toast informativo al cerrar el diálogo.
   * @param id ID del sistema a visualizar
   */
  showInfo(id: number) {
    const ref = this.dialogService.open(SystemInfoComponent, {
      header: 'Información del sistema', modal: true, width: '95vw', data: { id }
    });
    ref.onClose.subscribe(() => {
      this.messageService.add({ severity: 'info', summary: 'Cerrado', detail: 'Se cerró la vista de información.', life: 2000 });
    });
  }

  /**
   * Abre diálogo de edición (`SystemInfoEditComponent`) para un `id`.
   * Al cerrar:
   * - Si `saved` → bump de `imgVersion`, recarga listado con filtros actuales y toast de éxito.
   * - Si no hay cambios → toast informativo.
   * @param id ID del sistema a editar
   */
  editSystem(id: number) {
    const ref = this.dialogService.open(SystemInfoEditComponent, {
      header: 'Editar sistema', modal: true, width: '95vw', data: { id }
    });

    ref.onClose.subscribe(r => {
      if (r?.saved) {
        // Si el hijo informa `imageBump`, lo usamos; si no, incrementamos para bustear caché
        this.imgVersion = r.imageBump || (this.imgVersion + 1);
        this.store.dispatch(loadSystemInfos({
          page: this.currentPage,
          size: this.currentSize,
          search: this.currentSearch,
          sortBy: this.currentSortBy,
          desc: this.currentDesc,
          env: this.selectedEnv ?? null
        }));
        this.messageService.add({ severity: 'success', summary: 'Cambios enviados', detail: 'Los cambios se guardaron.', life: 2500 });
      } else {
        this.messageService.add({ severity: 'info', summary: 'Sin cambios', detail: 'No se realizaron modificaciones.', life: 2000 });
      }
    });
  }

  /**
   * Muestra un toast breve y luego dispara `authLogout()` para salir.
   * Se usa `setTimeout` para permitir que el usuario lea el mensaje.
   */
  logout() {
    this.messageService.add({ severity: 'info', summary: 'Cerrando sesión…', detail: 'Te redirigimos al inicio.', life: 2000 });
    setTimeout(() => this.store.dispatch(authLogout()), 2000);
  }

  /* ==========================
     Handlers de filtros/paginación
     ========================== */
  /**
   * Handler para el input de búsqueda. Solo emite al `Subject`; el `debounce` hace el resto.
   * @param term Texto tipeado por el usuario (puede ser `null`/vacío)
   */
  onSearchChange(term: string | null) {
    this.searchTerm$.next(term);
  }

  /**
   * Handler para cambio de ambiente (DEV/TST/PRD) en el dropdown.
   * - Actualiza `selectedEnv`.
   * - Lee `size` actual desde el store (una sola vez) para mantener coherencia.
   * - Resetea a página 1 y vuelve a cargar con el filtro de ambiente.
   * @param env Nuevo ambiente seleccionado o `null`
   */
  onEnvChange(env: string | null) {
    this.selectedEnv = env;
    this.store.select(selectSystemInfoSize).pipe(take(1)).subscribe(size => {
      this.currentSize = size ?? this.currentSize;
      this.currentPage = 1;
      this.store.dispatch(loadSystemInfos({
        page: this.currentPage,
        size: this.currentSize,
        env: this.selectedEnv ?? null,
        search: this.currentSearch,
        sortBy: this.currentSortBy,
        desc: this.currentDesc
      }));
    });
  }

  /**
   * Handler para la paginación (PrimeNG Paginator).
   * - PrimeNG trabaja con página base 0, así que convertimos a base 1.
   * - Si `rows` cambia, actualizamos `currentSize`.
   * - Despachamos `loadSystemInfos` con el estado actualizado.
   * @param e Estado del paginador (`page`, `rows`, `first`, etc.)
   */
  onPageChange(e: PaginatorState) {
    this.currentSize = e.rows ?? this.currentSize ?? 20;
    const zeroBased = e.page ?? Math.floor((e.first ?? 0) / this.currentSize);
    this.currentPage = zeroBased + 1;

    this.store.dispatch(loadSystemInfos({
      page: this.currentPage,
      size: this.currentSize,
      search: this.currentSearch,
      sortBy: this.currentSortBy,
      desc: this.currentDesc,
      env: this.selectedEnv ?? null
    }));
  }

  /* ==========================
     Helpers visuales (chips/estilos)
     ========================== */
  /**
   * Mapea el ambiente a un `severity` de Tag de PrimeNG.
   * @param env DEV / TST / PRD
   * @returns 'success' para PRD, 'warning' para TST, 'info' para DEV (default 'info').
   */
  envSeverity(env?: string): 'success' | 'warning' | 'info' | 'danger' {
    switch ((env || '').toUpperCase()) {
      case 'PRD': return 'success';
      case 'TST': return 'warning';
      case 'DEV': return 'info';
      default: return 'info';
    }
  }

  /**
   * Mapea el ambiente a una clase CSS (para estilos condicionales).
   * @param env DEV / TST / PRD / null
   * @returns Clase acorde al ambiente; 'env-none' si no coincide.
   */
  envClass(env: string | null): string {
    switch ((env || '').toUpperCase()) {
      case 'DEV': return 'env-dev';
      case 'TST': return 'env-tst';
      case 'PRD': return 'env-prd';
      default: return 'env-none';
    }
  }

  /* ==========================
     Limpieza
     ========================== */
  /** Completa el `destroy$` para liberar suscripciones del debounce de búsqueda. */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateLogs(): void {
    this.router.navigate(['/logs']); // o ['shared','logs'] según tu routing
  }
}
