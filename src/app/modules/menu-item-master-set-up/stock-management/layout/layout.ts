import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-layout',
    standalone: false,
    templateUrl: './layout.html',
    styleUrl: './layout.css',
})
export class Layout {

    constructor(private router: Router) {}

    isActive(route: string): boolean {
        return this.router.url.startsWith(route);
    }
}