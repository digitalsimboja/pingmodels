import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ParamMap, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UploadService } from 'src/app/Services/upload.service';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import {Video} from 'src/app/Models/video';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-view-video',
  templateUrl: './view-video.component.html',
  styleUrls: ['./view-video.component.scss']
})
export class ViewVideoComponent implements OnInit {
  public selectedVideo = '';
  navigationEnd: Observable<NavigationEnd>


  constructor(
    public dialogRef: MatDialogRef<ViewVideoComponent>,
    private uploadService: UploadService,
    private AuthService: AuthServiceService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if (this.AuthService.Islogin()) {
      const viewedVideo =  localStorage.getItem('videoUrl');
       this.selectedVideo = viewedVideo;
      
      }
  }

}
