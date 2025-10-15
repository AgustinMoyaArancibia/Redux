import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { APP_CONFIG } from '../environments/environment.dev';
import { getDummyData, ResetDummyData } from './store/actions/dummy/dummy.actions';
import { AppState } from './store/app.state';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  title = 'Syscat';


  private store = inject(Store<AppState>);

constructor() {

}


  ngOnInit() {

  }

}
