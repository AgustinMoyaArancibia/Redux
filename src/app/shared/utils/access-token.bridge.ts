import { Store } from "@ngrx/store";
import { AppState } from "../../store/app.state";
import { selectAccessToken } from "../../store/selectors/auth/auth.selector";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AccessTokenBridge {
  private current: string | null = null;
  constructor(store: Store<AppState>) {
    store.select(selectAccessToken).subscribe(t => { this.current = t; });
  }
  get token() { return this.current; }
}
