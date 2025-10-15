export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  hydrated: boolean;

  userName: string | null;
  nombreCompleto: string | null;
  grupos: string[];
  mail: string | null;

  idEmpleado: number | null;
  sectorId: number | null;
  sector: string | null;
  gerenciaId: number | null;
  gerencia: string | null;
}

export const InitialAuthState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  hydrated: false,

  userName: null,
  nombreCompleto: null,
  grupos: [],
  mail: null,

  idEmpleado: null,
  sectorId: null,
  sector: null,
  gerenciaId: null,
  gerencia: null,
};
