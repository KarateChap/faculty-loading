import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewNotification } from 'src/app/shared/models/new-notification.model';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UIService } from 'src/app/shared/UIService/ui.service';

@Component({
  selector: 'app-chairperson-config',
  templateUrl: './chairperson-config.component.html',
  styleUrls: ['./chairperson-config.component.css'],
})
export class ChairpersonConfigComponent implements OnInit, OnDestroy {
  password = '';
  confirmPassword = '';
  selected = 'Information Technology'

  configType = 'add';
  icon1 = 'visibility';
  passwordType1 = 'password';

  icon2 = 'visibility';
  passwordType2 = 'password';

  chairpersonForm: FormGroup;
  currentUser: any;
  tempName: string;


  constructor(
    @Inject(MAT_DIALOG_DATA) private passedData: any,
    private authService: AuthService,
    private userService: UserService,
    private uiService: UIService,
    private dialogRef: MatDialogRef<ChairpersonConfigComponent>
  ) {}

  ngOnInit(): void {
    this.configType = this.passedData.configType;

    if(this.passedData.user){
      this.currentUser = this.passedData.user;
    }

    if(this.configType == 'add'){
      this.chairpersonForm = new FormGroup({
        fullName: new FormControl('', Validators.required),
        idNumber: new FormControl('', Validators.required),
        department: new FormControl('', Validators.required),
        email: new FormControl('', {
          validators: [Validators.required, Validators.email],
        }),
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(8)],
        }),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        isActivated: new FormControl(''),
      });
    }
    else {
      this.selected = this.passedData.user.department;
      this.tempName = this.passedData.user.fullName;

      this.chairpersonForm = new FormGroup({
        fullName: new FormControl(this.passedData.user.fullName, Validators.required),
        idNumber: new FormControl(this.passedData.user.idNumber, Validators.required),
        department: new FormControl(this.passedData.user.department, Validators.required),
        isActivated: new FormControl(this.passedData.user.isActivated),
      });
    }

  }

  onTogglePasswordVisibility1() {
    if (this.icon1 == 'visibility') {
      this.icon1 = 'visibility_off';
      this.passwordType1 = 'text';
    } else {
      this.icon1 = 'visibility';
      this.passwordType1 = 'password';
    }
  }

  onTogglePasswordVisibility2() {
    if (this.icon2 == 'visibility') {
      this.icon2 = 'visibility_off';
      this.passwordType2 = 'text';
    } else {
      this.icon2 = 'visibility';
      this.passwordType2 = 'password';
    }
  }

  onSubmit() {

    let users: User[] = [];
    users = this.passedData.users;
    let isIdExisting = false;

    users.forEach(element => {
      if(element.idNumber == this.chairpersonForm.value.idNumber){
        if(element.fullName != this.tempName){
          this.uiService.showErrorToast('Cannot Add/Edit already existing ID!', 'Error');
          isIdExisting = true;
        }
      }
    });



    if(isIdExisting == false){

      let notification: NewNotification = {
        icon: 'manage_accounts',
        heading: 'Account Update',
        contents: 'The admin has updated your account status/information.'
      }

      if(this.configType == 'add'){
        this.userService.addUserToDatabase({
          idNumber: this.chairpersonForm.value.idNumber,
          email: this.chairpersonForm.value.email,
          fullName: this.chairpersonForm.value.fullName,
          department: this.chairpersonForm.value.department,
          isActivated: this.chairpersonForm.value.isActivated,
          startDate: null,
          endDate: null,
          notification: []
        });

        this.authService.registerUser({
          email: this.chairpersonForm.value.email,
          password: this.chairpersonForm.value.password,
        });
      }
      else {
        this.userService.updateUserToDatabase({
          idNumber: this.chairpersonForm.value.idNumber,
          email: this.passedData.user.email,
          fullName: this.chairpersonForm.value.fullName,
          department: this.chairpersonForm.value.department,
          isActivated: this.chairpersonForm.value.isActivated,
          startDate: this.passedData.user.startDate,
          endDate: this.passedData.user.endDate,
          notification: []
        }, this.passedData.user.id)

        this.userService.updateChairpersonNotification(notification, this.passedData.user);
      }
      this.dialogRef.close();
    }

  }

  ngOnDestroy(): void {
  }
}
