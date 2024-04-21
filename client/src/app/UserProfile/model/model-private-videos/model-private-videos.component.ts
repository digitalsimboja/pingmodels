import { Component, OnInit } from '@angular/core';
import { Video } from 'src/app/models/video';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { UploadService } from 'src/app/Services/upload.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewVideoComponent } from '../../modules/view-video/view-video.component';
import { FinancialService } from 'src/app/Services/financial.service';

@Component({
  selector: 'app-model-private-videos',
  templateUrl: './model-private-videos.component.html',
  styleUrls: ['./model-private-videos.component.scss']
})
export class ModelPrivateVideosComponent implements OnInit {
  title = 'Video Gallery';
  gridColumns = 4;
  userId: string;
  public videos:Video[] =[];
  public videoId;
  public debited;
  totalRecords: number;
  page: number = 1;
  public selectedModelId;
  public responseMessage = '';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private AuthService: AuthServiceService,
    private financialService : FinancialService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogRef: MatDialog,
  ) { }

  ngOnInit(): void {
    if(this.AuthService.Islogin()){
      this.route.parent.paramMap.subscribe((params: ParamMap)=>{
        let userId = params.get('userId');
        this.AuthService.getUserPrivateVideosById(userId).subscribe(data =>{
          this.videos = data;
         
        })
      })
    }

  }
   
  isSelectedModel(video){
    return video._id === this.selectedModelId

  }


  payNaira(video) {
    this.videoId = video._id;
    //debit the user token here
    this.financialService.payVideoNaira(this.videoId).subscribe(data => {
      this.debited = data;
    
      if (this.debited.success == true) {
        localStorage.setItem('videoUrl', video.videoUrl);
        const dialogRef = this.dialogRef.open(ViewVideoComponent, {
          height: '400px',
          width: '400px'
        });

        dialogRef.afterClosed().subscribe(value => {
          console.log(`Dialog sent: ${value}`);

        });
      }
      else {
        this.responseMessage = 'You do not have enough balance to view this asset'

      }
    })

  }

  payUSD(video) {
    this.videoId = video._id;

    //debit the user token here
    this.financialService.payVideoUSD(this.videoId).subscribe(data => {
      this.debited = data
     
      if (this.debited.success == true) {
        localStorage.setItem('videoUrl', video.videoUrl);
        const dialogRef = this.dialogRef.open(ViewVideoComponent, {
          height: '400px',
          width: '400px'
        });

        dialogRef.afterClosed().subscribe(value => {
          console.log(`Dialog sent: ${value}`);

        });
      }
      else{
        this.responseMessage = 'You do not have enough balance to view this asset'

      }
    })

  }

  
  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 4 ? 3 : 4;
  }

}
