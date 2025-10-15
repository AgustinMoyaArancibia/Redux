// pages/login/login.component.ts
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';

import { AppState } from '../../../store/app.state';
import { selectAuthError, selectAuthLoading, selectIsAuthenticated } from '../../../store/selectors/auth/auth.selector';
import { authLogin } from '../../../store/actions/auth/auth.action';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule, CardModule, InputTextModule, PasswordModule,
    ButtonModule, DividerModule, CheckboxModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private msg = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private sub?: Subscription;

  remember = signal(true);
  userName = signal('');     // ⬅️ antes 'email'
  password = signal('');

  loading$ = this.store.select(selectAuthLoading);

  private returnUrl: string = '/systemsInfo';

  ngOnInit() {
    this.sub = new Subscription();

    // leer returnUrl si venías redirigido por un guard
    const q = this.route.snapshot.queryParamMap.get('returnUrl');
    if (q) this.returnUrl = q;

    // éxito -> toast y navegar
    this.sub.add(
      this.store.select(selectIsAuthenticated).subscribe(ok => {
        if (ok) {
          this.msg.add({
            severity: 'success',
            summary: 'Bienvenido',
            detail: 'Sesión iniciada.',
            life: 1200
          });
          setTimeout(() => this.router.navigateByUrl(this.returnUrl), 1200);
        }
      })
    );

    // error -> toast
    this.sub.add(
      this.store.select(selectAuthError).subscribe(err => {
        if (err) {
          this.msg.add({
            severity: 'error',
            summary: 'No se pudo iniciar sesión',
            detail: typeof err === 'string' ? err : 'Revisá tus credenciales.',
            life: 3000
          });
        }
      })
    );
  }

  submit() {
    if (this.isSubmitting) return; // evita dobles
    const userName = this.userName().trim();
    const password = this.password();

    if (!userName || !password) {
      this.msg.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Ingresá usuario y contraseña', life: 2000 });
      return;
    }

    this.isSubmitting = true;
    this.msg.add({ severity: 'info', summary: 'Iniciando sesión…', detail: 'Validando credenciales.', life: 1000 });

    this.store.dispatch(authLogin({ body: { userName, password } }));
  }

  // permite enviar con Enter en cualquiera de los inputs
  onKeydownEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') this.submit();
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  isSubmitting = false;


}
