import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PokemonEntity } from "../../entities/pokemons/pokemon.entity";
import { AbstractDummyProvider } from "./dummy.abstract";

@Injectable()
export class DummyMockProvider extends AbstractDummyProvider {

    private dummyData: PokemonEntity[] = [
        {
            name: "Pikachu (MOCK)",
        },
        {
            name: "Bulbasaur (MOCK)",
        },
        {
            name: "Charmander (MOCK)",
        },
        {
            name: "Squirtle (MOCK)",
        },
        {
            name: "Jigglypuff (MOCK)",
        },
        {
            name: "Meowth (MOCK)",
        },
        {
            name: "Psyduck (MOCK)",
        }
    ]


    override getDummyData(id: number): Observable<PokemonEntity> {

        return new Observable((observer) => {
            const randomIndex = Math.floor(Math.random() * this.dummyData.length);
            const dummyData: PokemonEntity = this.dummyData[randomIndex];

            observer.next(dummyData);
            observer.complete();
        })
    }
}