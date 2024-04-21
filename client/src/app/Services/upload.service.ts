import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpHeaders, HttpEventType, HttpParams, HttpRequest } from '@angular/common/http';
import { map, catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import {  Photo } from 'src/app/models/photo';
import {  Video } from 'src/app/models/video';
import { AuthServiceService } from './auth-service.service';

const photoUrl = environment.ApiPath +'photos/upload';
const videoUrl = environment.ApiPath +'videos/upload';
const replaceUrl = environment.ApiPath +'photos/replacePhoto/:photoId'


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private Http: HttpClient, private authService: AuthServiceService) { }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `status error code ${error.status}, ` +
        `ERROR!: ${error.error}`);
    }
    return throwError(
      'Error, please try again later.');
  }

  //upload a photo
  addPhoto(photo: Photo, file: File): Observable<any> {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageTitle', photo.imageTitle);
    formData.append('imageDesc', photo.imageDesc);
    formData.append('imageControl', photo.imageControl);

    const header = new HttpHeaders();
    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
      headers: header
    };
    const Url = `${photoUrl}`;
    const req = new HttpRequest('POST', Url, formData, options);
    return this.Http.request(req);

  }

  //Upload a video

  addVideo(video: Video, file: File): Observable<any> {

    const formData = new FormData();
    formData.append('file', file);
    formData.append('videoTitle', video.videoTitle);
    formData.append('videoDesc', video.videoDesc);
    formData.append('videoControl', video.videoControl);

    const header = new HttpHeaders();
    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
      headers: header
    };
    const Url = `${videoUrl}`;
    const req = new HttpRequest('POST', Url, formData, options);
    return this.Http.request(req);

  }

  //
  ///Get All users photos and videos
  getUsersPublicPhotos(): Observable<Photo[]> {
    return this.Http.get<Photo[]>(environment.ApiPath + 'photos/public');
  }

  getUsersPrivatePhotos(): Observable<any> {
    return this.Http.get<Photo[]>(environment.ApiPath + 'photos/private');
  }

  getUsersPublicVideos(): Observable<Video[]> {
    return this.Http.get<Video[]>(environment.ApiPath + 'videos/public');
  }

  getUsersPrivateVideos(): Observable<Video[]> {
    return this.Http.get<Video[]>(environment.ApiPath + 'videos/private');
  }
  
  //Get specific/each photos and videos
  getUserPublicPhotos(): Observable<Photo[]> {
    return this.Http.get<Photo[]>(environment.ApiPath + 'photos/user_public');
  }

  getUserPrivatePhotos(): Observable<Photo[]> {
    return this.Http.get<Photo[]>(environment.ApiPath + 'photos/user_private');
  }

  getUserPublicVideos(): Observable<Video[]> {
    return this.Http.get<Video[]>(environment.ApiPath + 'videos/user_public');
  }

  getUserPrivateVideos(): Observable<Video[]> {
    return this.Http.get<Video[]>(environment.ApiPath + 'videos/user_private');
  }

  replaceUserPhoto(photo: Photo, file: File):Observable<any> {
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageTitle', photo.imageTitle);
    formData.append('imageDesc', photo.imageDesc);
    formData.append('imageControl', photo.imageControl);

    const header = new HttpHeaders();
    const params = new HttpParams();

    const options = {
      params,
      reportProgress: true,
      headers: header
    };
    const Url = `${replaceUrl}`;
    const req = new HttpRequest('POST', Url, formData, options);
    return this.Http.request(req);

  }

  getPhoto(photoId: string): Observable<any>{
     let params = new HttpParams().set('photoId', photoId);
     return this.Http.get<any>(environment.ApiPath + 'photos/viewphoto/', {params})
    .pipe(retry(1), catchError(this.errorHandle));

  }
  getPhotoById(photoId: string): Observable<any>{
    let params = new HttpParams().set('photoId', photoId);
    return this.Http.get<any>(environment.ApiPath + 'photos/'+ photoId, {params})
   .pipe(retry(1), catchError(this.errorHandle));

 }
 getVideoById(videoId: string): Observable<any>{
  let params = new HttpParams().set('videoId', videoId);
  return this.Http.get<any>(environment.ApiPath + 'videos/'+ videoId, {params})
 .pipe(retry(1), catchError(this.errorHandle));

}

  editPhoto( newPhoto: Photo, photoId,): Observable<Photo>{
    const formData = new FormData();
   
    formData.append('imageTitle',newPhoto.imageTitle);
    formData.append('imageDesc', newPhoto.imageDesc);
    formData.append('chargeNGN', newPhoto.chargeNGN);
    formData.append('chargeUSD', newPhoto.chargeUSD);


    const params = new HttpParams().set('photoId', photoId);

    const options = {
      params,
      reportProgress: true,
    
    };
     
    return this.Http.patch<Photo>(environment.ApiPath + 'photos/'+photoId, formData, options)
    .pipe(retry(1), catchError(this.errorHandle));
  }

  
  editVideo( newVideo: Video, videoId){
    const formData = new FormData();
   
    formData.append('videoTitle', newVideo.videoTitle);
    formData.append('videoDesc', newVideo.videoDesc);
    formData.append('chargeNGN', newVideo.chargeNGN);
    formData.append('chargeUSD', newVideo.chargeUSD);

    const params = new HttpParams().set('videoId', videoId);

    const options = {
      params,
      reportProgress: true,
    
    };
     
    return this.Http.patch<any>(environment.ApiPath + 'videos/'+videoId, formData, options)
    .pipe(retry(1), catchError(this.errorHandle));
  }


  deletePhoto(photoId: string): Observable<any>{
    let params = new HttpParams().set('photoId', photoId);
    return this.Http.delete<any>(environment.ApiPath + 'photos/'+photoId, {params})
    .pipe(retry(1), catchError(this.errorHandle));

  }

  deleteVideo(videoId: string): Observable<any>{
    let params = new HttpParams().set('videoId', videoId);
    return this.Http.delete<any>(environment.ApiPath + 'videos/' +videoId, {params})
    .pipe(retry(1), catchError(this.errorHandle));

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



