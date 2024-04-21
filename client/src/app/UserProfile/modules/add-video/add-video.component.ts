import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadService } from '../../../Services/upload.service';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';



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
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {

  galleryForm: FormGroup;
  file: File = null;
  videoTitle = '';
  videoDesc = '';
  isLoadingResults = false;
  videoControl = '';
  matcher = new MyErrorStateMatcher();
  Uploaded = false;

  constructor(
    public dialogRef: MatDialogRef<AddVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private uploadService: UploadService,
    private formBuilder: FormBuilder,
    private router: Router
    ) { }

    ngOnInit(): void {
      this.galleryForm = this.formBuilder.group({
        file: [null, Validators.required],
        videoTitle: [null, Validators.required],
        videoDesc: [null, Validators.required],
        videoControl: [null, Validators.required]
      });
  
    }

    onFormSubmit(): void {
      this.isLoadingResults = true;
      this.uploadService.addVideo(this.galleryForm.value, this.galleryForm.get('file').value._files[0])
        .subscribe((res: any) => {
          this.isLoadingResults = false;
          this.Uploaded = true;
          if (res.body && res.body.videoControl == 'public' ) {
            this.router.navigate(['/model/profile/my/public_videos']);
            
            this.dialogRef.close();
          }
          if (res.body && res.body.videoControl == 'private' ) {
            this.router.navigate(['/model/profile/my/private_videos']);
            
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
