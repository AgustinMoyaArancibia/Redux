import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { APP_CONFIG } from "../../../../environments/environment.dev";
import { PokemonEntity } from "../../entities/pokemons/pokemon.entity";
import { AbstractDummyProvider } from "./dummy.abstract";

@Injectable()
export class DummyProvider extends AbstractDummyProvider {
    private url: string = `${APP_CONFIG.dummyAPiURL}/{id}`;

    constructor(private httpClient: HttpClient) {
        super();
    }

    override getDummyData(id: number): Observable<PokemonEntity> {
        return this.httpClient.get<PokemonEntity>(
            this.url.replace('{id}', id.toString())
        ).pipe(
            map((response) => {
                return {
                    name: response.name
                }
            })
        );
    }

}