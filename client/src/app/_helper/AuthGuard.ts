import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../Services/auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 
constructor( private AuthService: AuthServiceService , private router: Router){}

canActivate( route: ActivatedRouteSnapshot , state: RouterStateSnapshot){

    if (this.AuthService.Islogin()){
      this.AuthService.ReturnUrl = state.url;
      return true;

    } else{

   this.router.navigate( ['model/login'], { queryParams: {ReturnUrl: state.url}});

    }


}

  
}
