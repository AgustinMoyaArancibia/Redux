import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PokemonEntity } from "../../api/entities/pokemons/pokemon.entity";
import { AbstractDummyProvider } from "../../api/providers/dummy/dummy.abstract";

@Injectable({
    providedIn: 'root'
})

export class DummyService {

    constructor(private provider: AbstractDummyProvider) { }

    getDummyData(id: number): Observable<PokemonEntity> {
        return this.provider.getDummyData(id);
    }

}