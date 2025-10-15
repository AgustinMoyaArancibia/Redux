import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectAreaError, selectAreaLoading, selectAreas } from '../../../store/selectors/area/area.selectors';
import { loadAreas } from '../../../store/actions/areas/area.action';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.scss'
})
export class AreasComponent {
 private store = inject<Store<AppState>>(Store);

  areas$ = this.store.select(selectAreas);
  loading$ = this.store.select(selectAreaLoading);
  error$ = this.store.select(selectAreaError);
  ngOnInit(): void {

    this.store.dispatch(loadAreas({ page: 1, size: 20, search: null, sortBy: null, desc: false }));

  }

}
