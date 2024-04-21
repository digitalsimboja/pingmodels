import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ParamMap, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UploadService } from 'src/app/Services/upload.service';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { Photo } from 'src/app/Models/photo';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-view-photo',
  templateUrl: './view-photo.component.html',
  styleUrls: ['./view-photo.component.scss']
})
export class ViewPhotoComponent implements OnInit {

  public selectedImage = '';
  navigationEnd: Observable<NavigationEnd>

  constructor(
    public dialogRef: MatDialogRef<ViewPhotoComponent>,
    
    private uploadService: UploadService,
    private AuthService: AuthServiceService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if (this.AuthService.Islogin()) {
    const viewedPhoto =  localStorage.getItem('photoUrl');
     this.selectedImage = viewedPhoto
   
     
    }
  }


}

