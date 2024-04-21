import { Component, OnInit } from '@angular/core';

import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { UploadService } from 'src/app/Services/upload.service';
import { Photo } from 'src/app/models/photo'
import { MatDialog } from '@angular/material/dialog';
import { ModellingComponent } from '../modelling/modelling.component';
import { EditPhotoComponent } from '../edit-photo/edit-photo.component';


@Component({
  selector: 'app-user-public-photos',
  templateUrl: './user-public-photos.component.html',
  styleUrls: ['./user-public-photos.component.scss']
})
export class UserPublicPhotosComponent implements OnInit {
  title = 'Photo Gallery';
  gridColumns = 4;
  public publicPhotos:Photo[] =[];
  totalRecords: number;
  page: number = 1;
  deleted = '';

  constructor(
    private dialogRef: MatDialog,
    private AuthService: AuthServiceService, 
    private uploadService: UploadService,
   
  ) { }

  ngOnInit(): void {
    if (this.AuthService.Islogin()) {
      this.uploadService.getUserPublicPhotos().subscribe(data =>{
        this.publicPhotos = data;
        
        this.totalRecords = data.length;
      })

    }

  }

  editPhoto(photo){
    const photoId = photo._id;
    localStorage.setItem('editPhotoId',photoId);
    
    const dialogRef = this.dialogRef.open(EditPhotoComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(value => {
      console.log( `Dialog sent: ${value}` );

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
