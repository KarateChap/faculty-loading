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
import { AcademicService } from '../shared/services/academic.service';
import { CurriculumService } from '../shared/services/curriculum.service';
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
  selectedDepartment = '';

  displayedColumns = ['code', 'subjectTitle', 'units', 'preReq', 'subjectSemester', 'subjectYear', 'department'];
  dataSource = new MatTableDataSource<Curriculum>();
  curriculumSubs: Subscription;
  newCurriculum: Curriculum[] = [];

  unfilteredNewCurriculum: Curriculum[] = [];

  constructor(
    private dialog: MatDialog,
    private AcademicService: AcademicService,
    private ngxCsvParser: NgxCsvParser,
    private curriculumService: CurriculumService,
    private uiService: UIService
  ) {}

  ngOnInit(): void {
    this.curriculumService.fetchAllCurriculum();
    this.curriculumSubs = this.curriculumService.fetchCurriculumChanged.subscribe(curriculum => {
      this.newCurriculum = curriculum;
      this.unfilteredNewCurriculum = this.newCurriculum;
      this.dataSource.data = this.newCurriculum;
      console.log(this.dataSource);
    })
    this.AcademicService.fetchAllAcademicYear();
    this.academicSubs = this.AcademicService.academicYearChange.subscribe(
      (academicYears) => {
        this.academicYears = academicYears;
      }
    );
  }

  onsee(){

  }

  setAcademicYear() {
    this.dialog.open(SetAcademicYearComponent, {
      data: {
        academicYears: this.academicYears,
      },
    });
  }

  uploadCsv() {}

  fileChangeListener($event: any): void {
    this.deleteCurrentCurriculum();
    this.curriculumService.curriculumChanged.subscribe( () =>{
      if(this.selectedDepartment != ''){
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
                department: this.selectedDepartment
              })
            });
            this.curriculumService.setCurriculumToDatabase(this.curriculum);
          }),
          (error: NgxCSVParserError) => {
            console.log('Error', error);
          };
      }
      else{
        this.uiService.showErrorToast('Please select a department first!', 'Error');
      }
    })
  }

  deleteCurrentCurriculum(){
    this.curriculumService.deleteCurriculum(this.selectedDepartment);
  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  filter(value: String){
    this.newCurriculum = this.unfilteredNewCurriculum;

    if(value !== 'All'){
      this.dataSource.data = this.newCurriculum.filter(function (el) {

        return el.department === value;
      })
    }
    else {
      this.newCurriculum = this.unfilteredNewCurriculum;
      this.dataSource.data = this.newCurriculum;
    }


  }

  ngOnDestroy(): void {
    this.academicSubs.unsubscribe();
    this.curriculumSubs.unsubscribe();
  }
}
