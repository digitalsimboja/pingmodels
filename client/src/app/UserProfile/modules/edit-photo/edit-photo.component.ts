import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../../Services/auth-service.service';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserModel } from 'src/app/Models/user';
import {KeysPipe} from '../../../_helper/keys.pipe';
import { UploadService } from 'src/app/Services/upload.service';
import { Photo } from 'src/app/Models/photo';


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
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.scss']
})
export class EditPhotoComponent implements OnInit {
 
  photoForm: FormGroup;
  photo: Photo;
  imageTitle = '';
  imageDesc = '';
  chargeNGN = '';
  chargeUSD = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  Uploaded = false;
  edited: any = '';
  photoId: string;
  public photoPrivate: Boolean;
  


  constructor(
    public dialogRef: MatDialogRef<EditPhotoComponent>,
    private AuthService: AuthServiceService,
    private UploadService: UploadService,
    private formBuilder: FormBuilder,
    private router: Router
    ) {}

  ngOnInit(): void {
    if(this.AuthService.Islogin()){
      this.photoId = localStorage.getItem('editPhotoId');
      this.UploadService.getPhotoById(this.photoId).subscribe(res=>{
        this.photo = res;
        if(this.photo.imageControl == "private"){
          this.photoPrivate = true;
        }
        
        this.imageTitle= res.imageTitle;
        this.imageDesc = res.imageDesc;
        this.chargeNGN = res.chargeNGN;
        this.chargeUSD = res.chargeUSD;

        
      })
          
   
      this.photoForm = this.formBuilder.group({
        
        imageTitle: [this.imageTitle, Validators.required],
        imageDesc: [ this.imageDesc, Validators.required],
        chargeNGN: [  this.chargeNGN, Validators.required],
        chargeUSD: [ this.chargeUSD , Validators.required],
       
      });
    }

   
    
  }
  onFormSubmit(){
    this.isLoadingResults = true;
    this.UploadService.editPhoto(this.photoForm.value, this.photoId).subscribe(res =>{
      this.edited = res;
      
      if(this.edited){
       window.location.reload();
      }
      
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      }
      
    )
  }

}
