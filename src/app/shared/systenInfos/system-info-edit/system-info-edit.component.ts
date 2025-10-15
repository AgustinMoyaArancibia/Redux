/* ==========================
   Imports de Angular / NgRx / RxJS / PrimeNG
   ========================== */
/**
 * Componente de edición de SystemInfo. Permite:
 * - Cargar los datos del sistema (detalle) con NgRx.
 * - Editar propiedades básicas (nombre, lenguaje, objetivo, fechas, etc.).
 * - Manejar gerencias múltiples (gerenciaIds) con compatibilidad hacia `gerenciaId`.
 * - Gestionar DataItems (crear en memoria, agregar/quitar al formulario, validación de duplicados por nombre).
 * - Subir/preview de imagen con <p-fileUpload>.
 * - Guardar cambios vía acción `upsertSystemInfo` (soporta archivo de imagen) y cerrar el diálogo al éxito.
 * - Eliminar un DataItem del sistema (optimista) con `deleteDataItem`.
 *
 * Flujo general:
 * 1) ngOnInit despacha las cargas necesarias (managments, data items, sectors) y, si hay `id`, obtiene el detalle.
 * 2) Se copian los datos del store al `form` (incluyendo mapeos para compatibilidad).
 * 3) El usuario edita y presiona "Guardar": se arma el cuerpo y se despacha `upsertSystemInfo`.
 * 4) Se escucha una sola vez el resultado (`upsertSystemInfoSuccess` o `...Failure`) con `Actions` y se actúa.
 */

import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { Subject, map, take, takeUntil } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';

import { AppState } from '../../../store/app.state';
import {
  deleteDataItem,
  getSystemInfoById,
  upsertSystemInfo,
  upsertSystemInfoFailure,
  upsertSystemInfoSuccess
} from '../../../store/actions/systemInfos/systemInfo.action';
import {
  selectSelectedSystemInfo,
  selectSystemInfoLoading,
  selectSystemInfoError
} from '../../../store/selectors/systemInfos/systemInfo.selector';
import {
  selectDataItemError,
  selectDataItemLoading,
  selectDataItems
} from '../../../store/selectors/dataItem/dataItem.selector';
import { loadDataItem } from '../../../store/actions/dataItem/dataItem.action';
import { loadSectors } from '../../../store/actions/sachSectors/sector.actions';
import { selectSectors } from '../../../store/selectors/sachSectors/sector.selectors';
import {
  selectManagments,
  selectManagmentsError,
  selectManagmentsLoading
} from '../../../store/selectors/sachManagment/managment.selectors';
import { loadManagment } from '../../../store/actions/sachManagment/managment.action';
import { API_URL } from '../../../api/providers/api-url.token';
import { Actions, ofType } from '@ngrx/effects';

/* ==========================
   Tipos locales de apoyo
   ========================== */
/**
 * Representa un DataItem dentro del formulario.
 * - `sectorIds`: soporte para múltiples sectores (nuevo).
 * - `sectorId`: compatibilidad si solo viene un sector (antiguo).
 */
type DataItem = {
  id: number | null;
  name: string;
  description: string;
  // ✅ múltiple + compat
  sectorIds: number[];
  sectorId?: number | null;
};

@Component({
  selector: 'app-system-info-edit',
  standalone: true,
  imports: [
    // UI / formularios / tablas / selects / upload
    FileUploadModule, MultiSelectModule,
    CommonModule, FormsModule, NgIf, SkeletonModule,
    ButtonModule, DividerModule, InputTextModule, InputTextareaModule,
    DropdownModule, CalendarModule, TableModule, TagModule
  ],
  providers: [DialogService, MessageService],
  templateUrl: './system-info-edit.component.html',
  // Nota: se mantiene tal cual, aunque lo habitual sea `styleUrls`.
  styleUrl: './system-info-edit.component.scss'
})
export class SystemInfoEditComponent implements OnInit, OnDestroy {

  /* ==========================
     Inyección de dependencias
     ========================== */
  private store = inject(Store<AppState>);
  private config = inject(DynamicDialogConfig); // datos de entrada del diálogo (se espera { id })
  private ref = inject(DynamicDialogRef);       // referencia para cerrar el diálogo retornando payload
  private msg = inject(MessageService);         // toasts / notificaciones
  private apiBase = inject(API_URL) ?? 'https://localhost:7209/api'; // base absoluta del API

  /* ==========================
     Gestión de ciclo de vida
     ========================== */
  private destroy$ = new Subject<void>(); // para desuscribir streams onDestroy

