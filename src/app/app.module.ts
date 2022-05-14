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
import { LoadMainComponent } from './faculty-load/load-main/load-main.component';
import { LoadEditorComponent } from './faculty-load/load-main/load-editor/load-editor.component';
import { LoadViewComponent } from './faculty-load/load-main/load-view/load-view.component';
import { SectionLoadComponent } from './section-load/section-load.component';
import { SectionLoadEditorComponent } from './section-load/section-load-editor/section-load-editor.component';
import { SectionLoadViewComponent } from './section-load/section-load-view/section-load-view.component';
import { ClassScheduleTimelineModalComponent } from './dashboard/class-schedule-timeline-modal/class-schedule-timeline-modal.component';
import { FacultyLoadTimelineModalComponent } from './dashboard/faculty-load-timeline-modal/faculty-load-timeline-modal.component';
import { ClassScheduleTimelineComponent } from './dashboard/class-schedule-timeline-modal/class-schedule-timeline/class-schedule-timeline.component';
import { FacultyLoadTimelineComponent } from './dashboard/faculty-load-timeline-modal/faculty-load-timeline/faculty-load-timeline.component';
import { ClassScheduleTableComponent } from './dashboard/class-schedule-timeline-modal/class-schedule-table/class-schedule-table.component';
import { FacultyLoadTableComponent } from './dashboard/faculty-load-timeline-modal/faculty-load-table/faculty-load-table.component';
import { SubmitConfirmationModalComponent } from './dashboard/submit-confirmation-modal/submit-confirmation-modal.component';
import { SubmissionModalComponent } from './submissions/submission-modal/submission-modal.component';

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
    FacultyConfigComponent,
    LoadMainComponent,
    LoadEditorComponent,
    LoadViewComponent,
    SectionLoadComponent,
    SectionLoadEditorComponent,
    SectionLoadViewComponent,
    ClassScheduleTimelineModalComponent,
    FacultyLoadTimelineModalComponent,
    ClassScheduleTimelineComponent,
    FacultyLoadTimelineComponent,
    ClassScheduleTableComponent,
    FacultyLoadTableComponent,
    SubmitConfirmationModalComponent,
    SubmissionModalComponent,
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
