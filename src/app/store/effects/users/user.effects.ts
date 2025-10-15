import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../../core/services/user/user.service";
import { exhaustMap, map, catchError, of, mergeMap } from "rxjs";
import { getDummyData } from "../../actions/users/user.action";


@Injectable(
    {
        providedIn: 'root'
    }
)
export class UserEffects {

    constructor(
        private actions$: Actions,
        private userService: UserService
    ) { }


      loadPaged$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getDummyData),
            mergeMap((action) =>
                this.userService.getPagedUsers(
                    action.pageIndex,
                    action.pageSize,
                    action.search ?? undefined,
                    action.sortBy ?? undefined,
                    action.desc
                ).pipe(
                    map(data => ({ type: '[User API] Users Loaded Success', data }) ),
                    catchError(() => of({ type: '[User API] Users Loaded Error' }))
                )                       
            )
        )
    );

   
}