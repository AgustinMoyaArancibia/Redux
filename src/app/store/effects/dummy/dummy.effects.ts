import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, tap } from "rxjs";
import { DummyService } from "../../../core/services/dummy.service";
import { addDummyCounter, getDummyData, ResetDummyData, setDummyData } from "../../actions/dummy/dummy.actions";

@Injectable(
    {
        providedIn: 'root'
    }
)
export class DummyEffects {
    constructor(
        private actions$: Actions,
        private dummyService: DummyService
    ) { }

    GetDummyData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getDummyData),
            mergeMap((action) =>
                this.dummyService.getDummyData(action.id).pipe(
                    mergeMap((data) => [
                        setDummyData({ data: data }),
                        addDummyCounter({ counter: 1 })
                    ])
                )
            )
        )
    )

    ResetStore$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ResetDummyData),
            tap(() => {
                alert('Reset Dummy Data');
            })
        ),
        { dispatch: false }
    )
}