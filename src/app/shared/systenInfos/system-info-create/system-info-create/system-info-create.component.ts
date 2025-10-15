// -----------------------------------------------------------------------------
// SystemInfoCreateDialogComponent
// Diálogo de alta de SystemInfo con:
// - Selección de proyecto NO vinculado (SystemProjects unlinked)
// - Formularios template-driven (ngModel)
// - Catálogos de Áreas y DataItems (NgRx) con opción de agregar nombre rápido
// - Validación mínima (exige idSystem) y cierre de diálogo con payload listo
// - Toasts informativos (MessageService)
// -----------------------------------------------------------------------------
// ⚠️ NOTA: No se cambió ninguna línea de lógica ni firmas. Solo se añadieron
// comentarios y separadores para documentar y ordenar la lectura.
// -----------------------------------------------------------------------------

/* ==========================
   Imports Angular / NgRx / RxJS / PrimeNG
   ========================== */
/**
 * Dependencias de Angular para UI y formularios (standalone):
 * - CommonModule: directivas estructurales y pipes comunes.
 * - NgIf / NgFor: render condicional y listas.
 * - FormsModule: bindings template-driven (ngModel).
 *
 * NgRx:
 * - Store: acceso a estado global (select/dispatch).
 *
 * PrimeNG:
 * - DynamicDialog: servicio y ref para abrir/cerrar diálogos.
 * - MessageService: toasts de info/warn/error (inyectado en root o ancestro).
 * - MultiSelect, Dropdown, Calendar, Table, Tag, InputText/Area, Button, Divider:
 *   controles visuales del formulario.
 * - FileUpload: manejo de selección de archivo (imagen).
 *
 * RxJS:
 * - map: transformación de streams (ej. filtrar duplicados por nombre).
 */
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';

import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { map } from 'rxjs';

import { loadAreas } from '../../../../store/actions/areas/area.action';
import { loadDataItem } from '../../../../store/actions/dataItem/dataItem.action';
import { AppState } from '../../../../store/app.state';
import { selectAreas, selectAreaLoading, selectAreaError } from '../../../../store/selectors/area/area.selectors';
import { selectDataItems, selectDataItemLoading, selectDataItemError } from '../../../../store/selectors/dataItem/dataItem.selector';
import { loadSystemProjectsUnlinked } from '../../../../store/actions/systemProjects/systemProject.action';
import { selectSystemProjects, selectSystemProjectLoading, selectSystemProjectError } from '../../../../store/selectors/systemProjects/systemProject.selector';
import { selectSystemInfoError, selectSystemInfoLoading } from '../../../../store/selectors/systemInfos/systemInfo.selector';
import { selectSectors } from '../../../../store/selectors/sachSectors/sector.selectors';
import { loadSectors } from '../../../../store/actions/sachSectors/sector.actions';
import { loadManagment } from '../../../../store/actions/sachManagment/managment.action';
import { selectManagments, selectManagmentsError, selectManagmentsLoading } from '../../../../store/selectors/sachManagment/managment.selectors';
import { SkeletonModule } from 'primeng/skeleton';

/* ==========================
   Tipos locales de apoyo
   ========================== */
/** Opción de Área (si se usan áreas/sectors en el template). */
type AreaOption = { id: number; name: string; email?: string | null };

/**
 * DataItem editable en el formulario de alta:
 * - `sectorIds`: soporte para selección múltiple de sectores (nuevo estándar).
 * - `sectorId`: compatibilidad temporal si se admite un único sector.
 */
type DataItem = {
  id: number | null;
  name: string;
  description: string;
  sectorIds: number[];       // ✅ nuevo múltiple
  sectorId?: number | null;  // ↔ compat temporal
};

/**
 * Evento de selección del FileUpload de PrimeNG (para tipado del handler).
 */
interface FileUploadSelectEvent {
  originalEvent: Event;
  files: File[];
}

/* ==========================
   Decorador del componente
   - standalone: true → componente autónomo (sin NgModule)
   - imports: módulos usados por el template
   - providers: servicios disponibles en el scope del componente
   ========================== */
