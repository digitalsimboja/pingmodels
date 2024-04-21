import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { FinancialService } from 'src/app/Services/financial.service';


@Component({
    selector: 'app-profileheader',
    templateUrl: './profileheader.component.html',
    styleUrls: ['./profileheader.component.scss'],

    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})


export class ProfileheaderComponent implements OnInit {
    public TokenBal ;
    public errorMsg;
    username;
    location: any;
    layoutClass: string;
    UserLogOut = true;
    

    constructor(
        private router: Router,
        location: Location,
        private AuthService: AuthServiceService,
        private financialService: FinancialService,

    ) {
        this.router.events.subscribe((ev) => {
            if (ev instanceof NavigationEnd) {
                this.location = location.path();
                if (this.location == '/demo-3') {
                    this.layoutClass = 'navbar-style-two';
                } else {
                    this.layoutClass = '';
                }
            }
        });

        
    }
    ngOnInit() {

        if (this.AuthService.Islogin()) {
           this.financialService.GetTokenBalance().subscribe(data=>{
               this.TokenBal = data;
               
           })
            this.UserLogOut = false;
            this.username = localStorage.getItem('username');
           
        }
    }

    viewModels(){
        
    }
    
    LogOut() {
        this.AuthService.LogOut().subscribe(data => {
            this.UserLogOut = true;
            
            this.router.navigateByUrl('/model/login');
        });

    }

}
