import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { Subscription } from 'rxjs';
import { AcademicPeriod } from '../shared/models/academic-period.model';
import { Curriculum } from '../shared/models/curriculum.model';
import { NewCurriculum } from '../shared/models/new-curriculum.model';
import { NewUser } from '../shared/models/new-user.model';
import { AcademicService } from '../shared/services/academic.service';
import { CurriculumService } from '../shared/services/curriculum.service';
import { UserService } from '../shared/services/user.service';
import { UIService } from '../shared/UIService/ui.service';
import { SetAcademicYearComponent } from './set-academic-year/set-academic-year.component';

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

  constructor(
    private dialog: MatDialog,
    private AcademicService: AcademicService,
    private ngxCsvParser: NgxCsvParser,
    private curriculumService: CurriculumService,
    private uiService: UIService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

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
      }
    );
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

  async fileChangeListener($event: any){

    if(this.unfilteredNewCurriculum.length > 0){
      await this.curriculumService.deleteCurriculum();
      this.createCurriculum($event);
    }
    else{
      this.createCurriculum($event);
    }
  }

  createCurriculum($event: any){
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
            year: element['Year']
          });
        });
        this.curriculumService.setCurriculumToDatabase(this.curriculum);
        this.curriculum = [];
        this.csvRecords = [];
        // runAlready = true;
      }),(error: NgxCSVParserError) => {
        console.log('Error', error);
      }
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

  ngOnDestroy(): void {
    this.academicSubs.unsubscribe();
    this.curriculumSubs.unsubscribe();
  }
}
