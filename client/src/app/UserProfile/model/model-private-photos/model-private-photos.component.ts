import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { UploadService } from 'src/app/Services/upload.service';
import { Photo } from 'src/app/Models/photo';
import { ViewPhotoComponent } from '../../modules/view-photo/view-photo.component';
import { MatDialog } from '@angular/material/dialog';
import { FinancialService } from 'src/app/Services/financial.service';
import { Message } from 'src/app/models/message';


@Component({
  selector: 'app-model-private-photos',
  templateUrl: './model-private-photos.component.html',
  styleUrls: ['./model-private-photos.component.scss']
})
export class ModelPrivatePhotosComponent implements OnInit {
  title = 'Photo Gallery';
  gridColumns = 4;
  userId: string;
  public photos: Photo[] = [];
  public photoId;
  public debited;
  totalRecords: number;
  page: number = 1;
  public selectedModelId;
  public responseMessage = '';




  constructor(
    private breakpointObserver: BreakpointObserver,
    private AuthService: AuthServiceService,
    private financialService: FinancialService,
    private uploadService: UploadService,
    private route: ActivatedRoute,

    private router: Router,
    private dialogRef: MatDialog,
  ) { }

  ngOnInit(): void {

    if (this.AuthService.Islogin()) {
      this.route.parent.paramMap.subscribe((params: ParamMap) => {
        let userId = params.get('userId');
        this.AuthService.getUserPrivatePhotosById(userId).subscribe(data => {
          this.photos = data;

        })
      })
    }


  }

  isSelectedModel(photo) {
    return photo._id === this.selectedModelId

  }

  payNaira(photo) {
    this.photoId = photo._id;
    //debit the user token here
    this.financialService.payNaira(this.photoId).subscribe(data => {
      this.debited = data;
    
      if (this.debited.success == true) {
        localStorage.setItem('photoUrl', photo.imageUrl);
        const dialogRef = this.dialogRef.open(ViewPhotoComponent, {
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

  payUSD(photo) {
    this.photoId = photo._id;

    //debit the user token here
    this.financialService.payUSD(this.photoId).subscribe(data => {
      this.debited = data;
      
     
      if (this.debited.success == true) {
        localStorage.setItem('photoUrl', photo.imageUrl);
        const dialogRef = this.dialogRef.open(ViewPhotoComponent, {
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
