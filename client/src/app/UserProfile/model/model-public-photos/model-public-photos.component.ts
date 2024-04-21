import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/Models/user';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { UploadService } from 'src/app/Services/upload.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Photo } from 'src/app/Models/photo';
import { switchMap } from 'rxjs/operators';
import { ViewPhotoComponent } from '../../modules/view-photo/view-photo.component';
import { MatDialog } from '@angular/material/dialog';
import { AddPhotoDialogComponent } from '../../modules/add-photo-dialog/add-photo-dialog.component';

@Component({
  selector: 'app-model-public-photos',
  templateUrl: './model-public-photos.component.html',
  styleUrls: ['./model-public-photos.component.scss']
})
export class ModelPublicPhotosComponent implements OnInit {
  title = 'Photo Gallery';
  gridColumns = 4;
  userId: string;
  public photos:Photo[] =[];
  totalRecords: number;
  page: number = 1;
  public selectedModelId;
  errorMessage;

  constructor(
    private dialogRef: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private AuthService: AuthServiceService, 
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router,
   ) {   }

  ngOnInit(): void {
    if(this.AuthService.Islogin()){
      this.route.parent.paramMap.subscribe((params: ParamMap)=>{
        let userId = params.get('userId');
        this.AuthService.getUserPublicPhotosById(userId).subscribe(data =>{
          this.photos = data;
              
        },
        (error) =>{
          console.error('Unable to fetch data');
          this.errorMessage = error;

        })
      })
    }
   
  }



 
  isSelectedModel(user){
    return user._id === this.selectedModelId

  }
  viewPhoto(photo) {
    localStorage.setItem('photoUrl', photo.imageUrl);
  
     //unsaved yet
    const dialogRef = this.dialogRef.open(ViewPhotoComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(value => {
      console.log( `Dialog sent: ${value}` );

    });

  }

  
  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 4 ? 3 : 4;
  }

}
