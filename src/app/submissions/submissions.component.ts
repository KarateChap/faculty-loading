import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AcademicPeriod } from '../shared/models/academic-period.model';
import { NewUser } from '../shared/models/new-user.model';
import { UserLoad } from '../shared/models/user-load';
import { AcademicService } from '../shared/services/academic.service';
import { UserService } from '../shared/services/user.service';
import { SetDeadlineComponent } from './set-deadline/set-deadline.component';
import { SubmissionModalComponent } from './submission-modal/submission-modal.component';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css'],
})
export class SubmissionsComponent implements OnInit, OnDestroy{

  currentUser: NewUser;
  activeAcademicYear: AcademicPeriod;

  constructor(private dialog: MatDialog, private userService: UserService, private academicService: AcademicService) {}
  pendingUserLoads: UserLoad[] = [];
  acceptedUserLoads: UserLoad[] = [];
  declinedUserLoads: UserLoad[] = [];
  UserLoadSubs: Subscription;

  ngOnInit(): void {
    this.activeAcademicYear = this.academicService.getActiveAcademicYear();
    this.currentUser = this.userService.getCurrentUser();

    this.userService.fetchAllUserLoads();

    this.UserLoadSubs = this.userService.userLoadsChanged.subscribe(userLoads => {
      this.pendingUserLoads = [];
      this.acceptedUserLoads = [];
      this.declinedUserLoads = [];

      userLoads.forEach(element => {
        if(element.status === 'pending'){
          this.pendingUserLoads.push(element);
        }
        if(element.status === 'accepted'){
          this.acceptedUserLoads.push(element);
        }
        if(element.status === 'declined'){
          this.declinedUserLoads.push(element);
        }
      });
      console.log(this.pendingUserLoads);
      console.log(this.acceptedUserLoads);
      console.log(this.declinedUserLoads);
    })
  }

  onApproveLoad(i: number){
    this.dialog.open(SubmissionModalComponent, {
      data: {
        status: 'accepted',
        userLoad: this.pendingUserLoads[i]
      }
    })
  }

  onDeclineLoad(i: number){
    this.dialog.open(SubmissionModalComponent, {
      data: {
        status: 'declined',
        userLoad: this.pendingUserLoads[i]
      }
    })
  }

  openDeadlineModal() {
    this.dialog.open(SetDeadlineComponent);
  }

  ngOnDestroy(): void {
    this.UserLoadSubs.unsubscribe();
  }
}
