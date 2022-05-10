import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AcademicPeriod } from '../shared/models/academic-period.model';
import { NewUser } from '../shared/models/new-user.model';
import { AcademicService } from '../shared/services/academic.service';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private academicService: AcademicService
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

  ngOnDestroy(): void {
      this.currentUserSubs.unsubscribe();
  }
}
