import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { UploadService } from 'src/app/Services/upload.service';
import { Video } from 'src/app/Models/video';
import { MatDialog } from '@angular/material/dialog';
import { EditVideoComponent } from '../edit-video/edit-video.component';

@Component({
  selector: 'app-user-private-videos',
  templateUrl: './user-private-videos.component.html',
  styleUrls: ['./user-private-videos.component.scss']
})
export class UserPrivateVideosComponent implements OnInit {
  title = 'Video Gallery';
  gridColumns = 4;
  public privateVideos:Video[] =[];
  totalRecords: number;
  page: number = 1;
  deleted= '';

  constructor(
    private dialogRef: MatDialog,
    private AuthService: AuthServiceService, 
    private uploadService: UploadService
  ) { }

  
  ngOnInit(): void {
    if (this.AuthService.Islogin()) {
      this.uploadService.getUserPrivateVideos().subscribe(data =>{
        this.privateVideos = data.slice(0);
        
        this.totalRecords = data.length;
      })

    }
  }
  editVideo(video){
    const videoId = video._id;
    localStorage.setItem('editVideoId',videoId);
    
    const dialogRef = this.dialogRef.open(EditVideoComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(value => {
      console.log( `Dialog sent: ${value}` );

    });

  }

  deleteVideo(video){
    const videoId = video._id;
    
    this.uploadService.deleteVideo(videoId).subscribe(data =>{
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
