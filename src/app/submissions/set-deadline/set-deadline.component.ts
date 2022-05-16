import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NewNotification } from 'src/app/shared/models/new-notification.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-set-deadline',
  templateUrl: './set-deadline.component.html',
  styleUrls: ['./set-deadline.component.css'],
})
export class SetDeadlineComponent implements OnInit {
  deadlineForm: FormGroup;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.deadlineForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    let notification: NewNotification;
    notification = {
      icon: 'campaign',
      heading: 'Announcement',
      contents: 'The admin has set a deadline for load submission'
    }

    this.userService.setUserDeadline(
      this.deadlineForm.value.startDate,
      this.deadlineForm.value.endDate
    );

    this.userService.updateAllChairpersonNotification(notification);
  }
}
