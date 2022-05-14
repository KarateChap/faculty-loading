import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
      loadItem: this.passedData.loadItem
    }
  }

  onSubmitUserLoad(){
    if(this.passedData.hasData){
      this.userService.updateUserLoad(this.passedData.userLoadId, 'pending');
    }
    else {
      this.userService.addUserLoadsToDatabase(this.currentUserLoad);
    }

  }
}
