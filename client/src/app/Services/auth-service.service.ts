import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { logging } from 'protractor';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, retry, catchError, tap } from 'rxjs/operators';
import { UserModel } from '../Models/user';
import { Account } from '../Models/account';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Photo } from '../Models/photo';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private Http: HttpClient, private router: Router) { }



  ReturnUrl: any;


  //Create User //http://localhost:3000/api/users/register

  CreateUser(UserModel) {
    return this.Http.post(environment.ApiPath + 'users/register', UserModel)
      .pipe(retry(1), catchError(this.errorHandle));
  }

  //// Login //http://localhost:3000/api/profile/authenticate

  Login(Model: { username: any; password: any; }) {
    return this.Http.post<UserModel>(environment.ApiPath + 'users/login', Model).pipe(map(UserModel => {
     
      localStorage.setItem('accessToken', UserModel.accessToken);
      localStorage.setItem('refreshToken', UserModel.refreshToken);
      localStorage.setItem('username', UserModel.username);

     

      return UserModel;
    }
    ), catchError(this.errorHandle));

  }

  //// logout

  LogOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return this.Http.delete(environment.ApiPath + 'users/logout');

  }

  /// Refresh token
  RefreshToken(refreshToken: string) {

    return this.Http.post<UserModel>(environment.ApiPath + 'users/Refresh_Token', { refreshToken })
      .pipe(map(UserModel => {

        localStorage.setItem('accessToken', UserModel.accessToken);
        localStorage.setItem('refreshToken', UserModel.refreshToken);

      }), catchError(this.errorHandle));

  }



  ///API Services FindUserName
  FindUserName(username) {
    let params = new HttpParams().set('username', username);

    return this.Http.get<UserModel>(environment.ApiPath + 'users/finduser/:username', { params })
      .pipe(retry(1), catchError(this.errorHandle));

  }

  //Get user public profiles
  getUserProfile(): Observable<any> {

    return this.Http.get<any>(environment.ApiPath + 'users/profile')
      .pipe(retry(1), catchError(this.errorHandle));
  }

  getUsers(): Observable<UserModel[]> {
    return this.Http.get<UserModel[]>(environment.ApiPath + 'users/')
      .pipe(retry(1), catchError(this.errorHandle));
  }
  

  getUserPublicPhotosById(userId): Observable<Photo[]> {
    let params = new HttpParams().set('userId', userId);


    return this.Http.get<Photo[]>(environment.ApiPath + 'users/' + userId + '/public/photos/', { params: params })
      .pipe(retry(1), catchError(this.errorHandle));


  }

  getUserPublicVideosById(userId): Observable<any> {
    let params = new HttpParams().set('userId', userId);

    return this.Http.get<any>(environment.ApiPath + 'users/' + userId + '/public/videos/', { params: params })
      .pipe(retry(1), catchError(this.errorHandle));


  }


  getUserPrivatePhotosById(userId): Observable<any> {
    let params = new HttpParams().set('userId', userId);

    return this.Http.get<any>(environment.ApiPath + 'users/' + userId + '/private/photos/', { params: params })
      .pipe(retry(1), catchError(this.errorHandle));


  }

  getUserPrivateVideosById(userId): Observable<any> {
    let params = new HttpParams().set('userId', userId);

    return this.Http.get<any>(environment.ApiPath + 'users/' + userId + '/private/videos/', { params: params })
      .pipe(retry(1), catchError(this.errorHandle));


  }


  getUserById(userId: string): Observable<any> {
    let params = new HttpParams().set('userId', userId);

    return this.Http.get<any>(environment.ApiPath + 'users/' +userId, { params })
      .pipe(retry(1), catchError(this.errorHandle));
  }

  changeDp(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.Http.patch(environment.ApiPath + 'users/profile', formData)
      .pipe(retry(1), catchError(this.errorHandle));

  }

  changeCoverPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.Http.patch(environment.ApiPath + 'users/addCoverPhoto', formData)
      .pipe(retry(1), catchError(this.errorHandle));

  }

  updateProfile(user: UserModel): Observable<any> {
    const formData = new FormData();
    formData.append('bio', user.bio);
    formData.append('phoneNumber', user.phoneNumber);
    formData.append('email', user.email);


    return this.Http.patch(environment.ApiPath + 'users/updateProfile', formData)
      .pipe(retry(1), catchError(this.errorHandle));
  }

  getFollowStatus(userId): Observable<any> {
    let params = new HttpParams().set('userId', userId);

    return this.Http.get<any>(environment.ApiPath + 'users/' + userId + '/getFollowStatus/', { params: params })
      .pipe(retry(1), catchError(this.errorHandle));


  }

  follow(userId): Observable<any> {
    let params = new HttpParams().set('userId', userId);

    return this.Http.post<any>(environment.ApiPath + 'users/' + userId + '/follow/', { params: params })
      .pipe(retry(1), catchError(this.errorHandle));


  }

  unfollow(userId): Observable<any> {
    let params = new HttpParams().set('userId', userId);

    return this.Http.delete<any>(environment.ApiPath + 'users/' + userId + '/unfollow/', { params: params })
      .pipe(retry(1), catchError(this.errorHandle));


  }


  ////////////////////////////

  getUsername() {
    return localStorage.getIten('username')
  }

  setToken(token: string) {

    localStorage.setItem('accessToken', token);

  }

  getToken() {

    return localStorage.getItem('token');

  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }


  Islogin() {

    if (localStorage.getItem('accessToken') === null) {
      return false;
    }
    else {
      return true;
    }
  }


  errorHandle(error) {
    let errormgs = {};
    if (error.error instanceof ErrorEvent) {
      // get client side error
      errormgs = error.error.message;
    }
    else {
      // get server-side error
      errormgs = { ErrorCode: error.status, Message: error.message, Response: error.error.Mgs };
    }
    console.log(errormgs);
    return throwError(errormgs);
  }



}