@Component({
  selector: 'app-system-info-create-dialog',
  standalone: true,
  imports: [FileUploadModule, MultiSelectModule,
    CommonModule, FormsModule, NgIf, SkeletonModule,
    DividerModule, ButtonModule, InputTextModule, InputTextareaModule,
    DropdownModule, CalendarModule, TableModule, TagModule
  ],
  providers: [DialogService],
  templateUrl: './system-info-create.component.html',
  styleUrls: ['./system-info-create.component.scss']
})
export class SystemInfoCreateDialogComponent implements OnInit {
  /** Archivo de imagen opcional a adjuntar en el alta (se envía junto al body). */
  file: File | null = null;

  /* ==========================
     Inyección de dependencias
     - store: NgRx Store<AppState> para select/dispatch
     - ref: referencia al diálogo (cerrar con payload)
     - msg: toasts informativos
     ========================== */
  private store = inject(Store<AppState>);
  private ref = inject(DynamicDialogRef);
  private msg = inject(MessageService);

  /* ==========================
     Proyectos disponibles (no vinculados)
     - projects$: lista observable de proyectos
     - loading/error: estados de carga
     ========================== */
  /** Proyectos "unlinked" para elegir `idSystem` al crear el SystemInfo. */
  projects$ = this.store.select(selectSystemProjects);
  projectsLoading$ = this.store.select(selectSystemProjectLoading);
  projectsError$ = this.store.select(selectSystemProjectError);

  /* ==========================
     Catálogo: Áreas/Sectores y estado de SystemInfo (loading/error)
     ========================== */
  /** Loading del módulo SystemInfo (ej. mientras se genera el alta). */
  loading$ = this.store.select(selectSystemInfoLoading);
  /** Error global de SystemInfo (si el proceso de alta falla del lado del store). */
  error$ = this.store.select(selectSystemInfoError);
  /** Lista de sectores (para multisectores de DataItem y filtros visuales). */
  sectors$ = this.store.select(selectSectors);

  /** Gerencias (managements) para selección múltiple en el alta. */
  managments$ = this.store.select(selectManagments)
  managError$ = this.store.select(selectManagmentsError)
  managLoading$ = this.store.select(selectManagmentsLoading)

  /* ==========================
     Catálogo: DataItems (únicos por nombre, case-insensitive)
     - dataItemsUnique$: stream único
     - dataItemsCatalog: copia local para poder “agregar nombre”
     - loading/error: estados de carga
     ========================== */
  /**
   * Catálogo único de DataItems por nombre (evita duplicados en UI).
   * Se usa como base para autocompletar/selector y para "agregar nombre" rápido.
   */
  dataItemsUnique$ = this.store.select(selectDataItems).pipe(
    map(items => {
      const seen = new Set<string>();
      return (items ?? []).filter(it => {
        const k = (it.name ?? '').trim().toLowerCase();
        if (!k || seen.has(k)) return false;
        seen.add(k);
        return true;
      }) as DataItem[];
    })
  );
  /** Copia local del catálogo para mutarlo cuando se agrega un nombre rápido (no persiste aún). */
  dataItemsCatalog: DataItem[] = []; // copia local para poder agregar nombres
  /** Estado de carga del catálogo de DataItems. */
  loadingDataItems$ = this.store.select(selectDataItemLoading);
  /** Estado de error del catálogo de DataItems. */
  errorDataItems$ = this.store.select(selectDataItemError);

  /* ==========================
     Modelo del formulario (POST)
     - Campos opcionales normalizados al confirmar
     ========================== */
  /**
   * Formulario de alta:
   * - `idSystem`: obligatorio (> 0).
   * - `gerenciaIds`: selección múltiple (estándar actual).
   * - `gerenciaId`: compat opcional (primera gerencia si hay varias).
   * - `dataItems`: lista editable con soporte de sectores múltiples y compat.
   */
  form = {
    idSystem: null as number | null,
    description: '' as string,
    urlImage: '' as string,
    language: '' as string,
    objective: '' as string,
    releaseDate: null as Date | null,

    // ✅ gerencias múltiples
    gerenciaIds: [] as number[],
    // compat opcional
    gerenciaId: null as number | null,

    dataItems: [] as DataItem[],
  };

