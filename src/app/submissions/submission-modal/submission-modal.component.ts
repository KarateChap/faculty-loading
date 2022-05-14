import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    if(this.status === 'accepted'){
      this.userService.updateUserLoad(this.userLoad.id, 'accepted');
    }
    else {
      this.userService.updateDeclinedUserLoad(this.userLoad.id, 'declined', this.comments);
    }
  }
}
