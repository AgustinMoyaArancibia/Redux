// Respuesta mínima que te conviene devolver desde el backend
// (tokens opcionales porque seguramente uses cookies HttpOnly)
// export interface AuthSnapshotEntity {
//   id: number;
//   rol: number;
//   idSector: number;
//   expiresInSeconds: number;   // vida del access (para calcular expiresAt)
//   accessToken?: string | null;
//   refreshToken?: string | null;
// }
// export type LoginResponseEntity = AuthSnapshotEntity;

export interface AuthSnapshot {
  userName: string;
  nombreCompleto: string;
  grupos: string[];
  mail: string;

  idEmpleado: number | null;
  sectorId: number | null;
  sector: string | null;
  gerenciaId: number | null;
  gerencia: string | null;
}

export interface LoginDominioApiResponse {
  mensaje: string;
  login: {
    mensaje: string;
    objetoDevuelto: {
      userName: string;
      nombreCompleto: string;
      grupos: string[];
      mail: string;
    };
  };
  perfil: {
    idEmpleado: number | null;
    sectorId: number | null;
    sector: string | null;
    gerenciaId: number | null;
    gerencia: string | null;
  };
}