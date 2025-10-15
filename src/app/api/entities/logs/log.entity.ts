// src/app/shared/audit/entities/log.entity.ts

/**
 * Representa un registro de auditoría (AuditLogMini).
 * Equivalente al DTO AuditLogMiniReadDto del backend.
 */
export interface LogEntity {
  /** Identificador del log (clave primaria). */
  id: number;

  /** Fecha y hora del evento (UTC, ISO). */
  timestamp: string; // DateTimeOffset → ISO string en JSON

  /** Usuario de dominio que ejecutó la acción. */
  username: string;

  /** Acción registrada (por ejemplo, 'Login Exitoso', 'Logout'). */
  action: string;

  /** Método HTTP asociado (GET, POST, PUT, DELETE, etc.). */
  method: string;

  /** Código de estado HTTP devuelto (ej: 200, 401, 500). */
  status: number;
}
