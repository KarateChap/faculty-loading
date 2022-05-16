import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { User } from '../shared/models/user.model';
import { UserService } from '../shared/services/user.service';
import { ChairpersonConfigComponent } from './chairperson-config/chairperson-config.component';
import { DeadlineConfigComponent } from './deadline-config/deadline-config.component';

@Component({
  selector: 'app-chairperson',
  templateUrl: './chairperson.component.html',
  styleUrls: ['./chairperson.component.css'],
})
export class ChairpersonComponent implements OnInit, OnDestroy {
  userSubs: Subscription;
  users: User[] = [];

  isLoading = true;

  constructor(private dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {
    this.userSubs = this.userService.usersChanged.subscribe((users) => {
      this.users = users;
      this.isLoading = false;
    });
    this.userService.fetchUsers();
  }

  onAddChairperson() {
    this.dialog.open(ChairpersonConfigComponent, {
      data: {
        configType: 'add',
      },
    });
  }

  onEditAccount(index: number) {
    this.dialog.open(ChairpersonConfigComponent, {
      data: {
        configType: 'edit',
        user: this.users[index],
      },
    });
  }

  onEditDeadline(index: number) {
    this.dialog.open(DeadlineConfigComponent, {
      data: {
        user: this.users[index],
      },
    });
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }
}
