// logs.component.ts
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectLogError, selectLogLoading, selectLogs, selectPage, selectSize, selectTotal } from '../../../store/selectors/logs/log.selectors';
import { loadLogs } from '../../../store/actions/logs/log.action';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { CommonModule, AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TableModule } from "primeng/table";
import { Router } from '@angular/router';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [ScrollTopModule,ButtonModule, CommonModule, MenuModule, FormsModule,
    AsyncPipe, DatePipe, NgFor, NgIf,
    PaginatorModule, InputTextModule, DividerModule, TagModule,
    ToastModule, DropdownModule, SkeletonModule, TableModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent {
  private store = inject<Store<AppState>>(Store);
 private router = inject(Router);
  logs$ = this.store.select(selectLogs);
  loading$ = this.store.select(selectLogLoading);
  error$ = this.store.select(selectLogError);
  page$    = this.store.select(selectPage);
  size$    = this.store.select(selectSize);
  total$   = this.store.select(selectTotal);

  private lastSearch = '';
  private lastSortBy: string | undefined = 'timestamp';
  private lastDesc = true;

  ngOnInit() {
    this.store.dispatch(loadLogs({ page: 1, size: 20, search: undefined, sortBy: this.lastSortBy, desc: this.lastDesc }));
  }

  first = 0; // índice base 0 de la primera fila visible

onPageChange(e: any) {
  this.first = e.first ?? 0;                 // sincronizá el control
  const page = (e.page ?? 0) + 1;
  const size = e.rows ?? 20;
  this.store.dispatch(loadLogs({ page, size, search: this.lastSearch || undefined, sortBy: this.lastSortBy, desc: this.lastDesc }));
}

onSearch(ev: Event) {
  const value = (ev.target as HTMLInputElement).value?.trim() ?? '';
  this.lastSearch = value;
  this.first = 0;                            // ⬅️ forzá volver a página 1 en el UI
  this.store.dispatch(loadLogs({ page: 1, size: 20, search: value || undefined, sortBy: this.lastSortBy, desc: this.lastDesc }));
}

  trackById = (_: number, row: any) => row.id;

  statusToSeverity(code: number): 'success' | 'info' | 'warn' | 'danger' | undefined {
    if (code >= 200 && code < 300) return 'success';
    if (code >= 300 && code < 400) return 'info';
    if (code >= 400 && code < 500) return 'warn';
    if (code >= 500) return 'danger';
    return undefined;
  }

  navigateCat(){

 this.router.navigate(['/systemsInfo']);
  }
}
