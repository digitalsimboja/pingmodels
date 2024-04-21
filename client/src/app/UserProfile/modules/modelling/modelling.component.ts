import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthServiceService } from '../../../Services/auth-service.service';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserModel } from 'src/app/Models/user';
import { KeysPipe } from '../../../_helper/keys.pipe';
import { FinancialService } from 'src/app/Services/financial.service';



interface DialogData {
  email: string;
}

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
  selector: 'app-modelling',
  templateUrl: './modelling.component.html',
  styleUrls: ['./modelling.component.scss']
})
export class ModellingComponent implements OnInit {
  galleryForm: FormGroup;
  coverPhotoForm: FormGroup;
  profileForm: FormGroup;
  bankForm: FormGroup;
  file: File = null;
  username = '';
  email = '';
  avatar = '';
  phoneNumber = '';
  bio = '';
  accountName = '';
  accountNumber = '';
  bankName = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();
  Uploaded = false;
  updated = '';
 

  constructor(public dialogRef: MatDialogRef<ModellingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private AuthService: AuthServiceService,
    private financialService: FinancialService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    
    if (this.AuthService.Islogin()) {
      this.AuthService.getUserProfile().subscribe(res => {
  
        this.username = res.local.username;
        this.email = res.local.email;
        this.avatar = res.avatar;
        this.phoneNumber = res.local.phoneNumber;
        this.bio = res.bio;

      })

    }

    this.galleryForm = this.formBuilder.group({
      file: [null, Validators.required],

    });

    this.coverPhotoForm = this.formBuilder.group({
      file: [null, Validators.required],

    });

    this.profileForm = this.formBuilder.group({

      email: [this.email, Validators.required],
      bio: [this.bio, Validators.required],
      phoneNumber: [this.phoneNumber, Validators.required],
    });

    this.bankForm = this.formBuilder.group({
      accountName: [null, Validators.required],
      accountNumber: [null, Validators.required],
      bankName: [null, Validators.required],
    });




  }

  updateProfilePicture() {

    this.AuthService.changeDp(this.galleryForm.get('file').value._files[0]).subscribe((res: any) => {
      this.isLoadingResults = false;
      this.Uploaded = true;
      this.updated = res;
      if (this.updated) {
        window.location.reload();
        this.dialogRef.close();
      }
    })
  }

  changeCoverPhoto(){

    this.AuthService.changeCoverPhoto(this.coverPhotoForm.get('file').value._files[0]).subscribe((res: any) => {
      this.isLoadingResults = false;
      this.Uploaded = true;
      this.updated = res;
      if (this.updated) {
        window.location.reload();
        this.dialogRef.close();
      }
    })
  }


  updateProfile(): void {
    this.isLoadingResults = true;
    this.AuthService.updateProfile(this.profileForm.value).subscribe((res: any) => {
      this.updated = res;
     if (this.updated) {
       window.location.reload();
        this.dialogRef.close();
     }

    }, (err: any) => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }

  updateBank() : void {
    this.isLoadingResults = true;
    this.financialService.updateBank(this.bankForm.value).subscribe((res: any) => {
      
      this.updated = res;
     if (this.updated) {
       window.location.reload();
        this.dialogRef.close();
     }

    }, (err: any) => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }



}
