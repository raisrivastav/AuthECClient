import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-layout.component.html',
  styles: ``
})
export class MainLayoutComponent {

    constructor(private router : Router,
    private authService: AuthService)
    {
    }

  onLogout(){
    this.authService.deleteToken();
    this.router.navigateByUrl('/signin');
  }

}
