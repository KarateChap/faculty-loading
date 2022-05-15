import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { Subscription } from 'rxjs';
import { AcademicPeriod } from '../shared/models/academic-period.model';
import { Curriculum } from '../shared/models/curriculum.model';
import { LoadItem } from '../shared/models/load-item.model';
import { NewCurriculum } from '../shared/models/new-curriculum.model';
import { NewUser } from '../shared/models/new-user.model';
import { UserLoad } from '../shared/models/user-load';
import { AcademicService } from '../shared/services/academic.service';
import { CurriculumService } from '../shared/services/curriculum.service';
import { LoadService } from '../shared/services/load.service';
import { UserService } from '../shared/services/user.service';
import { UIService } from '../shared/UIService/ui.service';
import { ClassScheduleTimelineModalComponent } from './class-schedule-timeline-modal/class-schedule-timeline-modal.component';
import { FacultyLoadTimelineModalComponent } from './faculty-load-timeline-modal/faculty-load-timeline-modal.component';
import { SetAcademicYearComponent } from './set-academic-year/set-academic-year.component';
import { SubmitConfirmationModalComponent } from './submit-confirmation-modal/submit-confirmation-modal.component';
import { ViewHistoryModalComponent } from './view-history-modal/view-history-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileImportInput', { static: false }) fileImportInput: any;
  academicYears: AcademicPeriod[] = [];
  academicSubs: Subscription;
  curriculum: NewCurriculum[] = [];
  csvRecords: any;
  loadSubs: Subscription;
  allLoadItems: LoadItem[] = [];

  displayedColumns = [
    'code',
    'subjectTitle',
    'units',
    'preReq',
    'subjectSemester',
    'subjectYear',
    'department',
  ];
  dataSource = new MatTableDataSource<Curriculum>();
  curriculumSubs: Subscription;
  newCurriculum: Curriculum[] = [];
  unfilteredNewCurriculum: Curriculum[] = [];
  newCSVSubs: Subscription;
  currentUser: NewUser;
  activeAcademicYear: AcademicPeriod;
  userLoads: UserLoad[] = [];
  userLoadSubs: Subscription;
  currentUserLoad: UserLoad;
  currentUserLoadSubs: Subscription;

  constructor(
    private dialog: MatDialog,
    private AcademicService: AcademicService,
    private ngxCsvParser: NgxCsvParser,
    private curriculumService: CurriculumService,
    private uiService: UIService,
    private userService: UserService,
    private loadService: LoadService
  ) {}

  ngOnInit(): void {
    this.activeAcademicYear = this.AcademicService.getActiveAcademicYear();
    this.currentUser = this.userService.getCurrentUser();
    this.curriculumService.fetchAllCurriculum();
    this.curriculumSubs =
      this.curriculumService.fetchCurriculumChanged.subscribe((curriculum) => {
        this.newCurriculum = curriculum;
        this.unfilteredNewCurriculum = this.newCurriculum;
        this.dataSource.data = this.newCurriculum;
      });

    this.AcademicService.fetchAllAcademicYear();
    this.academicSubs = this.AcademicService.academicYearChange.subscribe(
      (academicYears) => {
        this.academicYears = academicYears;

        this.loadService.fetchAllLoad(
          this.activeAcademicYear.startYear,
          this.activeAcademicYear.semester,
          this.currentUser.fullName
        );
      }
    );

    this.loadSubs = this.loadService.allLoadChange.subscribe((loadItems) => {
      this.allLoadItems = loadItems;
    });

    this.userService.fetchUserLoad(
      this.activeAcademicYear.startYear,
      this.activeAcademicYear.semester,
      this.currentUser.fullName
    );
    this.currentUserLoadSubs =
      this.userService.currentUserLoadChanged.subscribe((currentUserLoad) => {
        this.currentUserLoad = currentUserLoad;
        console.log(this.currentUserLoad);
      });
  }

  onsee() {}

  setAcademicYear() {
    this.dialog.open(SetAcademicYearComponent, {
      data: {
        academicYears: this.academicYears,
      },
    });
  }

  uploadCsv() {}

  async fileChangeListener($event: any) {
    if (this.unfilteredNewCurriculum.length > 0) {
      await this.curriculumService.deleteCurriculum();
      this.createCurriculum($event);
    } else {
      this.createCurriculum($event);
    }
  }

  createCurriculum($event: any) {
    const files = $event.srcElement.files;
    this.ngxCsvParser
      .parse(files[0], { header: true, delimiter: ',' })
      .pipe()
      .subscribe((result) => {
        this.csvRecords = result;
        this.csvRecords.forEach((element: any) => {
          this.curriculum.push({
            code: element['Code'],
            subjectTitle: element['Subject Title'],
            units: element['Units'],
            preReq: element['Pre Req'],
            subjectSemester: element['Subject Semester'],
            subjectYear: element['Subject Year'],
            department: element['Department'],
            year: element['Year'],
          });
        });
        this.curriculumService.setCurriculumToDatabase(this.curriculum);
        this.curriculum = [];
        this.csvRecords = [];
        // runAlready = true;
      }),
      (error: NgxCSVParserError) => {
        console.log('Error', error);
      };
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filter(value: String) {
    this.newCurriculum = this.unfilteredNewCurriculum;

    if (value !== 'All') {
      this.dataSource.data = this.newCurriculum.filter(function (el) {
        return el.department === value;
      });
    } else {
      this.newCurriculum = this.unfilteredNewCurriculum;
      this.dataSource.data = this.newCurriculum;
    }
  }

  openClassScheduleTimeline() {
    this.dialog.open(ClassScheduleTimelineModalComponent, {
      data: {
        currentUser: this.currentUser,
        activeAcademicYear: this.activeAcademicYear,
      },
    });
  }
  openFacultyLoadTimeline() {
    this.dialog.open(FacultyLoadTimelineModalComponent, {
      data: {
        currentUser: this.currentUser,
        activeAcademicYear: this.activeAcademicYear,
      },
    });
  }

  onSubmitLoads() {
    if (!this.currentUserLoad) {
      this.dialog.open(SubmitConfirmationModalComponent, {
        data: {
          year: this.activeAcademicYear.startYear,
          semester: this.activeAcademicYear.semester,
          department: this.currentUser.department,
          chairpersonName: this.currentUser.fullName,
          status: 'pending',
          dateSubmitted: new Date(),
          comment: 'hehe',
          idNumber: this.currentUser.idNumber,
          loadItem: this.allLoadItems,
          hasData: false,

        },
      });
    } else {
      this.dialog.open(SubmitConfirmationModalComponent, {
        data: {
          year: this.activeAcademicYear.startYear,
          semester: this.activeAcademicYear.semester,
          department: this.currentUser.department,
          chairpersonName: this.currentUser.fullName,
          status: 'pending',
          dateSubmitted: new Date(),
          comment: 'hehe',
          idNumber: this.currentUser.idNumber,
          loadItem: this.allLoadItems,
          hasData: true,
          userLoadId: this.currentUserLoad.id
        },
      });
    }
  }

  onViewHistory(){
    this.dialog.open(ViewHistoryModalComponent);
  }

  ngOnDestroy(): void {
    this.academicSubs.unsubscribe();
    this.curriculumSubs.unsubscribe();
    this.loadSubs.unsubscribe();
  }
}
