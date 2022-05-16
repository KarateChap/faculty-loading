import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewNotification } from 'src/app/shared/models/new-notification.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-deadline-config',
  templateUrl: './deadline-config.component.html',
  styleUrls: ['./deadline-config.component.css'],
})
export class DeadlineConfigComponent implements OnInit {
  deadlineForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private passedData: any,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.passedData.user.startDate || this.passedData.user.endDate) {
      this.deadlineForm = new FormGroup({
        startDate: new FormControl(
          this.passedData.user.startDate.toDate(),
          Validators.required
        ),
        endDate: new FormControl(this.passedData.user.endDate.toDate(), {
          validators: [Validators.required],
        }),
      });
    } else {
      this.deadlineForm = new FormGroup({
        startDate: new FormControl('', Validators.required),
        endDate: new FormControl('', {
          validators: [Validators.required],
        }),
      });
    }
  }

  onSubmit() {
    this.userService.updateUserDeadline(
      this.passedData.user.id,
      this.deadlineForm.value.startDate,
      this.deadlineForm.value.endDate
    );

    console.log(this.deadlineForm.value.startDate.to);

    let notification: NewNotification = {
      icon: 'manage_accounts',
      heading: 'Account Update',
      contents: 'The admin has extended your submission deadline to: ' + this.deadlineForm.value.startDate.toString().substring(4, 15) + ' - ' + this.deadlineForm.value.endDate.toString().substring(4, 15)
    }

    this.userService.updateChairpersonNotification(notification, this.passedData.user)
  }
}
