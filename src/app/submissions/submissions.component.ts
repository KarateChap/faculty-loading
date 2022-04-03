import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SetDeadlineComponent } from './set-deadline/set-deadline.component';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDeadlineModal(){
    this.dialog.open(SetDeadlineComponent);
  }

}