  /* ==========================
     Auxiliar UI: agregar nombre al catálogo local
     ========================== */
  /** Campo temporal de input para "agregar nombre" de DataItem al catálogo local. */
  newDataItemName = '';

  /* ==========================
     Ciclo de vida: OnInit
     - Carga catálogos (Áreas, DataItems)
     - Carga proyectos no vinculados (para elegir idSystem)
     - Sincroniza catálogo único a la copia local “mutable”
     ========================== */
  ngOnInit(): void {
    // cargar catálogos
    // this.store.dispatch(loadAreas({ page: 1, size: 50, search: null, sortBy: null, desc: false }));
    this.store.dispatch(loadDataItem({ page: 1, size: 200, search: null, sortBy: null, desc: false }));
    this.store.dispatch(loadSectors({ idGerencia: null }));
    // NUEVO: proyectos disponibles para vincular
    this.store.dispatch(loadSystemProjectsUnlinked());
    this.store.dispatch(loadManagment({}));

    // sincronizar catálogo único a local (para poder mutarlo con “agregar nombre”)
    this.dataItemsUnique$.subscribe(list => this.dataItemsCatalog = [...list]);
  }

  /* ==========================
     UI: manipulación de filas de DataItems del formulario
     ========================== */
  /**
   * Agrega una fila vacía de DataItem al formulario.
   * - `sectorIds` inicia vacío (múltiple).
   * - `sectorId` queda por compatibilidad (si UI/Back aún esperan único).
   */
  addDataItem() {
    this.form.dataItems.push({
      id: null,
      name: '',
      description: '',
      sectorIds: [],            // ✅ múltiple vacío
      sectorId: null            // compat
    });
  }

  /**
   * Elimina una fila de DataItem por índice (solo en el formulario, no persiste).
   * @param i índice de la fila a remover
   */
  removeDataItem(i: number) {
    this.form.dataItems.splice(i, 1);
  }

  /** trackBy para *ngFor de filas de DataItem (por índice). */
  trackByIndex = (i: number) => i;

  /* ==========================
     Catálogo: agregar nombre rápido
     - Evita duplicados (case-insensitive)
     - Agrega a dataItemsCatalog (solo UI, no persistido)
     ========================== */
  /**
   * Agrega un nombre de DataItem al catálogo local si no existe aún (case-insensitive).
   * Útil para permitir seleccionar inmediatamente ese nombre en la UI, sin persistirlo.
   */
  addNewNameToCatalog() {
    const name = this.newDataItemName.trim();
    if (!name) return;
    const exists = this.dataItemsCatalog.some(d => (d.name ?? '').toLowerCase() === name.toLowerCase());
    if (exists) {
      this.msg.add({ severity: 'warn', summary: 'Duplicado', detail: 'Ese nombre ya existe.' });
      return;
    }
    this.dataItemsCatalog = [
      ...this.dataItemsCatalog,
      { id: null, name, description: '', sectorId: null, sectorIds: [] } // 👈 solo catálogo local (no persistido)
    ];
    this.newDataItemName = '';
    this.msg.add({ severity: 'success', summary: 'Agregado', detail: 'Nombre agregado al catálogo.' });
  }

  /* ==========================
     Validación mínima del POST
     - Requisito: idSystem (> 0)
     ========================== */
  /**
   * Valida los requisitos mínimos para habilitar el alta:
   * - `idSystem` debe existir y ser > 0.
   */
  isValid(): boolean {
    return !!this.form.idSystem && this.form.idSystem > 0;
  }

