import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { DemoTwoComponent } from './demos/demo-two/demo-two.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { FaqComponent } from './pages/faq/faq.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
//import { AdminAuthComponent } from './Admin/admin-auth/admin-auth.component';
import { ProfileLayoutComponent } from './UserProfile/profile-layout/profile-layout.component';
import { BuytokenComponent } from './UserProfile/modules/buytoken/buytoken.component';
import { SubscribeComponent } from './UserProfile/modules/subscribe/subscribe.component';
import { ViewmodelsComponent } from './UserProfile/modules/viewmodels/viewmodels.component';
import { WithdrawComponent } from './UserProfile/modules/withdraw/withdraw.component';
import { FollowersComponent } from './UserProfile/modules/followers/followers.component';
import { FollowingComponent } from './UserProfile/modules/following/following.component';
import { AuthGuard } from './_helper/AuthGuard';
import { UserPublicPhotosComponent } from './UserProfile/modules/user-public-photos/user-public-photos.component';
import { UserPrivatePhotosComponent } from './UserProfile/modules/user-private-photos/user-private-photos.component';
import { UserPublicVideosComponent } from './UserProfile/modules/user-public-videos/user-public-videos.component';
import { UserPrivateVideosComponent } from './UserProfile/modules/user-private-videos/user-private-videos.component';
import { ProfileComponent } from './UserProfile/modules/profile/profile.component';
import { ModelProfileComponent } from './UserProfile/modules/model-profile/model-profile.component';
import { ModelPublicPhotosComponent } from './UserProfile/model/model-public-photos/model-public-photos.component';
import { ModelPrivatePhotosComponent } from './UserProfile/model/model-private-photos/model-private-photos.component';
import { ModelPublicVideosComponent } from './UserProfile/model/model-public-videos/model-public-videos.component';
import { ModelPrivateVideosComponent } from './UserProfile/model/model-private-videos/model-private-videos.component';
import { ViewPhotoComponent } from './UserProfile/modules/view-photo/view-photo.component';
import { ViewVideoComponent } from './UserProfile/modules/view-video/view-video.component';
import { SuccessComponent } from './UserProfile/modules/success/success.component';
import { FailedComponent } from './UserProfile/modules/failed/failed.component';





const routes: Routes = [

  //User Identity Route
  { path: '', redirectTo: 'model', pathMatch: 'full' },
  { path: 'model/login', component: LoginComponent },
  { path: 'model/register', component: RegisterComponent },
  //{ path: 'model/admin/login', component: AdminAuthComponent },
  //{ path: 'admin', component: AdminAuthComponent },

  //Application Unprotected Routes
  { path: 'model', pathMatch: 'full', component: DemoTwoComponent },
  { path: 'model/pricing', component: PricingComponent },

  /// Application Protected Routes
  { path: 'model/profile', component: ProfileLayoutComponent, canActivate: [AuthGuard] },
  { path: 'model/profile/me', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'model/profile/viewmodels', component: ViewmodelsComponent, canActivate: [AuthGuard] },
  { path: 'model/profile/viewmodels/:userId', component: ModelProfileComponent, 
    children: [
      {path: 'public/photos', component: ModelPublicPhotosComponent,
      children: [
        {path: ':photoId', component: ViewPhotoComponent},
      ] },
      {path: 'private/photos', component: ModelPrivatePhotosComponent,
      children: [
        {path: ':photoId', component: ViewPhotoComponent},
      ]},
      {path: 'public/videos', component: ModelPublicVideosComponent,
      children: [
        {path: ':videoId', component: ViewVideoComponent},
      ] },
      {path: 'private/videos', component: ModelPrivateVideosComponent,
      children: [
        {path: ':videoId', component: ViewVideoComponent},
      ]},
    ], canActivate: [AuthGuard]
  },
  { path: 'model/profile/buytoken', component: BuytokenComponent, canActivate: [AuthGuard] },
  { path: 'model/profile/subscribe', component: SubscribeComponent, canActivate: [AuthGuard] },
  { path: 'model/profile/my/public_photos', component: UserPublicPhotosComponent, canActivate: [AuthGuard] },
  { path: 'model/profile/my/private_photos', component: UserPrivatePhotosComponent, canActivate: [AuthGuard] },
  { path: 'model/profile/my/public_videos', component: UserPublicVideosComponent, canActivate: [AuthGuard] },
  { path: 'model/profile/my/private_videos', component: UserPrivateVideosComponent, canActivate: [AuthGuard] },
  { path: 'model/profile/success', component: SuccessComponent, canActivate: [AuthGuard] },
  { path: 'model/profile/failed', component: FailedComponent, canActivate: [AuthGuard] },
  { path: 'model/profile/withdraw', component: WithdrawComponent, canActivate: [AuthGuard] },
  { path: 'model/profile/following', component: FollowingComponent, canActivate: [AuthGuard] },
  { path: 'model/profile/followers', component: FollowersComponent, canActivate: [AuthGuard] },


  { path: '**', component: LoginComponent}

]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule],
  providers: [{
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  }]
})

export class AppRoutingModule { }