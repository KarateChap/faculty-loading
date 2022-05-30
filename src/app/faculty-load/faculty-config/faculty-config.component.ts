import { Component, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FacultySchedule } from 'src/app/shared/models/faculty-schedule.model';
import { Faculty } from 'src/app/shared/models/faculty.model';
import { FacultyService } from 'src/app/shared/services/faculty.service';
import { UIService } from 'src/app/shared/UIService/ui.service';

@Component({
  selector: 'app-faculty-config',
  templateUrl: './faculty-config.component.html',
  styleUrls: ['./faculty-config.component.css'],
})
export class FacultyConfigComponent implements OnInit, OnDestroy{
  @Output('')
  facultyForm: FormGroup;
  daysIncluded: FacultySchedule[] = [];
  configType = 'add';

  pickerDisabled = false;
  hasConflict = false;

  allFaculty: Faculty[] = [];
  allFacultySubs: Subscription;
  tempName: string;

  constructor(
    private facultyService: FacultyService,
    private uiService: UIService,
    private dialogRef: MatDialogRef<FacultyConfigComponent>,
    @Inject(MAT_DIALOG_DATA) private passedData: any
  ) {}

  ngOnInit(): void {
    this.configType = this.passedData.configType;

    if (this.configType == 'add') {
      this.facultyForm = new FormGroup({
        idNumber: new FormControl('', Validators.required),
        department: new FormControl(this.passedData.currentUser.department, Validators.required),
        fullName: new FormControl('', Validators.required),
        monday: new FormControl(false),
        tuesday: new FormControl(false),
        wednesday: new FormControl(false),
        thursday: new FormControl(false),
        friday: new FormControl(false),
        saturday: new FormControl(false),
        sunday: new FormControl(false)
      });
    } else {

      this.tempName = this.passedData.faculty.fullName;

      this.facultyForm = new FormGroup({
        idNumber: new FormControl(
          this.passedData.faculty.idNumber,
          Validators.required
        ),
        department: new FormControl(
          this.passedData.currentUser.department,
          Validators.required
        ),
        fullName: new FormControl(
          this.passedData.faculty.fullName,
          Validators.required
        ),
        monday: new FormControl(false),
        tuesday: new FormControl(false),
        wednesday: new FormControl(false),
        thursday: new FormControl(false),
        friday: new FormControl(false),
        saturday: new FormControl(false),
        sunday: new FormControl(false),
      });

      this.checkSchedule();
    }

    let conflictName: any;
    let conflictDepartment: any;
    this.allFacultySubs = this.facultyService.allFacultyChanged.subscribe(allFaculty => {
      this.hasConflict = false;
      this.allFaculty = allFaculty;

      console.log(allFaculty);

      this.allFaculty.forEach(element => {
        if(element.idNumber == this.facultyForm.value.idNumber){
          if(element.fullName != this.tempName){
          this.hasConflict = true;
          conflictName = element.fullName;
          conflictDepartment = element.department;
          console.log(element);
          }
        }
      });

      if(this.hasConflict == false){
        this.submitLoad();
        this.dialogRef.close();
      }
      else {
        this.uiService.showErrorToast("Cannot Add/Edit already existing ID! Conflict with: " + conflictName + ' of Department: ' + conflictDepartment, 'Error');
      }

    })
  }

