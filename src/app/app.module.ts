import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SubmissionsComponent } from './submissions/submissions.component';
import { ChairpersonComponent } from './chairperson/chairperson.component';
import { RoomsSectionsComponent } from './rooms-sections/rooms-sections.component';
import { FacultyLoadComponent } from './faculty-load/faculty-load.component';
import { HistoryComponent } from './history/history.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatSidenav } from '@angular/material/sidenav';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChairpersonConfigComponent } from './chairperson/chairperson-config/chairperson-config.component';
import {OverlayModule} from '@angular/cdk/overlay';
import { DeadlineConfigComponent } from './chairperson/deadline-config/deadline-config.component';
import { RoomConfigComponent } from './rooms-sections/room-config/room-config.component';
import { SectionConfigComponent } from './rooms-sections/section-config/section-config.component';
import { FirstLetterWordPipe } from './shared/pipes/first-letter-word.pipe';
import { SetDeadlineComponent } from './submissions/set-deadline/set-deadline.component';
import { SetAcademicYearComponent } from './dashboard/set-academic-year/set-academic-year.component';
import { NgxCsvParserModule} from 'ngx-csv-parser';
import { FacultyConfigComponent } from './faculty-load/faculty-config/faculty-config.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SubmissionsComponent,
    ChairpersonComponent,
    RoomsSectionsComponent,
    FacultyLoadComponent,
    HistoryComponent,
    SidenavComponent,
    ErrorPageComponent,
    ChairpersonConfigComponent,
    DeadlineConfigComponent,
    RoomConfigComponent,
    SectionConfigComponent,
    FirstLetterWordPipe,
    SetDeadlineComponent,
    SetAcademicYearComponent,
    FacultyConfigComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    OverlayModule,
    NgxCsvParserModule,
    NgxMaterialTimepickerModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true
    }),

  ],
  providers: [MatSidenav],
  bootstrap: [AppComponent],
})
export class AppModule {}
