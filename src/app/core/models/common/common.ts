// Envoltorio estándar de tus endpoints (ServiceResult<T>)
export interface ServiceResult<T> {
  succeeded: boolean;  // true si la operación fue OK
  code: number;        // código HTTP (200, 201, etc.)
  data: T | null;      // el payload real (o null si falló)
  errors?: string[];   // mensajes de error opcionales
  message?: string | null; // mensaje opcional
}

// Paginado estándar (lo que viene dentro de data)
export interface PagedResult<T> {
  items: T[];   // elementos de la página actual
  page: number; // número de página (1-based)
  size: number; // tamaño de página
  total: number;// total de registros
}


export interface PagedRequest {
  page: number;
  size: number;
  search?: string | null;
  sortBy?: string | null;
  desc?: boolean;
}