  checkSchedule() {
    this.passedData.faculty.facultySchedule.forEach(
      (element: FacultySchedule) => {
        if (element.day == 'monday') {
          this.facultyForm.patchValue({ monday: true });
          this.facultyForm.addControl(
            'mondayStart',
            new FormControl(element.startTime, Validators.required)
          );
          this.facultyForm.addControl(
            'mondayEnd',
            new FormControl(element.endTime, Validators.required)
          );
        }
        if (element.day == 'tuesday') {
          this.facultyForm.patchValue({ tuesday: true });
          this.facultyForm.addControl(
            'tuesdayStart',
            new FormControl(element.startTime, Validators.required)
          );
          this.facultyForm.addControl(
            'tuesdayEnd',
            new FormControl(element.endTime, Validators.required)
          );
        }
        if (element.day == 'wednesday') {
          this.facultyForm.patchValue({ wednesday: true });
          this.facultyForm.addControl(
            'wednesdayStart',
            new FormControl(element.startTime, Validators.required)
          );
          this.facultyForm.addControl(
            'wednesdayEnd',
            new FormControl(element.endTime, Validators.required)
          );
        }
        if (element.day == 'thursday') {
          this.facultyForm.patchValue({ thursday: true });
          this.facultyForm.addControl(
            'thursdayStart',
            new FormControl(element.startTime, Validators.required)
          );
          this.facultyForm.addControl(
            'thursdayEnd',
            new FormControl(element.endTime, Validators.required)
          );
        }
        if (element.day == 'friday') {
          this.facultyForm.patchValue({ friday: true });
          this.facultyForm.addControl(
            'fridayStart',
            new FormControl(element.startTime, Validators.required)
          );
          this.facultyForm.addControl(
            'fridayEnd',
            new FormControl(element.endTime, Validators.required)
          );
        }
        if (element.day == 'saturday') {
          this.facultyForm.patchValue({ saturday: true });
          this.facultyForm.addControl(
            'saturdayStart',
            new FormControl(element.startTime, Validators.required)
          );
          this.facultyForm.addControl(
            'saturdayEnd',
            new FormControl(element.endTime, Validators.required)
          );
        }
        if (element.day == 'sunday') {
          this.facultyForm.patchValue({ sunday: true });
          this.facultyForm.addControl(
            'sundayStart',
            new FormControl(element.startTime, Validators.required)
          );
          this.facultyForm.addControl(
            'sundayEnd',
            new FormControl(element.endTime, Validators.required)
          );
        }
      }
    );
  }

  togglePicker(event: any) {
    this.pickerDisabled = !this.pickerDisabled;
  }

  onMondayChange(event: any) {
    if (this.facultyForm.value.monday == true) {
      this.facultyForm.addControl(
        'mondayStart',
        new FormControl('', Validators.required)
      );
      this.facultyForm.addControl(
        'mondayEnd',
        new FormControl('', Validators.required)
      );
    } else {
      this.facultyForm.removeControl('mondayStart');
      this.facultyForm.removeControl('mondayEnd');
    }
  }

  onTuesdayChange(event: any) {
    if (this.facultyForm.value.tuesday == true) {
      this.facultyForm.addControl(
        'tuesdayStart',
        new FormControl('', Validators.required)
      );
      this.facultyForm.addControl(
        'tuesdayEnd',
        new FormControl('', Validators.required)
      );
    } else {
      this.facultyForm.removeControl('tuesdayStart');
      this.facultyForm.removeControl('tuesdayEnd');
    }
  }

  onWednesdayChange(event: any) {
    if (this.facultyForm.value.wednesday == true) {
      this.facultyForm.addControl(
        'wednesdayStart',
        new FormControl('', Validators.required)
      );
      this.facultyForm.addControl(
        'wednesdayEnd',
        new FormControl('', Validators.required)
      );
    } else {
      this.facultyForm.removeControl('wednesdayStart');
      this.facultyForm.removeControl('wednesdayEnd');
    }
  }

  onThursdayChange(event: any) {
    if (this.facultyForm.value.thursday == true) {
      this.facultyForm.addControl(
        'thursdayStart',
        new FormControl('', Validators.required)
      );
      this.facultyForm.addControl(
        'thursdayEnd',
        new FormControl('', Validators.required)
      );
    } else {
      this.facultyForm.removeControl('thursdayStart');
      this.facultyForm.removeControl('thursdayEnd');
    }
  }

  onFridayChange(event: any) {
    if (this.facultyForm.value.friday == true) {
      this.facultyForm.addControl(
        'fridayStart',
        new FormControl('', Validators.required)
      );
      this.facultyForm.addControl(
        'fridayEnd',
        new FormControl('', Validators.required)
      );
    } else {
      this.facultyForm.removeControl('fridayStart');
      this.facultyForm.removeControl('fridayEnd');
    }
  }

