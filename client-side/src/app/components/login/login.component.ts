import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '@models/users';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  @Input() username = '';
  @Input() password = '';
  @Input() userLogin: User = new User();

  constructor(public router: Router, private authService: AuthenticationService) {}

  ngOnInit(): void {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe((user: User) => {
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
    this.authService.register(this.username, this.password).subscribe((user: User) => {
      if (user && user.token) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.reload();
      } else {
        alert('Erro no login!');
      }
    });
  }
}
