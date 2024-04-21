import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FinancialService } from 'src/app/Services/financial.service';
import Swal from 'sweetalert2';


declare var Voguepay: any;

@Component({
  selector: 'app-buytoken',
  templateUrl: './buytoken.component.html',
  styleUrls: ['./buytoken.component.scss']
})
export class BuytokenComponent implements OnInit {
  paymentRef = '';
  tokenAmount;
  paidMember: any;
  tokenForm: FormGroup;
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
            title: 'N 1,000 Token',
            subtitle: 'N1,000 for 1,000 tokens',
            content1: '1. 1,000 tokens credits',
            content2: '2. Upload 10 public photos',
            content3: '3. Upload  upload 5 private photos',
            content4: '4. Upload upload 4 public videos',
            content5: '5. Upload 2 private videos ',
            content6: '6. N500 membership fee',
            content7: '7. N1,000 subscription per month',
            buy: 'Buy token',
            cols: 1,
            rows: 1
          },
          {
            title: 'N 3,000 Token',
            subtitle: 'N3,000 for 3,000 tokens',
            content1: '1. 3,000 tokens credits',
            content2: '2. Upload 30 public photos',
            content3: '3. Upload  upload 15 private photos',
            content4: '4. Upload upload 12 public videos',
            content5: '5. Upload 6 private videos ',
            content6: '6. N500 membership fee',
            content7: '7. N1,000 subscription per month',
            buy: 'Buy token',
            cols: 1,
            rows: 1
          },
          {
            title: 'N 5,000 Token',
            subtitle: 'N5,000 for 5,000 tokens',
            content1: '1. 5,000 tokens credits',
            content2: '2. Upload 50 public photos',
            content3: '3. Upload  upload 25 private photos',
            content4: '4. Upload upload 20 public videos',
            content5: '5. Upload 10 private videos ',
            content6: '6. N500 membership fee',
            content7: '7. N1,000 subscription per month',
            buy: 'Buy token',
            cols: 1,
            rows: 1
          },
          {
            title: 'N 10,000 Token',
            subtitle: 'N10,000 for 10,000 tokens',
            content1: '1. 10,000 tokens credits',
            content2: '2. Upload 20 public photos',
            content3: '3. Upload  upload 10 private photos',
            content4: '4. Upload upload 10 public videos',
            content5: '5. Upload 20 private videos ',
            content6: '6. N500 membership fee',
            content7: '7. Zero subscription fee for 1 month',
            buy: 'Buy token',
            cols: 1,
            rows: 1
          },
          {
            title: 'N 15,000 Token',
            subtitle: 'N 15,000 for 15,000 tokens',
            content1: '1. 15,000 tokens credits',
            content2: '2. Upload 50 public photos',
            content3: '3. Upload  upload 25 private photos',
            content4: '4. Upload upload 20 public videos',
            content5: '5. Upload 10 private videos ',
            content6: '6. Zero membership fee',
            content7: '7. Zero subscription fee for 1 month',
            buy: 'Buy token',
            cols: 1,
            rows: 1
          },
          {
            title: 'N 20,000 Token',
            subtitle: 'N 20,000 for 20,000 tokens',
            content1: '1. 20,000 tokens credits',
            content2: '2. Upload 50 public photos',
            content3: '3. Upload  upload 25 private photos',
            content4: '4. Upload upload 20 public videos',
            content5: '5. Upload 10 private videos ',
            content6: '6. Zero membership fee',
            content7: '7. Zero subscription fee for 3 months',
            buy: 'Buy token',
            cols: 1,
            rows: 1
          },

        ];
      }

      return [
        {
          title: 'N 1,000 Token',
          subtitle: 'N1,000 for 1,000 tokens',
          content1: '1. 1,000 tokens credits',
          content2: '2. Upload 10 public photos',
          content3: '3. Upload  upload 5 private photos',
          content4: '4. Upload upload 4 public videos',
          content5: '5. Upload 2 private videos ',
          content6: '6. N500 membership fee',
          content7: '7. N1,000 subscription per month',
          buy: 'Buy token',
          cols: 1,
          rows: 1
        },
        {
          title: 'N 3,000 Token',
          subtitle: 'N3,000 for 3,000 tokens',
          content1: '1. 3,000 tokens credits',
          content2: '2. Upload 30 public photos',
          content3: '3. Upload  upload 15 private photos',
          content4: '4. Upload upload 12 public videos',
          content5: '5. Upload 6 private videos ',
          content6: '6. N500 membership fee',
          content7: '7. N1,000 subscription per month',
          buy: 'Buy token',
          cols: 1,
          rows: 1
        },
        {
          title: 'N 5,000 Token',
          subtitle: 'N5,000 for 5,000 tokens',
          content1: '1. 5,000 tokens credits',
          content2: '2. Upload 50 public photos',
          content3: '3. Upload  upload 25 private photos',
          content4: '4. Upload upload 20 public videos',
          content5: '5. Upload 10 private videos ',
          content6: '6. N500 membership fee',
          content7: '7. N1,000 subscription per month',
          buy: 'Buy token',
          cols: 1,
          rows: 1
        },
        {
          title: 'N 10,000 Token',
          subtitle: 'N10,000 for 10,000 tokens',
          content1: '1. 10,000 tokens credits',
          content2: '2. Upload 20 public photos',
          content3: '3. Upload  upload 10 private photos',
          content4: '4. Upload upload 10 public videos',
          content5: '5. Upload 20 private videos ',
          content6: '6. N500 membership fee',
          content7: '7. Zero subscription fee for 1 month',
          buy: 'Buy token',
          cols: 1,
          rows: 1
        },
        {
          title: 'N 15,000 Token',
          subtitle: 'N 15,000 for 15,000 tokens',
          content1: '1. 15,000 tokens credits',
          content2: '2. Upload 50 public photos',
          content3: '3. Upload  upload 25 private photos',
          content4: '4. Upload upload 20 public videos',
          content5: '5. Upload 10 private videos ',
          content6: '6. Zero membership fee',
          content7: '7. Zero subscription fee in 1 month',
          buy: 'Buy token',
          cols: 1,
          rows: 1
        },
        {
          title: 'N 20,000 Token',
          subtitle: 'N 20,000 for 20,000 tokens',
          content1: '1. 20,000 tokens credits',
          content2: '2. Upload 50 public photos',
          content3: '3. Upload  upload 25 private photos',
          content4: '4. Upload upload 20 public videos',
          content5: '5. Upload 10 private videos ',
          content6: '6. Zero membership fee',
          content7: '7. Zero subscription fee in 3 months',
          buy: 'Buy token',
          cols: 1,
          rows: 1
        },
      ];


    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private financialService: FinancialService,
    private formBuilder: FormBuilder,
  ) { }
  ngOnInit(): void {

  }


  closedFunction() {

    alert('Payment window closed');
  }

  
  failedFunction(transaction_id) {
       
      Swal.fire("Your transaction failed with " +transaction_id)
      
  }

  validateTransaction(transaction_id) {
    let ref =  this.reference;
    this.financialService.validateTransaction(transaction_id, ref).subscribe(res => {
      this.status = res;
      Swal.fire(this.status.message);
    })



  }

  
//v_merchant_id: '5660-0111775',

  pay(amount) {
    
    let ref = 'FME_' + Date.now();
    this.reference = ref;
    this.financialService.initiateTokenPurchase(ref, amount).subscribe(res=>{
      this.response = res;

      if(this.response.message == "successful"){
        Voguepay.init({
          v_merchant_id: '5660-0111775',
          total: amount,
          notify_url: 'https://api.pingmodels.com/tokens/transaction/notify',
          cur: 'NGN',
          merchant_ref: ref,
          memo: 'Token purchase of N' + amount,
    
          loadText: 'Loading...',
          items: [
            {
              name: 'Token purchase of N' + amount,
              description: 'Token purchase of N' + amount,
              price: amount
            }
    
          ],
          closed: this.closedFunction,
          success: (transaction_id) => {
            this.validateTransaction(transaction_id)
    
          },
          failed: (transaction_id) => {
            this.failedFunction(transaction_id)
    
          },
    
    
        });


      }
      
       });
    
           
   
    

  }



}