  /* ==========================
     Manejo de archivo (imagen)
     ========================== */
  /**
   * Handler genérico para `<input type="file">` si se usa fuera de p-fileUpload.
   */
  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.file = input.files && input.files.length ? input.files[0] : null;
  }

  /** Referencia al componente FileUpload de PrimeNG (si se lo necesita manipular). */
  @ViewChild(FileUpload) fileUpload?: FileUpload;

  /**
   * Handler específico para selección de archivo desde `<p-fileUpload>`.
   * Toma el primer archivo del arreglo provisto por el evento.
   */
  onFileSelect(ev: FileUploadSelectEvent) {
    this.file = ev.files?.[0] ?? null;
  }

  /* ==========================
     Confirmar creación
     - Normaliza strings (trim) y date → ISO
     - Filtra dataItems sin nombre
     - Cierra el diálogo devolviendo { created: true, body }
     ========================== */
  /**
   * Arma el payload final de creación y cierra el diálogo con `{ created: true, body, file }`.
   * Detalles:
   * - `description`, `urlImage`, `language`, `objective` → `trim()` y `null` si vacío.
   * - `releaseDate` → ISO string (o `null` si no se seleccionó).
   * - `gerenciaIds` → array oficial, con `gerenciaId` de compat si aplica.
   * - `dataItems`:
   *    · Usa `sectorIds` como fuente oficial (filtra ids inválidos).
   *    · Mantiene `sectorId` de compat si no hay múltiples.
   *    · Filtra items sin `name` (no se envían).
   *
   * ⚠️ Se mantiene exactamente la misma lógica provista por vos,
   * incluyendo el valor `1` como `sectorId` cuando existan `sectorIds` (> 0).
   */
  create() {
    if (!this.isValid()) {
      this.msg.add({ severity: 'warn', summary: 'Datos incompletos', detail: 'Completá IdSystem.', life: 3000 });
      return;
    }

    const body = {
      idSystem: this.form.idSystem,
      description: this.form.description?.trim() || null,
      urlImage: this.form.urlImage?.trim() || null,
      language: this.form.language?.trim() || null,
      objective: this.form.objective?.trim() || null,
      releaseDate: this.form.releaseDate ? new Date(this.form.releaseDate).toISOString() : null,

      // ✅ lista oficial de gerencias
      gerenciaIds: this.form.gerenciaIds ?? [],
      // compat opcional (podés removerlo cuando limpies)
      gerenciaId: (this.form.gerenciaIds?.length ? this.form.gerenciaIds[0] : this.form.gerenciaId) ?? null,

      // ✅ DataItems con múltiples sectores (y compat)
      dataItems: (this.form.dataItems ?? [])
        .map(di => {
          const ids = (di.sectorIds ?? []).filter(x => !!x && x > 0);
          return {
            name: (di.name ?? '').trim(),
            description: (di.description ?? '').trim(),
            sectorIds: ids,                                   // ← oficial
            sectorId: ids.length === 0 ? (di.sectorId ?? null) : 1 // ← compat si no eligió múltiples (se mantiene tal cual)
          };
        })
        .filter(x => !!x.name)
    };

    this.msg.add({ severity: 'info', summary: 'Preparando alta…', detail: 'Validando y armando el envío.', life: 900 });

    // Simula una pequeña espera UX antes de cerrar con el payload.
    setTimeout(() => {
      this.ref.close({ created: true, body, file: this.file });
    }, 900);
  }

  /* ==========================
     Cancelar
     - Cierra el diálogo con created: false y muestra toast
     ========================== */
  /**
   * Cierra el diálogo sin crear y muestra un toast informativo.
   */
  cancel() {
    this.ref.close({ created: false });
    this.msg.add({
      severity: 'info',
      summary: 'Cancelado',
      detail: 'No se guardaron cambios.',
      life: 2000
    });
  }

  /* ==========================
     Helper UI: severidad por ambiente (para tags)
     ========================== */
  /**
   * Mapea ambiente → severidad de Tag PrimeNG (estilo visual).
   * @param env 'DEV' | 'TST' | 'PRD' | undefined
   */
  envSeverity(env?: string): 'success' | 'warning' | 'info' | 'danger' {
    switch ((env || '').toUpperCase()) {
      case 'PRD': return 'success';
      case 'TST': return 'warning';
      case 'DEV': return 'info';
      default: return 'info';
    }
  }

  
}
