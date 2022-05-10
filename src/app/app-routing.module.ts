import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ChairpersonComponent } from './chairperson/chairperson.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { FacultyLoadComponent } from './faculty-load/faculty-load.component';
import { LoadMainComponent } from './faculty-load/load-main/load-main.component';
import { HistoryComponent } from './history/history.component';
import { RoomsSectionsComponent } from './rooms-sections/rooms-sections.component';
import { SectionLoadComponent } from './section-load/section-load.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SubmissionsComponent } from './submissions/submissions.component'

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'sidenav', component: SidenavComponent,
  canActivate: [AuthGuard],
   children:[
    {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {path: 'dashboard', component: DashboardComponent},
    {path: 'submission', component: SubmissionsComponent},
    {path: 'chairperson', component: ChairpersonComponent},
    {path: 'roomsection', component: RoomsSectionsComponent},
    {path: 'sectionload', component: SectionLoadComponent},
    {path: 'facultyload', component: FacultyLoadComponent},
    {path: 'facultyload/:id', component: LoadMainComponent},
    {path: 'history', component: HistoryComponent},
    {path: 'error', component: ErrorPageComponent},
    {path: '**', redirectTo: 'error'},
  ]},
  {path: 'error', component: ErrorPageComponent},
  {path: '**', redirectTo: 'error'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
