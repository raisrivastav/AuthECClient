import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styles: ``
})

export class LoginComponent implements OnInit {
  form: any;
  isSubmitted : boolean = false;


  constructor(public formBuilder : FormBuilder,
    private service: AuthService,
    private route : Router,
    private tostr: ToastrService
  ) {
    this.form = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      })
   }

   ngOnInit(): void {
    if(this.service.isLoggedIn()){
      this.route.navigateByUrl('/dashboard');
    }
   }

hasDisplayableError = (controlName: string): Boolean => {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
      (Boolean(control?.touched) || this.isSubmitted || Boolean(control?.dirty));
  }

  onSubmit(){
    this.isSubmitted = true;
    console.log(this.form.value);
    if (this.form.valid) {
      this.service.signin(this.form.value).subscribe
      ({
        next: (res:any) => {
          this.service.saveToken(res.token);
          this.route.navigateByUrl('/dashboard');
        },
        error: (err:any) => {
          console.log(err);
          if(err.status == 400)
          {
            this.tostr.error('Invalid email or password','Login failed');
          }
          else
          {
            console.log('error during login:', err);
          }
        }
      })
    }
  }
}
