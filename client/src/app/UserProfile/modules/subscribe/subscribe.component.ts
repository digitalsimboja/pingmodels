import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { FinancialService } from 'src/app/Services/financial.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

declare var Voguepay: any;

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  paymentRef = '';
  membershipFee;
  subscriptionFee;
  paidMember: any;
  memberForm: FormGroup;
  subscriptionForm: FormGroup;
  status;
  url = '';
  transaction_id;
  response;
  reference;

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          {
            title: 'N 500 memebership fee',
            subtitle: 'N 500 for lifetime membership',
            content1: '1. No tokens credits',
            content2: '2. Upload unlimited public photos',
            content3: '3. Upload  unlimited private photos',
            content4: '4. Upload unlimited public videos',
            content5: '5. Upload unlimited private videos ',
            content6: '6. N500 membership fee',
            content7: '7. N1,000 subscription per month',
            subscribe: 'Become a member',
            cols: 1,
            rows: 1
          },
          {
            title: 'N 1,000 monthly subscription',
            subtitle: 'N1,000 monthly subscription fee',
            content1: '1. No tokens credits',
            content2: '2. Upload unlimited public photos',
            content3: '3. Upload  unlimited  private photos',
            content4: '4. Upload unlimited public videos',
            content5: '5. Upload unlimited private videos ',
            content6: '6. Cancel anytime',
            content7: '7. N1,000 subscription per month',
            subscribe: 'Subscribe',
            cols: 1,
            rows: 1
          },
        ];
      }

      return [
        {
          title: 'N 500 memebership fee',
          subtitle: 'N 500 for lifetime membership',
          content1: '1. No tokens credits',
          content2: '2. Upload unlimited public photos',
          content3: '3. Upload  unlimited private photos',
          content4: '4. Upload unlimited public videos',
          content5: '5. Upload unlimited private videos ',
          content6: '6. N500 membership fee',
          content7: '7. N1,000 subscription per month',
          subscribe: 'Become a member',
          cols: 1,
          rows: 1
        },
        {
          title: 'N 1,000 monthly subscription',
          subtitle: 'N1,000 monthly subscription fee',
          content1: '1. No tokens credits',
          content2: '2. Upload unlimited public photos',
          content3: '3. Upload  unlimited  private photos',
          content4: '4. Upload unlimited public videos',
          content5: '5. Upload unlimited private videos ',
          content6: '6. Cancel anytime',
          content7: '7. N1,000 subscription per month',
          subscribe: 'Subscribe',
          cols: 1,
          rows: 1
        },
      ];
    })
  );


  constructor(
    private breakpointObserver: BreakpointObserver,
    private financialService: FinancialService,
    private formBuilder: FormBuilder,) { }


  ngOnInit(): void {
    
  }

  
  closedFunction() {

    alert('Payment window closed');
  }

 
  failedFunction(transaction_id) {

    Swal.fire('Payment failed with transaction ID: ' + transaction_id)


  }

  membershipPay(transaction_id) {
 let ref =  this.reference;
    this.financialService.payMembership(transaction_id, ref).subscribe(res => {
      this.status = res;
      Swal.fire(this.status.message);
      
    }
    )


  }

  subscriptionPay(transaction_id) {
    let ref =  this.reference;

    this.financialService.paySubscription(transaction_id,ref).subscribe(res => {
      this.status = res;
      Swal.fire(this.status.message);
    }
    )


  }
// v_merchant_id: '5660-0111775',

  payMembership(amount) {

    let ref = 'FME_' + Date.now();
    this.reference = ref;
    this.financialService.initiateMembershipPurchase(ref, amount).subscribe(res=>{
      this.response = res;
      if(this.response.message == "successful"){
        Voguepay.init({
          v_merchant_id: '5660-0111775',
          total: amount,
          notify_url: 'https://api.pingmodels.com/tokens/transaction/notify',
          cur: 'NGN',
          merchant_ref: ref,
          memo: 'Membership fee of N' + amount,
    
          loadText: 'Loading...',
          items: [
            {
              name:'Membership fee of N' + amount,
              description: 'Membership fee of N' + amount,
              price: amount
            }
    
          ],
          closed: this.closedFunction,
          success: (transaction_id) => {
            this.membershipPay(transaction_id)
    
          },
          failed: (transaction_id) => {
            this.failedFunction(transaction_id)
    
          },
    
    
        });


      }
      
       });

   

  }
//v_merchant_id: '5660-0111775',
  
  paySubscription(amount) {
    let ref = 'FME_' + Date.now();
    this.reference = ref;
    this.financialService.initiateSubscriptionPurchase(ref, amount).subscribe(res=>{
      this.response = res;
      if(this.response.message == "successful"){
        Voguepay.init({
          v_merchant_id: '5660-0111775',
          total: amount,
          notify_url: 'https://api.pingmodels.com/tokens/transaction/notify',
          cur: 'NGN',
          merchant_ref: ref,
          memo: 'Subscription fee of N' + amount,
    
          loadText: 'Loading...',
          items: [
            {
              name:'Subscription fee of N' + amount,
              description: 'Subscription fee of N' + amount,
              price: amount
            }
    
          ],
          closed: this.closedFunction,
          success: (transaction_id) => {
            this.subscriptionPay(transaction_id)
    
          },
          failed: (transaction_id) => {
            this.failedFunction(transaction_id)
    
          },
    
    
        });


      }
      
       });
    

  }
}
