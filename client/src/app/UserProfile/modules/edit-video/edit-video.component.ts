import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../../Services/auth-service.service';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserModel } from 'src/app/Models/user';
import {KeysPipe} from '../../../_helper/keys.pipe';
import { UploadService } from 'src/app/Services/upload.service';
import { Video } from 'src/app/models/video';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.scss']
})
export class EditVideoComponent implements OnInit {
  videoForm: FormGroup;
  video: Video;
  videoTitle = '';
  videoDesc = '';
  chargeNGN = '';
  chargeUSD = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  Uploaded = false;
  edited: any = '';
  videoId: string;
  
  public videoPrivate: Boolean;

  constructor(
    public dialogRef: MatDialogRef<EditVideoComponent>,
    private AuthService: AuthServiceService,
    private UploadService: UploadService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(this.AuthService.Islogin()){
      this.videoId = localStorage.getItem('editVideoId');
      this.UploadService.getVideoById(this.videoId).subscribe(res=>{
        this.video = res;

        console.log(this.video)
        
        if(this.video.videoControl == "private"){
          this.videoPrivate = true;
        }
        
        
        this.videoTitle= res.videoTitle;
        this.videoDesc = res.videoDesc;
        this.chargeNGN = res.chargeNGN;
        this.chargeUSD = res.chargeUSD;

        
      })

      this.videoForm = this.formBuilder.group({
        
        videoTitle: [this.videoTitle, Validators.required],
        videoDesc: [  this.videoDesc, Validators.required],
        chargeNGN: [  this.chargeNGN, Validators.required],
        chargeUSD: [ this.chargeUSD , Validators.required],
       
      });
    
    }
  }
  onFormSubmit(){
    
    this.UploadService.editVideo(this.videoForm.value, this.videoId).subscribe(data =>{
      this.edited = data;
   
      if(this.edited){
       window.location.reload();
      }
      
        })
  }

}
