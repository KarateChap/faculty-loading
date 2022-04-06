import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AcademicPeriod } from '../shared/models/academic-period.model';
import { Faculty } from '../shared/models/faculty.model';
import { NewUser } from '../shared/models/new-user.model';
import { AcademicService } from '../shared/services/academic.service';
import { FacultyService } from '../shared/services/faculty.service';
import { UserService } from '../shared/services/user.service';
import { FacultyConfigComponent } from './faculty-config/faculty-config.component';

@Component({
  selector: 'app-faculty-load',
  templateUrl: './faculty-load.component.html',
  styleUrls: ['./faculty-load.component.css'],
})
export class FacultyLoadComponent implements OnInit, OnDestroy {
  faculties: Faculty[] = [];
  facultySubs: Subscription;
  activeAcademicYear: AcademicPeriod;
  currentUser: NewUser;

  constructor(
    private dialog: MatDialog,
    private facultyService: FacultyService,
    private academicService: AcademicService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    this.activeAcademicYear = this.academicService.getActiveAcademicYear();
    this.academicService.fetchActiveAcademicYear();

    this.fetchFaculty();

    this.facultySubs = this.facultyService.facultyChanged.subscribe(
      (faculties) => {
        this.faculties = faculties;
      }
    );

  }

  fetchFaculty() {
    this.facultyService.fetchFaculty(
      this.activeAcademicYear.startYear,
      this.activeAcademicYear.semester,
      this.currentUser.fullName
    );
  }

  onAddFaculty() {
    this.dialog.open(FacultyConfigComponent, {
      data: {
        configType: 'add',
        faculties: this.faculties,
        academicYear: this.activeAcademicYear,
        currentUser: this.currentUser,
      },
    });
  }

  onEditFaculty(index: number) {
    this.dialog.open(FacultyConfigComponent, {
      data: {
        configType: 'edit',
        faculties: this.faculties,
        faculty: this.faculties[index],
        academicYear: this.activeAcademicYear,
        currentUser: this.currentUser,
      },
    });
  }



  onRemoveFaculty(index: number) {
    console.log(this.faculties[index].id);
    this.facultyService.onRemoveFaculty(this.faculties[index].id);
  }

  ngOnDestroy(): void {
    this.facultySubs.unsubscribe();
  }
}
