import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ChatComponent } from 'src/app/chat/chat.component';
import { Message } from 'src/app/models/message';
import { Photo } from 'src/app/Models/photo';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { PusherService } from 'src/app/Services/pusher.service';
import { ViewPhotoComponent } from '../view-photo/view-photo.component';



declare const Pusher: any;
declare const feather: any;
@Component({
  selector: 'app-model-profile',
  templateUrl: './model-profile.component.html',
  styleUrls: ['./model-profile.component.scss']
})
export class ModelProfileComponent implements OnInit {
  public photos: Photo[] = [];

  title = 'Photo Gallery';
  gridColumns = 4;
  //public publicPhotos:Photo[] =[];
  totalRecords: number;
  page: number = 1;
  public modelId;
  errorMessage: any;
  selectedModelId: any;
  public showDefault = true;
  public following: boolean;
  public followed;
  public unfollowed;
  public status: boolean;
  public myBackgroundImageUrl: string;
  public displayImage: string;
  public username = '';
  public messages: Array<Message> = [];

  constructor(
    private dialogRef: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private pusherService: PusherService,
    private AuthService: AuthServiceService) { }

  ngOnInit(): void {
    feather.replace();

    // this.modelId = userId;
    this.route.paramMap.subscribe((params: ParamMap) => {
      let userId = params.get('userId');
      this.modelId = userId;
      this.AuthService.getUserPublicPhotosById(userId).subscribe(data => {
        this.photos = data;

        this.AuthService.getFollowStatus(userId).subscribe(res => {
          this.status = res.message;
          if (this.status == false) {
            this.following = false;
          }
          if (this.status == true) {
            this.following = true;
          }
        });

        this.AuthService.getUserById(userId).subscribe(res => {
          this.username = res.local.username;
          this.displayImage = res.coverImage;
          this.myBackgroundImageUrl = res.coverImage;

        });

        const channel = this.pusherService.init('comments');
        channel.bind('comment', (data) => {
          this.messages = this.messages.concat(data);

        });

        this.pusherService.getUserComments(this.modelId).subscribe(res => {
          this.messages = res;
          
        })


      },
        (error) => {
          console.error('Unable to fetch data');
          this.errorMessage = error;

        }

      )

    })



  }



  ping() {
    const pingedId = this.modelId;

    localStorage.setItem('pinged', pingedId);

    const dialogRef = this.dialogRef.open(ChatComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(value => {
      console.log(`Dialog sent: ${value}`);
    });

  }


  getBackgroundImageUrl() {

    return `url(${this.myBackgroundImageUrl})`
  }

  follow() {
    let viewedId = localStorage.getItem('viewed');
    this.AuthService.follow(viewedId).subscribe(data => {
      this.followed = data;
      if (this.followed) {
        this.AuthService.getFollowStatus(viewedId).subscribe(res => {
          this.status = res.message;
          if (this.status == false) {
            this.following = false;
          }
          if (this.status == true) {
            this.following = true;
          }


        })
      }

    })

  }
  unfollow() {
    let viewedId = localStorage.getItem('viewed');
    this.AuthService.unfollow(viewedId).subscribe(data => {
      this.unfollowed = data;
      if (this.unfollowed) {
        this.AuthService.getFollowStatus(viewedId).subscribe(res => {
          this.status = res.message;
          if (this.status == false) {
            this.following = false;
          }
          if (this.status == true) {
            this.following = true;
          }


        })
      }

    })


  }



  getModelPublicPhotos() {
    this.showDefault = false;
    this.router.navigate(['public/photos'], { relativeTo: this.route });
  }
  getModelPrivatePhotos() {
    this.showDefault = false;
    this.router.navigate(['private/photos'], { relativeTo: this.route });
  }
  getModelPublicVideos() {
    this.showDefault = false;
    this.router.navigate(['public/videos'], { relativeTo: this.route });
  }
  getModelPrivateVideos() {
    this.showDefault = false;
    this.router.navigate(['private/videos'], { relativeTo: this.route });
  }


  gotoModels() {
    this.showDefault = false;
    let selectedModelId = this.modelId ? this.modelId : null;
    this.router.navigate(['../', { userId: selectedModelId }], { relativeTo: this.route })
  }


  isSelectedModel(user) {
    return user._id === this.selectedModelId

  }
  viewPhoto(photo) {
    localStorage.setItem('photoUrl', photo.imageUrl);

    //unsaved yet
    const dialogRef = this.dialogRef.open(ViewPhotoComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(value => {
      console.log(`Dialog sent: ${value}`);

    });

  }


  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 4 ? 3 : 4;
  }

}
