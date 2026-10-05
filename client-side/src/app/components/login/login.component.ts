import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '@services/authentication.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [MatFormFieldModule, MatIconModule, ReactiveFormsModule, MatInputModule, MatDialogModule, MatButtonModule],
})
export class LoginComponent {
  hide = true;
  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });

  constructor(public router: Router, private authService: AuthenticationService) {}

  login(): void {
    const { username, password } = this.loginForm.getRawValue();
    this.authService.login(username, password).subscribe((user) => {
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.reload();
      } else {
        alert('Erro no login!');
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
        localStorage.removeItem('currentUser');
        window.location.reload();
    });
  }

  register(): void{
    const { username, password } = this.loginForm.getRawValue();
    this.authService.register(username, password).subscribe((user) => {
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.reload();
      } else {
        alert('Erro no login!');
      }
    });
  }
}
