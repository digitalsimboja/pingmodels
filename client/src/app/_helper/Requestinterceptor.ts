import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthServiceService } from '../Services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';




@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private IsRefreshing = false;
  private RefreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authenticationService: AuthServiceService, 
    ) {
      
    }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  
  
    if (this.authenticationService.Islogin()){
      const token = localStorage.getItem('accessToken');
      request = this.AddToken(request, token);
    }


    return next.handle(request)
      .pipe(catchError(err => {
        if ([401, 403,500].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          //this.authenticationService.LogOut();
          //location.reload(true);

           return   this.Handle401Error(request, next);
           
      }

        // const error = err.error.message || err.statusText;
        const errormgs = { ErrorCode: err.status, Message: err.message, Response: err.error.Mgs };
        // console.log(errormgs);
        return throwError(errormgs);
      }));


  }



  AddToken(request: HttpRequest<any>, token: string){
    return request.clone({
        setHeaders: {Authorization : ` ${token}`}
    });
  }

    private  Handle401Error(request: HttpRequest<any>, next: HttpHandler){
      if (!this.IsRefreshing){
    
        this.IsRefreshing = true;
        this.RefreshTokenSubject.next(null);
    
        return this.authenticationService.RefreshToken(this.authenticationService.getRefreshToken()).pipe(
         switchMap((token: any) => {
               this.IsRefreshing = false;
               this.RefreshTokenSubject.next(token.jwt);
               return next.handle(this.AddToken(request, token.jwt));
    
            })
    
        );
    
    
      } else{
    
    return this.RefreshTokenSubject.pipe(
    filter(token => token != null), take(1), switchMap(jwt => {
        return next.handle(this.AddToken(request, jwt));
    })
    
    );
    
       }
    
    
    
       }
    
    
    
    
    }
    
