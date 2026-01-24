import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

/**
 * Header component containing navigation buttons.
 */
@Component({
  selector: 'app-header',
  imports: [RouterModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
