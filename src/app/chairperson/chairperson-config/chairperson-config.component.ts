import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) private passedData: any,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.configType = this.passedData.configType;

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

    if(this.configType == 'add'){
      this.userService.addUserToDatabase({
        idNumber: this.chairpersonForm.value.idNumber,
        email: this.chairpersonForm.value.email,
        fullName: this.chairpersonForm.value.fullName,
        department: this.chairpersonForm.value.department,
        isActivated: this.chairpersonForm.value.isActivated,
        startDate: null,
        endDate: null,
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
      }, this.passedData.user.id)
    }


  }

  ngOnDestroy(): void {
  }
}
