import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <div class="header-container">
        <a routerLink="/" class="logo">
          <div class="pokeball-icon">
            <div class="pokeball-top"></div>
            <div class="pokeball-center"></div>
          </div>
          <div>
            <span class="logo-title">PokéDex</span>
            <span class="logo-subtitle">Angular Workshop</span>
          </div>
        </a>

        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link">
            📖 Pokémon List
          </a>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            ⚡ Trainer Dashboard
          </a>
        </nav>
      </div>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer class="app-footer">
      <p>Angular PokéDex Workshop • Powered by PokeAPI & Angular Signals</p>
    </footer>
  `
})
export class App {}