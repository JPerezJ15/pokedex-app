import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon';

@Component({
  selector: 'app-pokemon-detail',
  imports: [RouterLink],
  templateUrl: './pokemon-detail.html'
})
export class PokemonDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);

  // State managed via Signals
  pokemon = signal<any>(null);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');

    if (name) {
      this.pokemonService.getPokemonDetail(name).subscribe({
        next: (data) => {
          this.pokemon.set(data);
          this.isLoading.set(false); // Signals notify Angular to update the UI immediately
        },
        error: (err) => {
          console.error('API Error:', err);
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(false);
    }
  }
}