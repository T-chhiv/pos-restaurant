import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-item-layout',
  standalone: false,
  templateUrl: './menu-item-layout.html',
  styleUrl: './menu-item-layout.css',
})
export class MenuItemLayout {
  constructor(private router: Router){}

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
