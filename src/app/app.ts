import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav style="padding: 10px; background: #eee;">
      <a routerLink="/" style="margin-right: 15px;">Home</a>
      <a routerLink="/dashboard">Secret Dashboard</a>
    </nav>
    <main style="padding: 20px;">
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {}