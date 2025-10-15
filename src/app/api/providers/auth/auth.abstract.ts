import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
// import { LoginRequestEntity } from "../../entities/auth/loginRequest.entity";
import { LoginDominioRequest } from "../../entities/auth/LoginDominioRequest ";
import { AuthSnapshot } from "../../entities/auth/AuthSnapshotEntity ";

// Contrato nuevo: el front no maneja tokens, solo TTL
export interface SessionTTL {
  expiresInSeconds: number;
    id?: number;
  rol?: number;
  idSector?:number;
}

@Injectable()
export abstract class AbstractAuthProvider {
    abstract login(body: LoginDominioRequest): Observable<AuthSnapshot>;
  abstract logout(): Observable<void>;
}
