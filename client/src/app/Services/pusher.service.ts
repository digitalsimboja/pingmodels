import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message';



declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  

  constructor(private Http: HttpClient,
    // Replace this with your pusher key    
    
    ) { 
      this.pusher = new Pusher("be3b2836b1ef9d75e396", {
        cluster : "mt1",
        useTLS: true,
      });
     }

    pusher;
    public init(channel) {
      return this.pusher.subscribe(channel);
    }

  comment(message: Message, userId ): Observable<any> {
    let params = new HttpParams().set('userId', userId);

    const formData = new FormData();
    formData.append('comment', message.comment);
    formData.append('name', message.name);

    
    const options = {
      params,
      reportProgress: true,
    
    };

  
    return this.Http.post<any>(environment.ApiPath + 'posts/comment/'+userId, formData, options)
    .pipe(catchError(this.errorHandle));


  }

  getAllPosts(): Observable<Message[]> {
    return this.Http.get<Message[]>(environment.ApiPath + 'posts/')
      .pipe(retry(1), catchError(this.errorHandle));
  }

   
  getUserComments(userId: string): Observable<any> {
    let params = new HttpParams().set('userId', userId);

    return this.Http.get<any>(environment.ApiPath + 'posts/comment/' +userId, { params })
      .pipe(retry(1), catchError(this.errorHandle));
  }

  
  ////////////

  
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
