import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validator, ValidatorFn, Validators } from '@angular/forms';
import { FirstkeyPipe } from '../../shared/Pipe/firstkey.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FirstkeyPipe, RouterLink],
  templateUrl: './registration.component.html',
  styles: ``
})
export class RegistrationComponent implements OnInit {
  form: any;
  isSubmitted: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router) {
    this.form = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9])/)
      ]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.router.navigateByUrl('/dashboard');
    }
   }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }

    return null;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    console.log(this.form.value);
    if (this.form.valid) {
      this.authService.createUser(this.form.value)
        .subscribe({
          next: (res:any) => {
            if(res.succeeded)
            {
              this.form.reset();
              this.isSubmitted = false;
              this.toastr.success('User registered successfully!','Success');
              console.log("Hi Hello");
            }
            else
            {
              if(res.error.errors){
              res.error.errors.forEach((x :any) => {
                switch (x.code) {
                  case 'DuplicateUserName':
                    break;
                  
                  case 'DuplicateEmail':
                    this.toastr.error('Email is already taken','Registration failed');
                    break;
                
                  default:
                    this.toastr.error('Contact the developer','Registration failed');
                    break;
                } 
              })
              }
            }
          },
          error: (err) => console.log(err)

        });
    }
  }

  hasDisplayableError = (controlName: string): Boolean => {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
      (Boolean(control?.touched) || this.isSubmitted || Boolean(control?.dirty));
  }
}
