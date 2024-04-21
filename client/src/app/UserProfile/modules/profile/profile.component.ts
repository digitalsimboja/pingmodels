import { Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { UploadService } from 'src/app/Services/upload.service';

import { Photo } from 'src/app/models/photo';
import { Video } from 'src/app/models/video';
import { MatDialog } from '@angular/material/dialog';
import { ModellingComponent } from '../modelling/modelling.component';
import { EditPhotoComponent } from '../edit-photo/edit-photo.component';
import { UserModel } from 'src/app/Models/user';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  title = 'Photo Gallery';
  gridColumns = 4;
  public publicPhotos:Photo[] =[];
 public userProfile: UserModel[] = [];
  totalRecords: number;
  page: number = 1;
  deleted = '';

  constructor(
    private dialogRef: MatDialog,
    private AuthService: AuthServiceService, 
    private uploadService: UploadService,
    private location : Location
  ) { }

  
  ngOnInit(): void {
    

    if (this.AuthService.Islogin()) {
      this.uploadService.getUserPublicPhotos().subscribe(data =>{
        this.publicPhotos = data.slice(0);
        
        this.totalRecords = data.length;
      })

    }
  }

  editProfile(){
    const dialogRef = this.dialogRef.open(ModellingComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(value => {
     
    });

  }

  editPhoto(photo){
    const photoId = photo._id;

      localStorage.setItem('editPhotoId',photoId);
     
    const dialogRef = this.dialogRef.open(EditPhotoComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(value => {
     
    });

  }

  deletePhoto(photo){
    const photoId = photo._id;
   
    this.uploadService.deletePhoto(photoId).subscribe(data =>{
      this.deleted = data;
      if(this.deleted){
        window.location.reload();
        
      }
    })
  }


   toggleGridColumns() {
    this.gridColumns = this.gridColumns === 4 ? 3 : 4;
  }

}
