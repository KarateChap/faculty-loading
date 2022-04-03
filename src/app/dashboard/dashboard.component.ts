import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AcademicPeriod } from '../shared/models/academic-period.model';
import { AcademicService } from '../shared/services/academic.service';
import { SetAcademicYearComponent } from './set-academic-year/set-academic-year.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,OnDestroy {

  academicYears: AcademicPeriod [] = [];
  academicSubs: Subscription;
  constructor(private dialog: MatDialog, private AcademicService: AcademicService) { }

  ngOnInit(): void {
    this.AcademicService.fetchAllAcademicYear();
    this.academicSubs = this.AcademicService.academicYearChange.subscribe(academicYears => {
      this.academicYears = academicYears;
    })
  }

  setAcademicYear(){
    this.dialog.open(SetAcademicYearComponent, {
      data: {
        academicYears: this.academicYears,
      },
    })
  }

  ngOnDestroy(): void {
      this.academicSubs.unsubscribe();
  }
}
