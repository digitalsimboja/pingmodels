import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { logging } from 'protractor';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { UserModel } from '../Models/user';
import { environment } from 'src/environments/environment';
import { Account } from '../Models/account';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  constructor(private Http: HttpClient) { }

  GetTokenBalance(): Observable<any> {

    return this.Http.get(environment.ApiPath + 'users/getUserTokenBalance')
      .pipe(catchError(this.errorHandle));

  }

  initiateTokenPurchase(ref, amount,): Observable<any> {

  let params = new HttpParams().set('ref', ref);
   params =  params.set('amount', amount)

    return this.Http.post(environment.ApiPath + 'tokens/initiate/purchase/' + ref +'/'+amount, { params })
      .pipe(catchError(this.errorHandle));

  }

  initiateMembershipPurchase(ref, amount): Observable<any> {

    let params = new HttpParams().set('ref', ref);
   params =  params.set('amount', amount)

    return this.Http.post(environment.ApiPath + 'accounts/initiate/memberPay/' + ref +'/'+amount, { params })
      .pipe(catchError(this.errorHandle));

  }

  initiateSubscriptionPurchase(ref, amount): Observable<any> {

    let params = new HttpParams().set('ref', ref);
   params =  params.set('amount', amount)

    return this.Http.post(environment.ApiPath + 'accounts/initiate/subscribePay/' + ref +'/'+amount, { params })
      .pipe(catchError(this.errorHandle));

  }


  validateTransaction(transaction_id, ref): Observable<any> {

    let params = new HttpParams().set('transaction_id', transaction_id);
    params = params.set('ref', ref);

    return this.Http.post(environment.ApiPath + 'tokens/transaction/validate/' + transaction_id+'/'+ref, { params })
      .pipe(catchError(this.errorHandle));

  }

  
  payMembership(transaction_id,ref): Observable<any> {
    let params = new HttpParams().set('transaction_id', transaction_id);
    params = params.set('ref',ref)

    return this.Http.post(environment.ApiPath + 'accounts/transaction_membership/pay/' + transaction_id+'/'+ref, { params }
    )
      .pipe(catchError(this.errorHandle));

  }

  paySubscription(transaction_id, ref): Observable<any> {
    let params = new HttpParams().set('transaction_id', transaction_id);
    params = params.set('ref',ref)

    return this.Http.post(environment.ApiPath + 'accounts/transaction_subscription/subscribe/' + transaction_id+'/'+ref, { params }
    )
      .pipe(catchError(this.errorHandle));

  }


  payNaira(photoId): Observable<any> {

    const params = new HttpParams().set('photoId', photoId);
    return this.Http.post(environment.ApiPath + 'tokens/payWithNaira/' + photoId, { params })
      .pipe(catchError(this.errorHandle));

  }

  payUSD(photoId): Observable<any> {

    const params = new HttpParams().set('photoId', photoId);
    return this.Http.post(environment.ApiPath + 'tokens/payWithUSD/' + photoId, { params })
      .pipe(catchError(this.errorHandle));

  }

  payVideoNaira(videoId): Observable<any> {

    const params = new HttpParams().set('videoId', videoId);
    return this.Http.post(environment.ApiPath + 'tokens/payVideoWithNaira/' + videoId, { params })
      .pipe(catchError(this.errorHandle));

  }

  payVideoUSD(videoId): Observable<any> {

    const params = new HttpParams().set('videoId', videoId);
    return this.Http.post(environment.ApiPath + 'tokens/payVideoWithUSD/' + videoId, { params })
      .pipe(catchError(this.errorHandle));

  }

  getToken() {

    return localStorage.getItem('token');

  }

  updateBank(bank: Account): Observable<any> {
    const formData = new FormData();
    formData.append('accountName', bank.bankAccountName);
    formData.append('accountNumber', bank.bankAccount);
    formData.append('bankName', bank.bankName);


    return this.Http.post(environment.ApiPath + 'accounts/addBank', formData)
      .pipe(catchError(this.errorHandle));
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
