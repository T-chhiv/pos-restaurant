import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit{
  private breakpointObserver = inject(BreakpointObserver);

  isMobile = false;

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 960px)'])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  logout(): void {
    console.log('User logged out');
  }
}
