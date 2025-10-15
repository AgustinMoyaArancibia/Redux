import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PagedRequest, PagedResult, ServiceResult } from "../../../core/models/common/common";
import { SystemInfoEntity } from "../../entities/systemInfos/systemInfo.entity";
import { SystemInfoUpsertEntity } from "../../entities/systemInfos/systemInfoUpsert.entity";
import { AbstractSystemInfoProvider } from "./systemInfo.abstract";
import { API_URL } from "../api-url.token";

/**
 * Provider concreto de SystemInfo que habla con el backend vía HttpClient.
 * Implementa los métodos del `AbstractSystemInfoProvider` usando el endpoint:
 *   {API_URL}/system-info
 *
 * Notas importantes:
 * - En `update` se envía SIEMPRE `multipart/form-data` con `payload` (JSON) y
 *   opcionalmente `image`. No setear manualmente `Content-Type` para dejar que
 *   el navegador defina el boundary.
 * - En `create`, si no hay archivo se permite POST en JSON plano.
 */
@Injectable()
export class SystemInfoProvider extends AbstractSystemInfoProvider {
  /** Base del recurso en la API (inyectada desde `API_URL`). */
  private readonly baseUrl = `${inject(API_URL)}/system-info`;
  constructor(private http: HttpClient) { super(); }

  /**
   * Obtiene listado paginado con filtros opcionales (search/sort/desc).
   * @param req PagedRequest con page/size obligatorios.
   * @returns PagedResult<SystemInfoEntity>
   */
  override getPaged(req: PagedRequest): Observable<PagedResult<SystemInfoEntity>> {
    let params = new HttpParams()
      .set('page', String(req.page))
      .set('size', String(req.size));
    if (req.search != null) params = params.set('search', req.search);
    if (req.sortBy != null) params = params.set('sortBy', req.sortBy);
    if (typeof req.desc === 'boolean') params = params.set('desc', String(req.desc));

    return this.http
      .get<ServiceResult<PagedResult<SystemInfoEntity>>>(this.baseUrl, { params })
      .pipe(map(r => r.data!));
  }

  // ⬇️ NUEVO
  /**
   * Obtiene listado paginado filtrado por ambiente (DEV/TST/PRD),
   * respetando el resto de filtros (search/sort/desc).
   * @param env Ambiente a filtrar.
   * @param req Parámetros de paginación y filtros.
   */
  override getByEnvironment(
    env: string,
    req: { page: number; size: number; search?: string | null; sortBy?: string | null; desc?: boolean }
  ): Observable<PagedResult<SystemInfoEntity>> {
    let params = new HttpParams()
      .set('page', String(req.page))
      .set('size', String(req.size));
    if (req.search != null) params = params.set('search', req.search);
    if (req.sortBy != null) params = params.set('sortBy', req.sortBy);
    if (typeof req.desc === 'boolean') params = params.set('desc', String(req.desc));

    return this.http
      .get<ServiceResult<PagedResult<SystemInfoEntity>>>(`${this.baseUrl}/by-env/${encodeURIComponent(env)}`, { params })
      .pipe(map(r => r.data!));
  }

  /**
   * Obtiene un SystemInfo por su ID.
   * @param id Identificador de la entidad.
   */
  override getById(id: number): Observable<SystemInfoEntity> {
    return this.http
      .get<ServiceResult<SystemInfoEntity>>(`${this.baseUrl}/${id}`)
      .pipe(map(r => r.data!));
  }

  /**
   * Obtiene un SystemInfo por `idSystem` (FK de proyecto).
   * Puede devolver `null` si no existe para ese sistema.
   */
  override getBySystemId(idSystem: number): Observable<SystemInfoEntity | null> {
    return this.http
      .get<ServiceResult<SystemInfoEntity | null>>(`${this.baseUrl}/by-system/${idSystem}`)
      .pipe(map(r => r.data)); // puede venir null si no existe
  }

  /**
   * Actualiza un SystemInfo por ID enviando SIEMPRE multipart/form-data.
   * - Campo `payload`: JSON.stringify(body)
   * - Campo `image`: archivo opcional
   * @param id ID de la entidad a actualizar.
   * @param body DTO de upsert.
   * @param file Archivo de imagen opcional.
   */
  override update(id: number, body: SystemInfoUpsertEntity, file?: File | null): Observable<SystemInfoEntity> {
    const url = `${this.baseUrl}/${id}`;

    // ——— un solo camino: multipart siempre ———
    const form = new FormData();
    form.append('payload', JSON.stringify(body));
    if (file) form.append('image', file, file.name);

    return this.http
      .put<ServiceResult<SystemInfoEntity>>(url, form)
      .pipe(map(r => r.data!));
  }

  /**
   * Actualiza por FK (`idSystem`) en JSON (sin archivo).
   */
  override updateBySystemId(idSystem: number, body: SystemInfoUpsertEntity): Observable<SystemInfoEntity> {
    return this.http
      .put<ServiceResult<SystemInfoEntity>>(`${this.baseUrl}/by-system/${idSystem}`, body)
      .pipe(map(r => r.data!));
  }

  /**
   * Elimina un DataItem asociado a un SystemInfo.
   * @param systemInfoId ID del SystemInfo padre.
   * @param idItem ID del DataItem a eliminar.
   */
  override deleteItem(systemInfoId: number, idItem: number): Observable<void> {
    return this.http
      .delete<ServiceResult<boolean>>(`${this.baseUrl}/${systemInfoId}/dataitems/${idItem}`)
      .pipe(map(() => void 0));
  }

  /**
 * Crea un SystemInfo.
 * - Con archivo: multipart a /with-image (si usaste Opción A en el back).
 * - Sin archivo: JSON a la ruta base.
 * No setear Content-Type manualmente con multipart (el browser pone el boundary).
 */
  override create(body: SystemInfoUpsertEntity, file?: File | null): Observable<SystemInfoEntity> {
    if (file) {
      const form = new FormData();

      // ✅ Enviar payload como Blob con content-type JSON
      form.append('payload', new Blob([JSON.stringify(body)], { type: 'application/json' }));

      // El nombre del campo debe coincidir con el del back: "image"
      form.append('image', file, file.name);

      // Si en el back implementaste la Opción A (rutas distintas):
      const url = `${this.baseUrl}/with-image`;

      return this.http
        .post<ServiceResult<SystemInfoEntity>>(url, form) // no seteés Content-Type
        .pipe(map(r => r.data!));
    }

    // Sin archivo ⇒ JSON (el back lo acepta)
    return this.http
      .post<ServiceResult<SystemInfoEntity>>(this.baseUrl, body)
      .pipe(map(r => r.data!));
  }
}
