import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PokemonEntity } from "../../entities/pokemons/pokemon.entity";


@Injectable({
    providedIn: 'root'
})

export abstract class AbstractDummyProvider {
    abstract getDummyData(id: number): Observable<PokemonEntity>;
}