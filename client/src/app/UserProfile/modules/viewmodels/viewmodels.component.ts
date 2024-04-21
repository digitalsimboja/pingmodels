import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { UploadService } from 'src/app/Services/upload.service';
import { Photo } from 'src/app/models/photo';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { UserModel } from 'src/app/Models/user';
import { KeysPipe } from '../../../_helper/keys.pipe';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-viewmodels',
  templateUrl: './viewmodels.component.html',
  styleUrls: ['./viewmodels.component.scss']
})
export class ViewmodelsComponent implements OnInit {
  title = 'Photo Gallery';
  gridColumns = 4;
  public users: UserModel[] = [];
  totalRecords: number;
  page: number = 1;
  public selectedModelId;
  public isFollow: boolean = false;
  public followed = false;
  response;
  subscribeStatus;
  memberStatus;

  constructor(private breakpointObserver: BreakpointObserver,
    private AuthService: AuthServiceService,
    private dialogRef: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.AuthService.Islogin()) {
      
      this.AuthService.getUsers().subscribe(data => {
        this.response = data;
       
       if(Object.keys(data).includes('message')){
        Swal.fire(this.response.message)

       }else{
        this.users = data.slice(0);
        this.totalRecords = data.length;

       }

      });
  


      this.route.paramMap.subscribe((params: ParamMap) => {
        let userId = params.get('userId');
        this.selectedModelId = userId;

      });
    }

  }


  viewModel(user) {
    
    localStorage.setItem('viewed', user._id);
    this.router.navigate([user._id], { relativeTo: this.route })

  }

  isSelectedModel(user) {
    return user._id === this.selectedModelId

  }


  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 4 ? 3 : 4;
  }



}
