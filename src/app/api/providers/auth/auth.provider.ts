import { inject, Injectable } from "@angular/core";
import { AbstractAuthProvider } from "./auth.abstract";
import { API_URL } from "../api-url.token";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { ServiceResult } from "../../../modules/commont";
import { AuthSnapshot, LoginDominioApiResponse } from "../../entities/auth/AuthSnapshotEntity ";
import { LoginDominioRequest } from "../../entities/auth/LoginDominioRequest ";


@Injectable()
export class AuthProvider extends AbstractAuthProvider {
  private readonly base = `${inject(API_URL)}/auth`;
  constructor(private http: HttpClient) { super(); }

  override login(body: LoginDominioRequest): Observable<AuthSnapshot> {
    return this.http
      .post<ServiceResult<LoginDominioApiResponse>>(
        `${this.base}/login-dominio`,
        body,
        { withCredentials: true }
      )
      .pipe(
        map(r => {
          if (!r.succeeded || !r.data) {
            throw new Error(r.message ?? "Login fallido");
          }
          const d = r.data;
          const o = d.login?.objetoDevuelto ?? { userName: "", nombreCompleto: "", grupos: [], mail: "" };
          const p = d.perfil ?? { idEmpleado: null, sectorId: null, sector: null, gerenciaId: null, gerencia: null };

          const snap: AuthSnapshot = {
            userName: o.userName ?? "",
            nombreCompleto: o.nombreCompleto ?? "",
            grupos: Array.isArray(o.grupos) ? o.grupos : [],
            mail: o.mail ?? "",
            idEmpleado: p.idEmpleado ?? null,
            sectorId: p.sectorId ?? null,
            sector: p.sector ?? null,
            gerenciaId: p.gerenciaId ?? null,
            gerencia: p.gerencia ?? null
          };
          return snap;
        })
      );
  }

  override logout(): Observable<void> {
    return this.http
      .post(`${this.base}/logout`, {}, { withCredentials: true })
      .pipe(map(() => void 0));
  }
}
