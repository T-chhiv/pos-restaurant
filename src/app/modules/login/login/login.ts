import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{
  isVisible: boolean = false;
  form!: FormGroup
  inCorrectLogin:boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb : FormBuilder
  ){}

  ngOnInit(): void {
    this.initForm()
  }

  private initForm(){
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  logIn(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Hide previous error
    this.inCorrectLogin = false;
    const { username, password } = this.form.value;
    this.authService.login(username, password).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.router.navigate(['/home']);
        } else {
          this.form.get('password')?.setErrors({
            incorrectLogin: true
          });
          this.form.get('username')?.setErrors({
            incorrectLogin: true
          });
        }
      },
    });
  }

  checkPasswordVisible(){
    this.isVisible = !this.isVisible;
  }
  
}
