import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectSystemProjectError, selectSystemProjectLoading, selectSystemProjects } from '../../../store/selectors/systemProjects/systemProject.selector';
import { loadSystemProjects } from '../../../store/actions/systemProjects/systemProject.action';

@Component({
  selector: 'app-system-projects',
  standalone: true,
  imports: [],
  templateUrl: './system-projects.component.html',
  styleUrl: './system-projects.component.scss'
})
export class SystemProjectsComponent {
  private store = inject<Store<AppState>>(Store);

  roles$ = this.store.select(selectSystemProjects);
  loading$ = this.store.select(selectSystemProjectLoading);
  error$ = this.store.select(selectSystemProjectError);

  ngOnInit() {

    this.store.dispatch(loadSystemProjects({ page: 1, size: 20, search: null, sortBy: null, desc: false }));
    // this.store.dispatch(getRoleById({id:1}))
    // this.store.dispatch(updateRole({id:1 , changes: {description : "admin2" }}))
  }
}
