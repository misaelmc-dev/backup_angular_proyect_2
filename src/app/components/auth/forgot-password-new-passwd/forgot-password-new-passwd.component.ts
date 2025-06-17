import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-forgot-password-new-passwd',
  templateUrl: './forgot-password-new-passwd.component.html',
  styleUrls: ['./forgot-password-new-passwd.component.css']
})
export class ForgotPasswordNewPasswdComponent implements OnInit {

  public forgotPasswdNewPasswdForm: FormGroup
  public serverError: boolean
  public passwordReset: boolean
  public email: string
  public token: string

  constructor(public authService: AuthService, public activatedRoute: ActivatedRoute) {
    this.passwordReset = false
    this.serverError = false
    this.token = this.activatedRoute.snapshot.paramMap.get('token') || '';
    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params.email || null
    })
  }

  ngOnInit(): void {
    this.forgotPasswdNewPasswdForm = new FormBuilder().group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      passwordConfirm: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
    }, {validators: [checkPasswordsEqual]});
  }

  get password() { return this.forgotPasswdNewPasswdForm.get('password'); }
  get passwordConfirm() { return this.forgotPasswdNewPasswdForm.get('passwordConfirm'); }

  resetPassword() {
    this.authService.resetPassword(this.email, this.token, this.password.value, this.passwordConfirm.value).subscribe(
      resp => {
        this.serverError = false
        this.passwordReset = true
      },
      error => {
        if (error.status === 422) {
          this.passwordReset = false
          this.serverError = false
        } else {
          this.passwordReset = false
          this.serverError = true
        }
      })
  }

}

export function checkPasswordsEqual (c: AbstractControl): ValidationErrors | null {
  //safety check
  if (c.get('password').value === c.get('passwordConfirm').value)
    return null
  else
    return { notEqualPasswords: true }
}
