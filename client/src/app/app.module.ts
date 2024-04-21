import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './MaterialModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CookieService } from 'ngx-cookie-service';
import {NgxPaginationModule} from 'ngx-pagination';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FeedbackComponent } from './common/feedback/feedback.component';
import { DemoTwoComponent } from './demos/demo-two/demo-two.component';
import { FunfactComponent } from './common/funfact/funfact.component';
import { PartnerComponent } from './common/partner/partner.component';
import { AccountButtonComponent } from './common/account-button/account-button.component';
import { TalkButtonComponent } from './common/talk-button/talk-button.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { FaqComponent } from './pages/faq/faq.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from './shared/shared.module';
import { BuytokenComponent } from './UserProfile/modules/buytoken/buytoken.component';
import { SubscribeComponent } from './UserProfile/modules/subscribe/subscribe.component';
import { ViewmodelsComponent } from './UserProfile/modules/viewmodels/viewmodels.component';
import { FollowersComponent } from './UserProfile/modules/followers/followers.component';
import { WithdrawComponent } from './UserProfile/modules/withdraw/withdraw.component';
import { FollowingComponent } from './UserProfile/modules/following/following.component';
import { ProfileLayoutComponent } from './UserProfile/profile-layout/profile-layout.component';
import { AddPhotoDialogComponent } from './UserProfile/modules/add-photo-dialog/add-photo-dialog.component';
import { AddVideoComponent } from './UserProfile/modules/add-video/add-video.component';
import { RequestInterceptor } from './_helper/Requestinterceptor';
import { AuthServiceService } from './Services/auth-service.service';
import { UploadService } from './Services/upload.service';
import { FinancialService } from './Services/financial.service';
import { KeysPipe } from './_helper/keys.pipe';
import { UserPublicPhotosComponent } from './UserProfile/modules/user-public-photos/user-public-photos.component';
import { UserPrivatePhotosComponent } from './UserProfile/modules/user-private-photos/user-private-photos.component';
import { UserPublicVideosComponent } from './UserProfile/modules/user-public-videos/user-public-videos.component';
import { UserPrivateVideosComponent } from './UserProfile/modules/user-private-videos/user-private-videos.component';
import { ModellingComponent } from './UserProfile/modules/modelling/modelling.component';
import { ProfileComponent } from './UserProfile/modules/profile/profile.component';
import { ModelProfileComponent } from './UserProfile/modules/model-profile/model-profile.component';
import { ModelPublicPhotosComponent } from './UserProfile/model/model-public-photos/model-public-photos.component';
import { ModelPrivatePhotosComponent } from './UserProfile/model/model-private-photos/model-private-photos.component';
import { ModelPublicVideosComponent } from './UserProfile/model/model-public-videos/model-public-videos.component';
import { ModelPrivateVideosComponent } from './UserProfile/model/model-private-videos/model-private-videos.component';
import { ViewPhotoComponent } from './UserProfile/modules/view-photo/view-photo.component';
import { ViewVideoComponent } from './UserProfile/modules/view-video/view-video.component';
import { EditPhotoComponent } from './UserProfile/modules/edit-photo/edit-photo.component';
import { EditVideoComponent } from './UserProfile/modules/edit-video/edit-video.component';
import { CommentsComponent } from './comments/comments.component';
import { PusherService } from './Services/pusher.service';
import { ChatComponent } from './chat/chat.component';
import { SuccessComponent } from './UserProfile/modules/success/success.component';
import { FailedComponent } from './UserProfile/modules/failed/failed.component';
import { ChatroomComponent } from './chatroom/chatroom.component';






@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FeedbackComponent,
    DemoTwoComponent,
    FunfactComponent,
    PartnerComponent,
    AccountButtonComponent,
    TalkButtonComponent,
    PricingComponent,
    NotFoundComponent,
    FaqComponent,
    BlogComponent,
    BlogDetailsComponent,
    LoginComponent,
    RegisterComponent,
    BuytokenComponent,
    SubscribeComponent,
    ViewmodelsComponent,
    FollowersComponent,
    FollowingComponent,
    WithdrawComponent,
    ProfileLayoutComponent,
    AddPhotoDialogComponent,
    AddVideoComponent,
    ModellingComponent,
    KeysPipe, 
    UserPublicPhotosComponent, 
    UserPrivatePhotosComponent,
    UserPublicVideosComponent,
    UserPrivateVideosComponent,
    ProfileComponent,
    ModelProfileComponent,
    ModelPublicPhotosComponent,
    ModelPrivatePhotosComponent,
    ModelPublicVideosComponent,
    ModelPrivateVideosComponent,
    ViewPhotoComponent,
    ViewVideoComponent,
    EditPhotoComponent,
    EditVideoComponent,
    CommentsComponent,
    ChatComponent,
    SuccessComponent,
    FailedComponent,
    ChatroomComponent
    


  ],

  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    SlickCarouselModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule,
    SharedModule,
    LayoutModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    NgxPaginationModule,
    
   

  ],

  providers: [
    AuthServiceService,
    FinancialService,
    CookieService,
    UploadService, 
    PusherService,
    { provide:HTTP_INTERCEPTORS, useClass:RequestInterceptor, multi:true}
  ],
 
  bootstrap: [AppComponent],

})
export class AppModule { }
