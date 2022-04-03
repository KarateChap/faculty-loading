import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AcademicPeriod } from 'src/app/shared/models/academic-period.model';
import { AcademicService } from 'src/app/shared/services/academic.service';

@Component({
  selector: 'app-set-academic-year',
  templateUrl: './set-academic-year.component.html',
  styleUrls: ['./set-academic-year.component.css'],
})
export class SetAcademicYearComponent implements OnInit, OnDestroy {
  @ViewChild('picker') datePicker: MatDatepicker<any>; //
  academicForm: FormGroup;
  startYear: string;
  endYear: string;
  activeAcadId: string;
  activeSubs: Subscription;
  academicYears: AcademicPeriod[] = [];
  isExisting = false;
  existingIdString: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private passedData: any,
    private academicService: AcademicService
  ) {}

  ngOnInit(): void {
    if (this.passedData.academicYears.length > 0) {
      this.academicYears = this.passedData.academicYears;
      this.academicService.fetchActiveAcademicYear();
    }
    this.activeSubs = this.academicService.activeIdChange.subscribe(
      (activeId) => {
        this.activeAcadId = activeId;
      }
    );
    this.academicForm = new FormGroup({
      semester: new FormControl('', Validators.required),
    });
  }

  close(event: any) {
    this.datePicker.close();
    const dateVar = event.toString().split(' ');
    this.startYear = dateVar[3];
    this.endYear = (+this.startYear + 1).toString();
  }

  checkError() {
    let elementString: string[] = [];
    let inputString = this.startYear + this.endYear + this.academicForm.value.semester
    let existingId: number = 0;
    this.academicYears.forEach((element) => {
      elementString.push(element.startYear + element.endYear + element.semester);
    });

    elementString.forEach((element) => {
      if (element == inputString) {
        this.isExisting = true;
        this.existingIdString = this.academicYears[existingId].id;
      }
      existingId++;
    });
  }

  onSubmit() {

    this.checkError();

    if(this.isExisting){
      if (this.activeAcadId) {
        this.academicService.setInactiveAcademicYear(this.activeAcadId);
      }
      this.academicService.updateActiveAcademicYear(this.existingIdString);
      this.academicService.fetchActiveAcademicYear();
    }
    else {
      if (this.activeAcadId) {
        this.academicService.setInactiveAcademicYear(this.activeAcadId);
      }

      this.academicService.setAcademicYear({
        startYear: this.startYear,
        endYear: this.endYear,
        semester: this.academicForm.value.semester,
        isActive: true,
      });
      this.academicService.fetchActiveAcademicYear();
    }


  }

  ngOnDestroy(): void {
    this.activeSubs.unsubscribe();
  }
}
