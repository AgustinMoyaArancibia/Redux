// import { Component, inject, OnInit } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { AppState } from '../../../store/app.state';
// import { selectDevEnvironmentError, selectDevEnvironmentLoading, selectDevEnvironments } from '../../../store/selectors/DevEnvironment/devEnvironment.selector';
// import { loadDevEnvironments } from '../../../store/actions/DevEnvironment/devEnvironment.action';

// @Component({
//   selector: 'app-dev-environments',
//   standalone: true,
//   imports: [],
//   templateUrl: './dev-environments.component.html',
//   styleUrl: './dev-environments.component.scss'
// })
// export class DevEnvironmentsComponent implements OnInit {

//   private store = inject<Store<AppState>>(Store);

//   devEnvironments$ = this.store.select(selectDevEnvironments);
//   loading$ = this.store.select(selectDevEnvironmentLoading);
//   error$ = this.store.select(selectDevEnvironmentError);
//   ngOnInit(): void {

//     this.store.dispatch(loadDevEnvironments({ page: 1, size: 20, search: null, sortBy: null, desc: false }));

//   }

// }
