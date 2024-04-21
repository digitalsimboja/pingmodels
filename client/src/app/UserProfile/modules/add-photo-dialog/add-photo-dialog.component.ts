import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadService } from '../../../Services/upload.service';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthServiceService } from 'src/app/Services/auth-service.service';


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
  selector: 'app-add-photo-dialog',
  templateUrl: './add-photo-dialog.component.html',
  styleUrls: ['./add-photo-dialog.component.scss']
})
export class AddPhotoDialogComponent implements OnInit {

  galleryForm: FormGroup;
  file: File = null;
  imageTitle = '';
  imageDesc = '';
  isLoadingResults = false;
  imageControl = '';
  matcher = new MyErrorStateMatcher();
  Uploaded = false;
  response;
  subscribeStatus;
  memberStatus;


  constructor(
    public dialogRef: MatDialogRef<AddPhotoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private uploadService: UploadService,
    private formBuilder: FormBuilder,
    private AuthService: AuthServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
    this.galleryForm = this.formBuilder.group({
      file: [null, Validators.required],
      imageTitle: [null, Validators.required],
      imageDesc: [null, Validators.required],
      imageControl: [null, Validators.required],
    });

  }



  onFormSubmit(): void {
    this.isLoadingResults = true;
    this.uploadService.addPhoto(this.galleryForm.value, this.galleryForm.get('file').value._files[0])
      .subscribe((res: any) => {
        this.isLoadingResults = false;
        this.Uploaded = true;
        if (res.body && res.body.imageControl == 'public') {
          this.router.navigate(['/model/profile/my/public_photos']);

          this.dialogRef.close();
        }
        if (res.body && res.body.imageControl == 'private') {
          this.router.navigate(['/model/profile/my/private_photos']);

          this.dialogRef.close();
        }

      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

  close() {
    this.dialogRef.close();
  }


}
