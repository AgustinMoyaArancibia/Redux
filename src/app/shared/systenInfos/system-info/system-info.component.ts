/* ==========================
   Imports Angular / NgRx / PrimeNG
   ========================== */
/**
 * Componente de vista de detalle de un SystemInfo dentro de un diálogo dinámico.
 * Funciones principales:
 * - Recibe `id` por `DynamicDialogConfig` y carga el detalle desde NgRx.
 * - Muestra estados de carga/errores mediante toasts (MessageService).
 * - Expone helpers visuales: `rawImgUrl`, `onImgError`, `envSeverity`.
 * - Normaliza cómo mostrar sectores de cada DataItem con `sectorsToDisplay` y `sectorIdsToDisplay`.
 *
 * ⚠️ Importante: No se modificó ninguna línea de lógica. Solo se añadió documentación.
 */
import { Component, inject, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import { getSystemInfoById, upsertSystemInfo } from '../../../store/actions/systemInfos/systemInfo.action';
import { TagModule } from 'primeng/tag';
import { CommonModule, AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { selectSelectedSystemInfo, selectSystemInfoError, selectSystemInfoLoading } from '../../../store/selectors/systemInfos/systemInfo.selector';
import { filter, take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { selectAreaError, selectAreaLoading, selectAreas } from '../../../store/selectors/area/area.selectors';
import { loadAreas } from '../../../store/actions/areas/area.action';
import { SkeletonModule } from 'primeng/skeleton';
import { API_URL } from '../../../api/providers/api-url.token';
import { DataItemEntity } from '../../../api/entities/dataItems/dataItem.entity';

/* ==========================
   Decorador del componente
   - standalone: true → componente autónomo
   - imports: módulos usados por el template
   - providers: servicios a nivel componente (Dialog/Message)
   ========================== */
@Component({
  selector: 'app-system-info',
  standalone: true,
  imports: [ButtonModule,SkeletonModule,
    CommonModule, MenuModule, FormsModule, AsyncPipe, DatePipe, NgFor, NgIf,
    PaginatorModule, InputTextModule, DividerModule, TagModule
  ],
  providers: [DialogService, MessageService],
  templateUrl: './system-info.component.html',
  styleUrl: './system-info.component.scss'
})
export class SystemInfoComponent implements OnInit {
  /* ==========================
     Inyección de dependencias
     - store: NgRx Store<AppState> para select/dispatch
     - config: parámetros del diálogo (id del sistema)
     - ref: referencia para cerrar el diálogo con payload
     - msg: toasts informativos
     ========================== */
  private store = inject(Store<AppState>);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private msg = inject(MessageService);

  /* ==========================
     Parámetro de entrada (id)
     - Se espera en config.data?.id
     ========================== */
  id: number = this.config.data?.id;
  /** Base del API para componer la URL absoluta de la imagen RAW. */
  private apiBase = inject(API_URL) ?? 'https://localhost:7209/api';

  /* ==========================
     Datos auxiliares de UI
     ========================== */
  /** Catálogo de áreas (si el template las utiliza). */
  areas: any[] = [];

  /* ==========================
     Selectores NgRx (detalle y estados)
     - detail$: detalle del SystemInfo seleccionado
     - loading$/error$: estados de carga/errores del detalle
     ========================== */
  /** Detalle del SystemInfo actualmente seleccionado en el store. */
  detail$ = this.store.select(selectSelectedSystemInfo); // ⬅ usa el seleccionado
  /** Flag de carga global del módulo SystemInfo. */
  loading$ = this.store.select(selectSystemInfoLoading);
  /** Error capturado al obtener el detalle. */
  error$ = this.store.select(selectSystemInfoError);

  /* ==========================
     Selectores de Áreas (catálogo) y estados
     - Comentados: se dejan listos por si se reactivan en el template
     ========================== */
  // areas$ = this.store.select(selectAreas);
  // loadingAreas$ = this.store.select(selectAreaLoading);
  // errorAreas$ = this.store.select(selectAreaError);

  /* ==========================
     Modelo local mínimo para editar en memoria
     - Se rellena cuando llega el detalle
     - (El componente no hace PUT directo aquí; upsertSystemInfo está importado
       por reutilización, pero la lógica actual solo muestra datos)
     ========================== */
  /** Campos básicos para mostrar/editar en memoria (no se hace PUT desde este componente). */
  form = {
    id: this.id,            // lo usamos para PUT /{id}
    description: '',
    language: '',
    objective: ''
  };

  /* ==========================
     ngOnInit
     - Valida que haya id; si falta, muestra warn y corta
     - Da feedback de "Cargando…"
     - Despacha: getSystemInfoById + loadAreas (si se habilita)
     - Suscribe una vez al detalle exitoso (take(1)) para poblar form
     - Suscribe una vez a error para notificar fallo
     ========================== */
  ngOnInit(): void {
      if (this.id) {
    this.store.dispatch(getSystemInfoById({ id: this.id }));
  }
    if (!this.id) {
      this.msg.add({
        severity: 'warn',
        summary: 'Falta ID',
        detail: 'No vino el identificador del sistema.',
        life: 2500
      });
      return;
    }

    // feedback inmediato (UX): informa que se está cargando el detalle
    this.msg.add({
      severity: 'info',
      summary: 'Cargando…',
      detail: 'Trayendo información del sistema.',
      life: 1000
    });

    // Carga del detalle (repetido intencionalmente como estaba en tu código)
    this.store.dispatch(getSystemInfoById({ id: this.id }));
    // Carga de áreas deshabilitada por ahora; dejarla lista si se necesitara:
    // this.store.dispatch(loadAreas({ page: 1, size: 20, search: null, sortBy: null, desc: false }));

    // éxito (primer valor no nulo): poblar el form para visualización/edición simple
    this.store.select(selectSelectedSystemInfo)
      .pipe(filter((d): d is NonNullable<typeof d> => !!d), take(1))
      .subscribe(d => {
        this.form.description = d.description ?? '';
        this.form.language    = d.language ?? '';
        this.form.objective   = d.objective ?? '';

        this.msg.add({
          severity: 'success',
          summary: 'Listo',
          detail: 'Información cargada.',
          life: 1200
        });
      });

    // error: notificar al usuario y sugerir reintento
    this.store.select(selectSystemInfoError)
      .pipe(filter(e => !!e), take(1))
      .subscribe(err => {
        this.msg.add({
          severity: 'error',
          summary: 'No se pudo cargar',
          detail: typeof err === 'string' ? err : 'Intentá nuevamente.',
          life: 3000
        });
      });
  }

  /* ==========================
     Imagen del SystemInfo
     - Composición de URL absoluta para RAW
     - Placeholder inline como fallback
     - onImgError para reemplazar src en caso de fallo
     ========================== */
  /** Devuelve URL absoluta de la imagen RAW o el placeholder si falta `id`. */
  // URL final para <img>: /api/system-info/{id}/image/raw
  rawImgUrl(id?: number | null): string {
    return id ? `${this.apiBase}/system-info/${id}/image/raw` : this.inlinePlaceholder;
  }

  /** Placeholder inline SVG para mostrar cuando no hay imagen o falla la carga. */
  // Placeholder inline
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
   * Reemplaza la imagen por el placeholder si el <img> dispara `error`.
   * @param ev Evento de error del elemento <img>.
   */
  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = this.inlinePlaceholder;
  }

  /* ==========================
     trackBy para *ngFor de dataItems
     - Usa id si existe; si no, índice
     ========================== */
  /** Optimiza *ngFor de dataItems: si no hay `id`, usa el índice. */
  trackByDataItem = (_: number, di: any) => di?.id ?? _;

  /* ==========================
     Cierre del diálogo con feedback
     - Muestra un toast y cierra luego de delayMs (default 800ms)
     ========================== */
  /**
   * Cierra el diálogo mostrando antes un toast informativo.
   * @param delayMs Tiempo en ms antes de cerrar (mínimo 800ms para que se vea el toast).
   */
  close(delayMs = 800) {
    // mostramos toast y cerramos luego (para que el usuario lo vea)
    this.msg.add({
      severity: 'info',
      summary: 'Cerrado',
      detail: 'Se cerró la vista de información.',
      life: Math.max(delayMs, 800)
    });
    setTimeout(() => this.ref.close({ closedAt: new Date() }), delayMs);
  }

  /* ==========================
     Normalización de sectores por DataItem
     - Prioriza nombres múltiples si están disponibles
     - Soporta compatibilidad con nombre único y con IDs
     ========================== */
  /**
   * Resuelve nombres de sectores a mostrar para un `DataItemEntity`, con la
   * siguiente prioridad:
   * 1) `sectors` (string[]) si existe y trae nombres.
   * 2) `sector` (string) como compatibilidad.
   * 3) `sectorIds` (number[]) como `#id`.
   * 4) `sectorId` (number) como `#id` único.
   * 5) Vacío si nada aplica.
   */
  sectorsToDisplay(di: DataItemEntity): string[] {
    const anyDi = di as any;

    // 1) nombres múltiples si existen
    const names = anyDi.sectors as (string[] | undefined);
    if (Array.isArray(names) && names.length) {
      return names.filter((s): s is string => typeof s === 'string' && s.trim().length > 0);
    }

    // 2) nombre único (compat)
    if (typeof di.sector === 'string' && di.sector.trim().length > 0) {
      return [di.sector];
    }

    // 3) ids múltiples → como string "#id"
    const ids = anyDi.sectorIds as (number[] | undefined);
    if (Array.isArray(ids) && ids.length) {
      return ids.map(id => `#${id}`);
    }

    // 4) id único (compat)
    if (di.sectorId != null) {
      return [`#${di.sectorId}`];
    }

    return [];
  }

  /**
   * Devuelve solo IDs crudos de sectores para un `DataItemEntity`:
   * - Si hay `sectorIds` (múltiple), los retorna.
   * - Si solo hay `sectorId` (único), lo empaqueta en un array.
   * - Si no hay, retorna `[]`.
   */
  // Devuelve solo IDs crudos por si querés mostrarlos como fallback explícito
  sectorIdsToDisplay(di: DataItemEntity): number[] {
    const anyDi = di as any;
    if (Array.isArray(anyDi.sectorIds) && anyDi.sectorIds.length) {
      return anyDi.sectorIds as number[];
    }
    return di.sectorId != null ? [di.sectorId] : [];
  }

  /* ==========================
     Helper UI: severidad por ambiente (para tags)
     - Normaliza varias variantes (PROD/PRODUCTION, QA/TEST, DEV/DEVELOPMENT)
     ========================== */
  /**
   * Mapea el valor de ambiente a una severidad de Tag de PrimeNG:
   * - PROD/PRODUCTION → 'danger'
   * - QA/TEST → 'warning'
   * - DEV/DEVELOPMENT → 'info'
   * - Default → 'info'
   */
  envSeverity(env?: string | null): 'success' | 'warning' | 'danger' | 'info' {
    switch ((env ?? '').toUpperCase()) {
      case 'PROD':
      case 'PRODUCTION':
        return 'danger';
      case 'QA':
      case 'TEST':
        return 'warning';
      case 'DEV':
      case 'DEVELOPMENT':
        return 'info';
      default:
        return 'info';
    }
  }
}
