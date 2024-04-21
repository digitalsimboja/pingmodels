import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { UploadService } from '../../Services/upload.service';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AddPhotoDialogComponent } from '../modules/add-photo-dialog/add-photo-dialog.component';
import { AddVideoComponent } from '../modules/add-video/add-video.component';
import { Photo } from 'src/app/models/photo';
import { UserModel } from 'src/app/Models/user';
import { Video } from 'src/app/models/video';
import { ModellingComponent } from '../modules/modelling/modelling.component';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { KeysPipe } from '../../_helper/keys.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { relative } from 'path';
import Swal from 'sweetalert2';
import { ChatroomComponent } from 'src/app/chatroom/chatroom.component';







interface DialogData {
  email: string;
}

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.scss']
})
export class ProfileLayoutComponent implements OnInit {

  public publicPhotos: Photo[] = [];
  public users: UserModel[] = [];
  public publicProfile: UserModel;
  totalRecords: number;
  public errorMsg;
  response;
  subscribeStatus;
  memberStatus;

  constructor(private dialogRef: MatDialog,
    public location: Location,
    private AuthService: AuthServiceService,
    private uploadService: UploadService,
    private route: ActivatedRoute,

    private router: Router) { }


  ngOnInit() {
    if (this.AuthService.Islogin()) {
      
      this.AuthService.getUserProfile().subscribe(data => {
        this.publicProfile = data;
      })
      this.AuthService.getUsers().subscribe(data => {
        this.response = data;
        
      
       if(Object.keys(data).includes('message')){
        Swal.fire(this.response.message)

       }else{
        this.users = data.slice(0);
        this.totalRecords = data.length;

       }
       

      });

    }

  }


  openDialogProfile() {

    const dialogRef = this.dialogRef.open(ModellingComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(value => {
      console.log(`Dialog sent: ${value}`);

    });

  }

  openDialogPhoto() {

    let userStatus = this.response;
    if(Object.keys(userStatus).includes('message')){
      Swal.fire(userStatus.message)
    }else{      
      const dialogRef = this.dialogRef.open(AddPhotoDialogComponent, {
        height: '400px',
        width: '400px'
      });

      dialogRef.afterClosed().subscribe(value => {
        console.log(`Dialog sent: ${value}`);

      });

    }
    


  }

  openDialogVideo() {
    let userStatus = this.response;
    if(Object.keys(userStatus).includes('message')){
      Swal.fire(userStatus.message)
    }else{      
      const dialogRef = this.dialogRef.open(AddVideoComponent, {
        height: '400px',
        width: '400px'
      });

      dialogRef.afterClosed().subscribe(value => {
        console.log(`Dialog sent: ${value}`);

      });

    }


  }

  enterChat(){
    const dialogRef = this.dialogRef.open(ChatroomComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(value => {
      console.log(`Dialog sent: ${value}`);

    });

  }

  viewModel(user) {
    const userId = user._id
    this.router.navigateByUrl(`/model/profile/viewmodels/${userId}`);

  }


  imagesSlider = {
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: 'linear',
    fade: true,
    autoplay: true,
    draggable: true,
    prevArrow: '.client-feedback .prev-arrow',
    nextArrow: '.client-feedback .next-arrow',
    asNavFor: ".thumbs",
  };
  thumbnailsSlider = {
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    cssEase: 'linear',
    autoplay: true,
    centerMode: true,
    centerPadding: '0',
    draggable: false,
    focusOnSelect: true,
    asNavFor: ".feedback",
    prevArrow: '.client-thumbnails .prev-arrow',
    nextArrow: '.client-thumbnails .next-arrow',
  };


}


