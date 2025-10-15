import { Component, inject } from '@angular/core';
import { selectDataItemError, selectDataItemLoading, selectDataItems } from '../../../store/selectors/dataItem/dataItem.selector';
import { loadDataItem } from '../../../store/actions/dataItem/dataItem.action';
import { AppState } from '../../../store/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-data-items',
  standalone: true,
  imports: [],
  templateUrl: './data-items.component.html',
  styleUrl: './data-items.component.scss'
})
export class DataItemsComponent {

    private store = inject<Store<AppState>>(Store);
  
    dataItem$ = this.store.select(selectDataItems);
    loading$ = this.store.select(selectDataItemLoading);
    error$ = this.store.select(selectDataItemError);
    ngOnInit(): void {
  
      this.store.dispatch(loadDataItem({ page: 1, size: 20, search: null, sortBy: null, desc: false }));
  
    }


}
