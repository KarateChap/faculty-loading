import { Component, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FacultySchedule } from 'src/app/shared/models/faculty-schedule.model';
import { FacultyService } from 'src/app/shared/services/faculty.service';

@Component({
  selector: 'app-faculty-config',
  templateUrl: './faculty-config.component.html',
  styleUrls: ['./faculty-config.component.css'],
})
export class FacultyConfigComponent implements OnInit {
  @Output('')
  facultyForm: FormGroup;
  daysIncluded: FacultySchedule[] = [];
  configType = 'add';

  pickerDisabled = false;

  constructor(
    private facultyService: FacultyService,
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
      });
    } else {
      console.log(this.passedData.faculty.facultySchedule);

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
      });

      this.checkSchedule();
    }
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

  onSubmit() {
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
  }
}
