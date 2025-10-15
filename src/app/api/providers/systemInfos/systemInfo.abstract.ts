import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PagedRequest, PagedResult } from "../../../core/models/common/common";
import { SystemInfoEntity } from "../../entities/systemInfos/systemInfo.entity";
import { SystemInfoUpsertEntity } from "../../entities/systemInfos/systemInfoUpsert.entity";

/**
 * Contrato abstracto para el proveedor de SystemInfo.
 * Implementaciones concretas (p. ej. `SystemInfoProvider`) deben cumplir
 * estos métodos para interactuar con la API/servicio subyacente.
 *
 * Responsabilidades:
 * - Listado paginado (con/si filtro por environment).
 * - Obtención por `id` y por `idSystem` (FK).
 * - Creación/actualización (con archivo opcional) y eliminación de ítems asociados.
 * - Utilidades de actualización por FK (`idSystem`).
 */
@Injectable()
export abstract class AbstractSystemInfoProvider {
  /**
   * Obtiene un listado paginado con filtros básicos.
   * @param req Parámetros de paginación y filtros (`search`, `sortBy`, `desc`).
   * @returns `Observable<PagedResult<SystemInfoEntity>>`
   */
  abstract getPaged(req: PagedRequest): Observable<PagedResult<SystemInfoEntity>>;

  /**
   * Obtiene el detalle por identificador único.
   * @param id ID de `SystemInfo`.
   */
  abstract getById(id: number): Observable<SystemInfoEntity>;

  /**
   * Obtiene el detalle por `idSystem` (FK hacia proyecto).
   * @param idSystem Identificador del sistema/proyecto.
   * @returns Entidad o `null` si no existe asociada.
   */
  abstract getBySystemId(idSystem: number): Observable<SystemInfoEntity | null>;

  /**
   * Actualiza una entidad por ID.
   * @param id ID de `SystemInfo` a actualizar.
   * @param body DTO de Upsert.
   * @param file Archivo opcional (por ejemplo, imagen) a adjuntar.
   */
  abstract update(id: number, body: SystemInfoUpsertEntity, file?: File | null): Observable<SystemInfoEntity>;

  /**
   * Actualiza una entidad referenciándola por `idSystem` (FK).
   * @param idSystem Identificador del sistema/proyecto.
   * @param body DTO de Upsert.
   */
  abstract updateBySystemId(idSystem: number, body: SystemInfoUpsertEntity): Observable<SystemInfoEntity>;

  /**
   * Elimina un DataItem asociado a un `SystemInfo`.
   * @param systemInfoId ID del `SystemInfo` padre.
   * @param idItem ID del DataItem a eliminar.
   */
  abstract deleteItem(systemInfoId: number, idItem: number): Observable<void>;

  /**
   * Crea una nueva entidad.
   * @param body DTO de Upsert con los datos de creación.
   * @param file Archivo opcional a adjuntar (imagen, etc.).
   */
  abstract create(body: SystemInfoUpsertEntity, file?: File | null): Observable<SystemInfoEntity>;

  // ⬇️ NUEVO: listado paginado filtrado por environment (DEV/TST/PRD)
  /**
   * Obtiene un listado paginado filtrado por ambiente (DEV/TST/PRD),
   * respetando paginación y filtros de texto/orden.
   * @param env Código de ambiente (p. ej., 'DEV' | 'TST' | 'PRD').
   * @param req Parámetros de paginación y filtros (`search`, `sortBy`, `desc`).
   */
  abstract getByEnvironment(env: string, req: {
    page: number; size: number; search?: string | null; sortBy?: string | null; desc?: boolean;
  }): Observable<PagedResult<SystemInfoEntity>>;
}
