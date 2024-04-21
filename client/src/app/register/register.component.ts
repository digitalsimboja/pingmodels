import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  FormData: FormGroup;
  Error = false;
  PhoneError = false;
  UserNameError = false;
  Submitted = false;
  Success = false;
  ErrorMgs;
  Loading = false;
  unamePattern = '^[a-zA-Z0-9_-]{3,15}$';
  pwdPattern = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).*$';
  mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  

  constructor(private Fb: FormBuilder, private AuthServices: AuthServiceService, private router: Router) {
    this.FormData = this.Fb.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required, Validators.pattern(this.unamePattern)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      phoneNumber: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.pattern(this.pwdPattern)])],
      confirmPassword: ['', Validators.compose([Validators.required])],
      acceptTerms: ['', Validators.compose([Validators.required])],
    },
      { validator: this.MustMatch('password', 'confirmPassword') });
  }

  ngOnInit(): void {
  }

  ////////////create a MustMatch function
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  ////////////////////Process form
  get f() { return this.FormData.controls; }

  ProcessForm() {
    this.Submitted = true;

    if (!this.FormData.valid) { 
      return false; 
    } else {

      this.Loading = true;

      this.AuthServices.CreateUser(this.FormData.value).subscribe(
        data => {
          this.Error = false; 
          this.Success = true;
          this.router.navigateByUrl('/model/login');
          Swal.fire("Registration successful!");
        },
        error => { this.Error = true; this.ErrorMgs = error.Response; });

    }
  }

}
