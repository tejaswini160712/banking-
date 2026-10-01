import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <main class="login-page">
      <section class="login-story" aria-label="People Portal">
        <div class="brand"><span class="brand-mark">P</span><span>People Portal</span></div>
        <div class="story-copy">
          <p class="eyebrow">Your work, in one place</p>
          <h2>Good work starts with people.</h2>
          <p>Connect with your team, find what you need, and make today count.</p>
        </div>
        <div class="story-foot">A better day at work starts here.</div>
      </section>

      <section class="login-panel">
        <div class="login-form-wrap">
          <p class="eyebrow">Employee workspace</p>
          <h1>Welcome back</h1>
          <p class="form-intro">Sign in to continue to your workspace.</p>
          <form [formGroup]="loginForm" (ngSubmit)="signIn()" novalidate>
            <mat-form-field appearance="outline" class="login-field">
              <mat-label>Work email</mat-label>
              <input matInput id="email" type="email" formControlName="email" autocomplete="username" placeholder="you@company.com" />
              @if (email.touched && email.hasError('required')) {
                <mat-error>Enter your work email.</mat-error>
              } @else if (email.touched && email.hasError('email')) {
                <mat-error>Enter a valid email address.</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline" class="login-field">
              <mat-label>Password</mat-label>
              <input matInput id="password" type="password" formControlName="password" autocomplete="current-password" placeholder="At least 8 characters" />
              @if (password.touched && password.hasError('required')) {
                <mat-error>Enter your password.</mat-error>
              } @else if (password.touched && password.hasError('minlength')) {
                <mat-error>Password must be at least 8 characters.</mat-error>
              }
            </mat-form-field>
            <button mat-flat-button class="submit-button" type="submit">Sign in <span aria-hidden="true">→</span></button>
          </form>
          <p class="form-note">Use your employee account to access the team dashboard.</p>
        </div>
      </section>
    </main>
  `,
})
export class LoginComponent {
  readonly loginForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  });

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  constructor(private readonly router: Router) {}

  signIn(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    void this.router.navigateByUrl('/dashboard');
  }
}