  onSaturdayChange(event: any) {
    if (this.facultyForm.value.saturday == true) {
      this.facultyForm.addControl(
        'saturdayStart',
        new FormControl('', Validators.required)
      );
      this.facultyForm.addControl(
        'saturdayEnd',
        new FormControl('', Validators.required)
      );
    } else {
      this.facultyForm.removeControl('saturdayStart');
      this.facultyForm.removeControl('saturdayEnd');
    }
  }

  onSundayChange(event: any) {
    if (this.facultyForm.value.sunday == true) {
      this.facultyForm.addControl(
        'sundayStart',
        new FormControl('', Validators.required)
      );
      this.facultyForm.addControl(
        'sundayEnd',
        new FormControl('', Validators.required)
      );
    } else {
      this.facultyForm.removeControl('sundayStart');
      this.facultyForm.removeControl('sundayEnd');
    }
  }

  onSubmit() {
    this.facultyService.fetchAllFaculty(this.passedData.academicYear.startYear, this.passedData.academicYear.semester);
  }

  submitLoad(){
    if (this.configType == 'add') {
      this.checkDaysIncluded();

      this.facultyService.addFacultyToDatabase({
        idNumber: this.facultyForm.value.idNumber,
        fullName: this.facultyForm.value.fullName,
        department: this.facultyForm.value.department,
        facultySchedule: this.daysIncluded,
        startYear: this.passedData.academicYear.startYear,
        endYear: this.passedData.academicYear.endYear,
        semester: this.passedData.academicYear.semester,
        chairpersonName: this.passedData.currentUser.fullName,
      });
    } else {
      this.checkDaysIncluded();
      this.facultyService.updateFacultyToDatabase(
        {
          idNumber: this.facultyForm.value.idNumber,
          fullName: this.facultyForm.value.fullName,
          department: this.facultyForm.value.department,
          facultySchedule: this.daysIncluded,
          startYear: this.passedData.academicYear.startYear,
          endYear: this.passedData.academicYear.endYear,
          semester: this.passedData.academicYear.semester,
          chairpersonName: this.passedData.currentUser.fullName,
        },
        this.passedData.faculty.id
      );
    }
  }

  checkDaysIncluded() {
    if (this.facultyForm.value.monday) {
      this.daysIncluded.push({
        day: 'monday',
        startTime: this.facultyForm.value.mondayStart,
        endTime: this.facultyForm.value.mondayEnd,
      });
    }
    if (this.facultyForm.value.tuesday) {
      this.daysIncluded.push({
        day: 'tuesday',
        startTime: this.facultyForm.value.tuesdayStart,
        endTime: this.facultyForm.value.tuesdayEnd,
      });
    }
    if (this.facultyForm.value.wednesday) {
      this.daysIncluded.push({
        day: 'wednesday',
        startTime: this.facultyForm.value.wednesdayStart,
        endTime: this.facultyForm.value.wednesdayEnd,
      });
    }
    if (this.facultyForm.value.thursday) {
      this.daysIncluded.push({
        day: 'thursday',
        startTime: this.facultyForm.value.thursdayStart,
        endTime: this.facultyForm.value.thursdayEnd,
      });
    }
    if (this.facultyForm.value.friday) {
      this.daysIncluded.push({
        day: 'friday',
        startTime: this.facultyForm.value.fridayStart,
        endTime: this.facultyForm.value.fridayEnd,
      });
    }
    if (this.facultyForm.value.saturday) {
      this.daysIncluded.push({
        day: 'saturday',
        startTime: this.facultyForm.value.saturdayStart,
        endTime: this.facultyForm.value.saturdayEnd,
      });
    }
    if (this.facultyForm.value.sunday) {
      this.daysIncluded.push({
        day: 'sunday',
        startTime: this.facultyForm.value.sundayStart,
        endTime: this.facultyForm.value.sundayEnd,
      });
    }
  }


  ngOnDestroy(): void {
      this.allFacultySubs.unsubscribe();
  }
}
