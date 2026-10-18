import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <a routerLink="/about">About</a>
      <span>Copyright &copy; 2021</span>
    </footer>
  `,
  styles: `
    :host {
      width: 100%;
    }

    footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      padding: 12px;
      background-color: #e91e63;
      color: #fff;
    }

    footer a {
      color: #fff;
      text-decoration: none;
    }
  `,
  imports: [RouterModule],
})
export class FooterComponent {}
