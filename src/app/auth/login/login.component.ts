import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword: boolean = false;
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.createForm();
  }
  get form() { return this.loginForm.controls; }
  createForm() {
    const userEmail = localStorage.getItem('UserNameorEmail');
    const rememberMe = localStorage.getItem("rememberMe");
    this.loginForm = new FormGroup({
      email: new FormControl(userEmail != null ? localStorage.getItem("UserNameorEmail") : "", [Validators.required]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(rememberMe == null ? false : true)
    });
  }

  login() {
    const rememberMe = this.form.rememberMe.value;

    if (rememberMe) {
      localStorage.setItem("UserNameorEmail", this.form.email.value);
      localStorage.setItem("rememberMe", rememberMe);
    }
    else {
      localStorage.removeItem("Email");
      localStorage.removeItem("rememberMe");
    }
    localStorage.setItem("Token", "admin");
    this.router.navigateByUrl('');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  register() {
    this.router.navigateByUrl('auth/register');
  }
}