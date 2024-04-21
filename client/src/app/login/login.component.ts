import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { Router } from '@angular/router';
//import { UserModel } from 'src/app/Models/UserModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  Loading = false;
  LoginError = false;
  FormData: FormGroup;
  Submitted = false;
  unamePattern = '^[a-zA-Z0-9_-]{3,15}$';
  pwdPattern = '^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$';
  mobnumPattern = '^((\\+91-?)|0)?[0-9]{10}$';
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor(private Fb: FormBuilder, private AuthService: AuthServiceService, private router: Router) {

    this.FormData = this.Fb.group({

      username: ['', Validators.compose([Validators.required, Validators.pattern(this.unamePattern)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(7)])],
      RememberMe: ['', Validators.compose([])]

    });

  }

  ngOnInit(): void {
    this.AuthService.LogOut();
    localStorage.removeItem('access_token');
    localStorage.clear();
  }

  get f() { 
    return this.FormData.controls; 
  }

  ProcessForm() {
    this.Submitted = true;

    if (!this.FormData.valid) { 
      return false; 
    } else {
      this.Loading = true;
      const LoginModel = { 
        username: this.FormData.controls.username.value, 
        password: this.FormData.controls.password.value 
      };
      this.AuthService.Login(LoginModel).subscribe(
        data => {
           this.AuthService.ReturnUrl = this.router.navigateByUrl('/model/profile');
        }
        , err => { 
          this.Loading = false; this.LoginError = true; });
          
    }
  }

}
