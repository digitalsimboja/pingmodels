import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit{
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
              title: 'Instructions',
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
          
          cols: 1, 
          rows: 1 
          },
          { 
            title: 'Instructions',
            subtitle: 'N 500 for lifetime membership',
            content1: '1. No tokens credits', 
            content2: '2. Upload unlimited public photos',
            content3: '3. Upload  unlimited private photos',
            content4: '4. Upload unlimited public videos',
            content5: '5. Upload unlimited private videos ',
            content6: '6. N500 membership fee',
            content7: '7. N1,000 subscription per month',
            subscribe: 'Withdraw', 
            cols: 1, 
            rows: 1 
            },
         
      ];
    })
  );
  
  constructor(private breakpointObserver: BreakpointObserver) {}
  ngOnInit(): void {
  }
  }
  