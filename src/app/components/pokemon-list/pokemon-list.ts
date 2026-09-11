import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon';

@Component({
  selector: 'app-pokemon-list',
  imports: [RouterLink],
  templateUrl: './pokemon-list.html'
})
export class PokemonList implements OnInit {
  private pokemonService = inject(PokemonService);

  // State managed via Signals
  pokemons = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.pokemonService.getPokemons(800).subscribe({
      next: (data) => {
        this.pokemons.set(data.results);
        this.isLoading.set(false); // Triggers immediate template re-render
      },
      error: (err) => {
        console.error('HTTP Request failed:', err);
        this.isLoading.set(false);
      }
    });
  }
}