  /* ==========================
     Estado principal del componente
     ========================== */
  /** ID del SystemInfo a editar (viene por `DynamicDialogConfig`). */
  id: number = this.config.data?.id;
  /** Archivo seleccionado (opcional) para subir como imagen. */
  file: File | null = null;
  /** URL de preview (ObjectURL) para la imagen seleccionada. */
  previewUrl: string | null = null;

  /** Referencia al FileUpload para gestionar el control si hace falta. */
  @ViewChild(FileUpload) fileUpload?: FileUpload;

  /* ==========================
     Selectores (Observables del store)
     ========================== */
  /** Estado de carga/errores del SystemInfo (detalle/upsert). */
  loading$ = this.store.select(selectSystemInfoLoading);
  error$ = this.store.select(selectSystemInfoError);

  /** Estado y datos de gerencias (managements). */
  managLoading$ = this.store.select(selectManagmentsLoading);
  managError$ = this.store.select(selectManagmentsError);
  managments$ = this.store.select(selectManagments);

  /** Lista de sectores para selects. */
  sectors$ = this.store.select(selectSectors);

  /**
   * DataItems únicos por nombre (case-insensitive), para evitar duplicados al agregar.
   * Se construye filtrando el selector de `selectDataItems`.
   */
  dataItemsUnique$ = this.store.select(selectDataItems).pipe(
    map(items => {
      const seen = new Set<string>();
      return (items ?? []).filter(it => {
        const k = (it.name ?? '').trim().toLowerCase();
        if (!k || seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    })
  );
  /** Snapshot en memoria de `dataItemsUnique$` para búsquedas locales y controles. */
  dataItemsUnique: Array<{ id: number | null; name: string; description: string; sectorId: number | null }> = [];

  /** Estado de carga/errores para el módulo de DataItems. */
  loadingDataItems$ = this.store.select(selectDataItemLoading);
  errorDataItems$ = this.store.select(selectDataItemError);

  /* ==========================
     Formulario en memoria
     ========================== */
  /**
   * Estructura editada por la UI. Se llena desde `detail$` en `ngOnInit`.
   * Incluye gerencias múltiples (`gerenciaIds`) y compatibilidad con `gerenciaId`.
   * `dataItems` soporta múltiples sectores por ítem (`sectorIds`) y compatibilidad (`sectorId`).
   */
  form = {
    id: this.id,
    idSystem: 0,
    systemName: '',
    description: '',
    urlImage: '',
    language: '',
    objective: '',
    releaseDate: null as Date | null,
    devEnvId: null as number | null,
    devEnvironment: '' as string,
    sectorId: null as number | null,
    sector: '' as string,

    // ✅ múltiples gerencias
    gerenciaIds: [] as number[],

    // (compat temporal)
    gerenciaId: null as number | null,

    dataItems: [] as DataItem[],
  };

  /** Detalle seleccionado desde el store; dispara los binds al `form`. */
  detail$ = this.store.select(selectSelectedSystemInfo);

  /* ==========================
     Ciclo de vida
     ========================== */
  ngOnInit(): void {
    // Cargas iniciales necesarias para armar la pantalla de edición.
    this.store.dispatch(loadManagment({}));
    this.store.dispatch(loadDataItem({ page: 1, size: 20, search: null, sortBy: null, desc: false }));
    this.store.dispatch(loadSectors({ idGerencia: null }));
    if (this.id != null) this.store.dispatch(getSystemInfoById({ id: this.id }));

    // Mantener en memoria una lista única de DataItems (por nombre).
    this.dataItemsUnique$
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => this.dataItemsUnique = list);

    // Cuando llega el detalle, copiar al `form` (incluyendo mapeos de compatibilidad).
    this.detail$
      .pipe(takeUntil(this.destroy$))
      .subscribe(d => {
        if (!d) return;

        this.form.id = d.id;
        this.form.idSystem = d.idSystem;
        this.form.systemName = d.systemName ?? '';
        this.form.description = d.description ?? '';
        this.form.urlImage = d.urlImage ?? '';
        this.form.language = d.language ?? '';
        this.form.objective = d.objective ?? '';
        this.form.releaseDate = d.releaseDate ? new Date(d.releaseDate) : null;
        this.form.devEnvId = d.devEnvId ?? null;
        this.form.devEnvironment = d.devEnvironment ?? '';
        this.form.sectorId = d.sectorId ?? null;
        this.form.sector = d.sector ?? '';

        // 👇 múltiple primero; compat si viene solo uno
        this.form.gerenciaIds = (d.gerenciaIds && d.gerenciaIds.length > 0)
          ? [...d.gerenciaIds]
          : (d.gerenciaId ? [d.gerenciaId] : []);
        this.form.gerenciaId = d.gerenciaId ?? null;

        // ✅ DataItems con sectores múltiples + compat
        this.form.dataItems = (d.dataItems ?? []).map((x: any) => ({
          id: x.id ?? null,
          name: x.name ?? '',
          description: x.description ?? '',
          sectorIds: (x.sectorIds && x.sectorIds.length ? [...x.sectorIds] : (x.sectorId ? [x.sectorId] : [])),
          sectorId: x.sectorId ?? null
        }));
      });
  }

  ngOnDestroy(): void {
    // Liberar suscripciones y URLs de preview generadas.
    this.destroy$.next();
    this.destroy$.complete();
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  }

  /* ==========================
     Manejo de archivo (imagen)
     ========================== */
  /**
   * Handler para selección de archivo desde `<p-fileUpload>`.
   * - Guarda el `File` seleccionado.
   * - Genera un ObjectURL para previsualizar la imagen en la UI.
   */
  onFileSelect(ev: { files: File[] }) {
    const f = ev.files?.[0] ?? null;
    this.file = f;
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = f ? URL.createObjectURL(f) : null;
  }

  /**
   * Limpia archivo y preview. Útil al presionar "clear" del `<p-fileUpload>`.
   */
  onClearFile() {
    this.file = null;
    if (this.previewUrl) { URL.revokeObjectURL(this.previewUrl); this.previewUrl = null; }
  }

  /* ==========================
     Helpers de imagen (raw + placeholder)
     ========================== */
  // URL final para <img>: SIEMPRE absoluta
  /** Placeholder SVG inline usado como fallback y durante carga. */
  private inlinePlaceholder =
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
   * Construye la URL del raw de imagen desde el API, con soporte de cache-busting.
   * @param id ID del SystemInfo
   * @param bump Versión para query param `?v=`; si > 0 fuerza refresh en el navegador
   */
  rawImgUrlSafe(id?: number | null, bump?: number): string {
    if (!id) return this.inlinePlaceholder;
    const base = `${this.apiBase}/system-info/${id}/image/raw`;
    return (typeof bump === 'number' && bump > 0) ? `${base}?v=${bump}` : base;
  }

  /** Contador local para bustear caché luego de editar/guardar. */
  private imgBumpEdit = 0;

  /**
   * Determina el `src` a mostrar:
   * - Si hay `previewUrl` (archivo recién seleccionado) → usar esa.
   * - Si no, usar la raw con `imgBumpEdit` para forzar recarga post-guardado.
   */
  imgSrc(): string {
    return this.previewUrl ?? this.rawImgUrlSafe(this.form.id, this.imgBumpEdit);
  }

  /**
   * Fallback para <img>: ante error, reemplaza por `inlinePlaceholder`.
   */
  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = this.inlinePlaceholder;
  }

  /* ==========================
     Gestión de DataItems en el formulario
     ========================== */
  /** Campo para input de nombre de nuevo DataItem base (catálogo local). */
  newDataItemName = '';

  /**
   * Agrega un nombre de DataItem al catálogo local (`dataItemsUnique`) evitando duplicados
   * (case-insensitive) para que luego pueda seleccionarse desde la UI.
   * Muestra toasts de éxito o duplicado.
   */
  addNewDataItem() {
    const name = this.newDataItemName.trim();
    if (!name) return;

    if (this.dataItemsUnique.find(i => i.name.toLowerCase() === name.toLowerCase())) {
      this.msg.add({ severity: 'warn', summary: 'Nombre duplicado', detail: 'Ya existe un DataItem con ese nombre.', life: 3000 });
      return;
    }

    const newItem = { id: null, name, description: '', sectorId: null };
    this.dataItemsUnique = [...this.dataItemsUnique, newItem];
    this.newDataItemName = '';

    this.msg.add({ severity: 'success', summary: 'Agregado', detail: 'El DataItem quedó disponible para seleccionar.', life: 2000 });
  }

  /**
   * Inserta una fila vacía de DataItem en el formulario (no persistido).
   * Por compat, inicializa `sectorId` con el `form.sectorId` si existiera.
   */
  addDataItem() {
    this.form.dataItems.push({ id: null, name: '', description: '', sectorIds: [], sectorId: this.form.sectorId ?? null });
    this.msg.add({ severity: 'info', summary: 'Nuevo ítem', detail: 'Completá nombre y descripción.', life: 2000 });
  }

  /**
   * Elimina una fila de DataItem del formulario (solo en memoria).
   * @param index índice en `form.dataItems`
   */
  removeDataItem(index: number) {
    this.form.dataItems.splice(index, 1);
    this.msg.add({ severity: 'info', summary: 'Eliminado', detail: 'Se quitó el ítem del formulario.', life: 2000 });
  }

  /** trackBy para *ngFor de filas de DataItem (por índice). */
  trackByIndex = (i: number) => i;

  /**
   * Validación mínima para habilitar "Guardar".
   * Requiere `id`, `idSystem` y `systemName`.
   */
  isValid(): boolean {
    return !!this.form.id && !!this.form.idSystem && !!this.form.systemName;
  }

  /* ==========================
     Guardado (upsert) y feedback
     ========================== */
  /** Stream global de acciones (NgRx Effects) para escuchar el resultado del upsert. */
  private actions$ = inject(Actions);
  /** Flag de envío para prevenir doble submit. */
  saving = false;

  /**
   * Arma el cuerpo del upsert y despacha `upsertSystemInfo`.
   * - Convierte fechas a ISO.
   * - Incluye `gerenciaIds` y compat `gerenciaId` (primera si hay varias).
   * - Mapea `dataItems` con `sectorIds` (filtrando inválidos) y compat `sectorId`.
   * - Adjunta `file` si hay imagen.
   * Espera exactamente 1 resultado (success/failure) y luego muestra toast/cierra diálogo o informa error.
   */
  save() {
    if (!this.isValid() || this.saving) return;

    this.saving = true;

    const body = {
      id: this.form.id,
      idSystem: this.form.idSystem,
      systemName: this.form.systemName?.trim(),
      description: this.form.description?.trim(),
      urlImage: this.form.urlImage?.trim(),
      language: this.form.language?.trim(),
      objective: this.form.objective?.trim(),
      releaseDate: this.form.releaseDate ? new Date(this.form.releaseDate).toISOString() : null,
      devEnvId: this.form.devEnvId,
      devEnvironment: this.form.devEnvironment,
      sectorId: this.form.sectorId, // (si tu back aún lo usa para algo global)
      sector: this.form.sector,

      // ✅ NUEVO: gerencias múltiples
      gerenciaIds: this.form.gerenciaIds ?? [],
      // compat opcional
      gerenciaId: (this.form.gerenciaIds?.length ? this.form.gerenciaIds[0] : this.form.gerenciaId) ?? null,

      // ✅ DataItems con sectores múltiples
      dataItems: this.form.dataItems.map(di => {
        const ids = (di.sectorIds ?? []).filter(x => !!x && x > 0);
        return {
          id: di.id ?? 0,
          name: (di.name ?? '').trim(),
          description: (di.description ?? '').trim(),
          sectorIds: ids,
          // compat si no seleccionó múltiples
          sectorId: ids.length === 0 ? (di.sectorId ?? null) : null
        };
      })
    };

    this.store.dispatch(upsertSystemInfo({ body, file: this.file ?? null }));

    this.actions$.pipe(
      ofType(upsertSystemInfoSuccess, upsertSystemInfoFailure),
      take(1)
    ).subscribe(a => {
      this.saving = false;

      if (a.type === upsertSystemInfoSuccess.type) {
        // Forzar recarga de imagen en el componente de lista/visor padre.
        const bump = Date.now();
        setTimeout(() => {
          this.msg.add({ severity: 'success', summary: 'Guardado', detail: 'Cambios aplicados.' });
          this.ref.close({ saved: true, imageBump: bump });
        }, 200);
      } else {
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar.' });
      }
    });
  }

  /**
   * Elimina un DataItem ya persistido (vía API) o, si no tiene `id`, solo lo saca del formulario.
   * Implementa una UX optimista: remueve primero y muestra toast. Si tuvieras un flujo de error,
   * podés reinsertar `backup` en `form.dataItems` al detectar fallo por `error$`.
   * @param i índice de la fila
   * @param row objeto fila con `id` (si `null`, no está persistido)
   */
  onDeleteDataItem(i: number, row: { id: number | null }) {
    if (!row.id) {
      this.form.dataItems.splice(i, 1);
      this.msg.add({ severity: 'info', summary: 'Eliminado', detail: 'Ítem no persistido eliminado del formulario.', life: 2000 });
      return;
    }
    if (!confirm('¿Seguro que querés eliminar este DataItem del sistema?')) return;

    const backup = this.form.dataItems[i];
    this.form.dataItems.splice(i, 1);

    this.store.dispatch(deleteDataItem({ systemInfoId: this.form.id!, itemId: row.id! }));
    this.msg.add({ severity: 'info', summary: 'Eliminando…', detail: 'Quitamos el ítem. Si falla, te lo restauramos.', life: 2500 });
    // Para revertir en error: suscribite a error$ y reinsertá backup.
  }

  /**
   * Cierra el diálogo sin guardar y muestra un toast informativo.
   */
  cancel() {
    this.ref.close({ saved: false, cancelled: true });
    this.msg.add({ severity: 'info', summary: 'Cancelado', detail: 'No se guardaron cambios.', life: 2000 });
  }
}
