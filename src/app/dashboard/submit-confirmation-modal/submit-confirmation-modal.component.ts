import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewNotification } from 'src/app/shared/models/new-notification.model';
import { NewUserLoad } from 'src/app/shared/models/new-user-load';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-submit-confirmation-modal',
  templateUrl: './submit-confirmation-modal.component.html',
  styleUrls: ['./submit-confirmation-modal.component.css'],
})
export class SubmitConfirmationModalComponent implements OnInit {
  currentUserLoad: NewUserLoad;
  constructor(
    @Inject(MAT_DIALOG_DATA) private passedData: any,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUserLoad = {
      year: this.passedData.year,
      semester: this.passedData.semester,
      department: this.passedData.department,
      chairpersonName: this.passedData.chairpersonName,
      status: this.passedData.status,
      dateSubmitted: this.passedData.dateSubmitted,
      comment: '',
      idNumber: this.passedData.idNumber,
      loadItem: this.passedData.loadItem,
    }
  }

  onSubmitUserLoad(){
    let notification: NewNotification;

    console.log(this.currentUserLoad);
    if(this.passedData.hasData){

      notification = {
        icon: 'notifications',
        heading: 'Load Update',
        contents: this.currentUserLoad.chairpersonName + ' submitted an updated load.'
      }
      this.userService.editUserLoadsToDatabase(this.passedData.userLoadId, this.currentUserLoad);
      this.userService.updateAdminNotification(notification);
    }
    else {
      notification = {
        icon: 'notifications',
        heading: 'Load Submission',
        contents: this.currentUserLoad.chairpersonName + ' submitted a load.'
      }
      this.userService.updateAdminNotification(notification);
      this.userService.addUserLoadsToDatabase(this.currentUserLoad);
    }

  }
}
