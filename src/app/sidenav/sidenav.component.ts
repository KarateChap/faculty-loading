import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AcademicPeriod } from '../shared/models/academic-period.model';
import { NewUser } from '../shared/models/new-user.model';
import { AcademicService } from '../shared/services/academic.service';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { NewNotification } from '../shared/models/new-notification.model';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit, OnDestroy {

  activeLink = '';
  activeUserEmail = '';
  currentUser: NewUser;
  currentUserSubs: Subscription;
  currentAcademic: AcademicPeriod;
  currentAcademicSubs: Subscription;

  notifications: NewNotification[] = [];

  opened = true;
  centered = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private academicService: AcademicService,
    private breakpointObserver: BreakpointObserver,
  ) {}


  ngOnInit(): void {
    this.academicService.fetchActiveAcademicYear();
    this.currentAcademicSubs = this.academicService.activeAcademicChange.subscribe(currentAcademic => {
      this.currentAcademic = currentAcademic;
    })

    this.activeUserEmail = localStorage.getItem('activeUserEmail') || '{}';
    if(this.activeUserEmail){
      this.userService.fetchCurrentUser(this.activeUserEmail);
    }
    else {
      this.userService.fetchCurrentUser('administrator@gmail.com');
    }

    this.currentUserSubs = this.userService.currentUserChanges.subscribe(user => {
      this.currentUser = user;
      this.notifications = this.currentUser.notification;
      console.log(this.notifications)
      console.log(this.notifications);
      if(this.currentUser.department == 'admin'){
        this.router.navigate(['/sidenav/' + 'dashboard']);
        this.activeLink = 'dashboard';
        console.log('admin works');
      }
      else{
        this.router.navigate(['/sidenav/' + 'dashboard']);
        this.activeLink = 'dashboard';
      }
    })
    // this.activeLink = localStorage.getItem('activeLink') || '{}';
  }

  onToggle() {
    this.opened = !this.opened;
    if (this.opened) {
      this.centered = false;
    } else {
      this.centered = true;
    }
    // this.notificationService.setWindowOnToggle();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
  .observe(Breakpoints.Handset)
  .pipe(
    map((result) => result.matches),
    shareReplay()
  );

  onDashboardActive(link: string) {
    this.activeLink = link;
    localStorage.setItem('activeLink', this.activeLink);
  }
  onSubmissionActive(link: string) {
    this.activeLink = link;
    localStorage.setItem('activeLink', this.activeLink);
  }
  onChairpersonActive(link: string) {
    this.activeLink = link;
    localStorage.setItem('activeLink', this.activeLink);
  }
  onRoomSectionActive(link: string) {
    this.activeLink = link;
    localStorage.setItem('activeLink', this.activeLink);
  }
  onSectionLoadActive(link: string) {
    this.activeLink = link;
    localStorage.setItem('activeLink', this.activeLink);
  }
  onFacultyLoadActive(link: string) {
    this.activeLink = link;
    localStorage.setItem('activeLink', this.activeLink);
  }
  onHistoryActive(link: string) {
    this.activeLink = link;
    localStorage.setItem('activeLink', this.activeLink);
  }

  onLogout() {
    this.authService.logout();
  }


  onDeleteNotification(i: number){
    let notification: NewNotification = this.notifications[i];
    this.userService.deleteNotification(notification, this.currentUser);
  }

  onDeleteAllNotification(){
    this.userService.deleteAllNotification(this.notifications, this.currentUser);
    this.notifications = [];
  }

  ngOnDestroy(): void {
      this.currentUserSubs.unsubscribe();
  }
}
