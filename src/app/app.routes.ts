import { Routes } from '@angular/router';
import { PokemonList } from './components/pokemon-list/pokemon-list';
import { PokemonDetail } from './components/pokemon-detail/pokemon-detail';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: PokemonList },
  { path: 'pokemon/:name', component: PokemonDetail },
  { 
    path: 'dashboard', 
    component: Dashboard, 
    canActivate: [authGuard] // Apply the guard here
  },
  { path: '**', redirectTo: '' } // Wildcard route for 404s
];