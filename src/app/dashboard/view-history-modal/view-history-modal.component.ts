import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NewUser } from 'src/app/shared/models/new-user.model';
import { UserLoad } from 'src/app/shared/models/user-load';
import { UserService } from 'src/app/shared/services/user.service';
import { ViewLoadsComponent } from 'src/app/submissions/view-loads/view-loads.component';
import { NotFoundModalComponent } from './not-found-modal/not-found-modal.component';

@Component({
  selector: 'app-view-history-modal',
  templateUrl: './view-history-modal.component.html',
  styleUrls: ['./view-history-modal.component.css']
})
export class ViewHistoryModalComponent implements OnInit, OnDestroy {

  schoolYear: string;
  semester: string;
  currentUser: NewUser;
  // currentUserLoad: UserLoad;
  currentUserSubs: Subscription;
  isLoading = false;

  constructor(private userService: UserService, private dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewHistoryModalComponent>) { }

  ngOnInit(): void {

    this.currentUser = this.userService.getCurrentUser();

    this.currentUserSubs = this.userService.currentUserHistoryLoadChanged.subscribe(currentUserLoad => {
      currentUserLoad;
      this.isLoading = false

      if(currentUserLoad){
        this.dialog.open(ViewLoadsComponent, {
          data: {
            userLoad: currentUserLoad
          }
        })
        this.dialogRef.close();
      }
      else {
        this.dialog.open(NotFoundModalComponent);
        this.dialogRef.close();
      }

    })
  }

  onViewLoad(){
    console.log(this.schoolYear);
    console.log(this.semester);
    this.isLoading = true;
    this.userService.fetchUserHistoryLoad(this.schoolYear, this.semester, this.currentUser.fullName);
  }

  ngOnDestroy(): void {
      this.currentUserSubs.unsubscribe();
  }
}
