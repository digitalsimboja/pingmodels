import { Component, OnInit } from '@angular/core';
import { Video } from 'src/app/models/video';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UploadService } from 'src/app/Services/upload.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { ViewVideoComponent } from '../../modules/view-video/view-video.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-model-public-videos',
  templateUrl: './model-public-videos.component.html',
  styleUrls: ['./model-public-videos.component.scss']
})
export class ModelPublicVideosComponent implements OnInit {
  title = 'Photo Gallery';
  gridColumns = 4;
  userId: string;
  public videos:Video[] =[];
  totalRecords: number;
  page: number = 1;
  public selectedModelId;
  errorMessage;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private AuthService: AuthServiceService, 
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogRef: MatDialog,
  ) { }



  ngOnInit(): void {
    if(this.AuthService.Islogin()){
      this.route.parent.paramMap.subscribe((params: ParamMap)=>{
        let userId = params.get('userId');
        this.AuthService.getUserPublicVideosById(userId).subscribe(data =>{
          this.videos = data;
          
        },
        (error) =>{
          console.log('Error fetching data');
          this.errorMessage = error;
        })
      })
    }
  }

  viewVideo() {
    
    const dialogRef = this.dialogRef.open(ViewVideoComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(value => {
      console.log( `Dialog sent: ${value}` );

    });

  }

  viewModel(video){
    this.router.navigate([video._id], {relativeTo: this.route})
  }
 
  isSelectedModel(video){
    return video._id === this.selectedModelId

  }

  
  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 4 ? 3 : 4;
  }

}
