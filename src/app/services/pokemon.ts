import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private http = inject(HttpClient);
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  // Fetches a list of Pokemon
  getPokemons(limit: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?limit=${limit}`);
  }

  // Fetches details for a specific Pokemon
  getPokemonDetail(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${name}`);
  }
}