import { Component } from '@angular/core';

import { Layout } from './core/layout/layout';

/**
 * Root component (selector "app-root", used in index.html).
 * Its only job is to display the layout; pages appear inside the layout.
 */
@Component({
  selector: 'app-root',
  imports: [Layout],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
