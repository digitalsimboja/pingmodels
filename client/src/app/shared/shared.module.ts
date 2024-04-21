import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileheaderComponent } from './profileheader/profileheader.component';
import { ProfilefooterComponent } from './profilefooter/profilefooter.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Router } from '@angular/router';
import {MatListModule} from '@angular/material/list'
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import { MatAutocompleteModule  } from "@angular/material/autocomplete";
import { MatBadgeModule } from "@angular/material/badge";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonToggleModule  } from "@angular/material/button-toggle";
import {MatCardModule  } from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import {MatExpansionModule} from "@angular/material/expansion";
import { MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSliderModule} from "@angular/material/slider";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { ModelsidebarComponent } from './modelsidebar/modelsidebar.component';



@NgModule({
  declarations: [
    ProfileheaderComponent, 
    ProfilefooterComponent,  
    ModelsidebarComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    ScrollingModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
      
  ],
  exports: [
    ProfileheaderComponent,
    ProfilefooterComponent,
    ModelsidebarComponent
  ]
})
export class SharedModule { }
