import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractAuthProvider } from '../../../api/providers/auth/auth.abstract';
import { AuthSnapshot } from '../../../api/entities/auth/AuthSnapshotEntity ';
import { LoginDominioRequest } from '../../../api/entities/auth/LoginDominioRequest ';


@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: AbstractAuthProvider) {}

  login(body: LoginDominioRequest): Observable<AuthSnapshot> {
    return this.api.login(body);
  }

  logout(): Observable<void> {
    return this.api.logout();
  }
}
