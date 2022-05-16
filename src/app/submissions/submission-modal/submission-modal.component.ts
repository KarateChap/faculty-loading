import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewNotification } from 'src/app/shared/models/new-notification.model';
import { UserLoad } from 'src/app/shared/models/user-load';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-submission-modal',
  templateUrl: './submission-modal.component.html',
  styleUrls: ['./submission-modal.component.css']
})
export class SubmissionModalComponent implements OnInit {

  status: string;
  userLoad: UserLoad;
  comments: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) private passedData: any, private userService: UserService) { }

  ngOnInit(): void {
    this.status = this.passedData.status;
    this.userLoad = this.passedData.userLoad;
  }


  onYesClicked(){
    let name: string = this.userLoad.chairpersonName;
    let notification: NewNotification;

    if(this.status === 'accepted'){
      notification = {
        icon: 'check',
        heading: 'Congratulations!',
        contents: 'The admin has approved your load submission.'
      }

      this.userService.updateUserLoad(this.userLoad.id, 'accepted');
      this.userService.updateLoadNotification(notification, name);
    }
    else {
      notification = {
        icon: 'notification_important',
        heading: 'Important Notification',
        contents: 'The admin has declined your load submission.'
      }
      this.userService.updateDeclinedUserLoad(this.userLoad.id, 'declined', this.comments);
      this.userService.updateLoadNotification(notification, name);
    }
  }
}
