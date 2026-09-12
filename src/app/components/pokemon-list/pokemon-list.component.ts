import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokemonService, PokemonListItem } from '../../services/pokemon.service';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [FormsModule, PokemonCardComponent],
  template: `
    <section class="pokedex-list-view">
      <!-- Search and Controls Bar -->
      <div class="toolbar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Filter Pokémon by name..." 
            [(ngModel)]="searchTerm"
            aria-label="Search Pokémon"
          />
          @if (searchTerm()) {
            <button class="clear-btn" (click)="searchTerm.set('')">✕</button>
          }
        </div>

        <div class="pagination-info">
          <span>Page <strong>{{ currentPage() }}</strong></span>
        </div>
      </div>

      <!-- Action feedback alert -->
      @if (lastFavorited()) {
        <div class="alert-banner">
          ⭐ Added <strong>{{ lastFavorited() }}</strong> to your trainer list!
        </div>
      }

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Catching Pokémon from API...</p>
        </div>
      } 
      <!-- Empty State -->
      @else if (filteredPokemons().length === 0) {
        <div class="empty-state">
          <p>No Pokémon matching "<strong>{{ searchTerm() }}</strong>" found on this page.</p>
          <button (click)="searchTerm.set('')" class="btn-primary">Clear Filter</button>
        </div>
      } 
      <!-- Grid of Pokemon Cards -->
      @else {
        <div class="pokemon-grid">
          @for (pokemon of filteredPokemons(); track pokemon.id) {
            <app-pokemon-card 
              [pokemon]="pokemon" 
              (favorite)="handleFavorite($event)"
            />
          }
        </div>
      }

      <!-- Pagination Controls -->
      <footer class="pagination-controls">
        <button 
          class="btn-nav" 
          [disabled]="currentPage() === 1 || isLoading()"
          (click)="previousPage()"
        >
          ← Previous
        </button>

        <span class="page-indicator">
          Page <strong>{{ currentPage() }}</strong>
        </span>

        <button 
          class="btn-nav" 
          [disabled]="!hasNextPage() || isLoading()"
          (click)="nextPage()"
        >
          Next →
        </button>
      </footer>
    </section>
  `,
  styles: [`
    .pokedex-list-view {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px 16px;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .search-box {
      display: flex;
      align-items: center;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 9999px;
      padding: 8px 18px;
      flex: 1;
      max-width: 420px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      transition: border-color 0.2s ease;
    }

    .search-box:focus-within {
      border-color: #e3350d;
    }

    .search-icon {
      margin-right: 8px;
      font-size: 1rem;
    }

    .search-box input {
      border: none;
      outline: none;
      width: 100%;
      font-size: 1rem;
      font-family: inherit;
    }

    .clear-btn {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 1rem;
    }

    .pagination-info {
      font-size: 0.95rem;
      color: #64748b;
    }

    .alert-banner {
      background: #fef3c7;
      border: 1px solid #fde68a;
      color: #92400e;
      padding: 10px 18px;
      border-radius: 12px;
      margin-bottom: 20px;
      text-transform: capitalize;
    }

    .pokemon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #64748b;
    }

    .spinner {
      width: 44px;
      height: 44px;
      border: 4px solid #e2e8f0;
      border-top-color: #e3350d;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .pagination-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding-top: 16px;
    }

    .btn-nav {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 10px 22px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      color: #1e293b;
      transition: all 0.2s ease;
    }

    .btn-nav:hover:not(:disabled) {
      background: #e3350d;
      color: #ffffff;
      border-color: #e3350d;
    }

    .btn-nav:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #e3350d;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 12px;
      cursor: pointer;
    }
  `]
})
export class PokemonListComponent implements OnInit {
  private pokemonService = inject(PokemonService);

  // State Signals
  pokemons = signal<PokemonListItem[]>([]);
  isLoading = signal<boolean>(true);
  searchTerm = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = signal<number>(20);
  hasNextPage = signal<boolean>(true);
  lastFavorited = signal<string | null>(null);

  // Computed Signal: calculates the current offset reactively
  offset = computed(() => (this.currentPage() - 1) * this.pageSize());

  // Computed Signal: real-time filtered list based on search term
  filteredPokemons = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    if (!query) {
      return this.pokemons();
    }
    return this.pokemons().filter((p) => p.name.toLowerCase().includes(query));
  });

  ngOnInit(): void {
    this.fetchPokemons();
  }

  fetchPokemons(): void {
    this.isLoading.set(true);
    this.pokemonService.getPokemons(this.pageSize(), this.offset()).subscribe({
      next: (response) => {
        this.pokemons.set(response.results);
        this.hasNextPage.set(!!response.next);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching pokemons:', err);
        this.isLoading.set(false);
      }
    });
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage.update((page) => page + 1);
      this.fetchPokemons();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      this.fetchPokemons();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  handleFavorite(pokemon: PokemonListItem): void {
    this.lastFavorited.set(pokemon.name);
    setTimeout(() => {
      this.lastFavorited.set(null);
    }, 3000);
  }
}
