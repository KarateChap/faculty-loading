import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadItem } from 'src/app/shared/models/load-item.model';
import { LoadService } from 'src/app/shared/services/load.service';
import jsPDF from 'jspdf';
import { UIService } from 'src/app/shared/UIService/ui.service';
import { Faculty } from 'src/app/shared/models/faculty.model';
import { FacultyService } from 'src/app/shared/services/faculty.service';
import { AcademicPeriod } from 'src/app/shared/models/academic-period.model';
import { AcademicService } from 'src/app/shared/services/academic.service';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { NewUser } from 'src/app/shared/models/new-user.model';
import { MatDialog } from '@angular/material/dialog';
import { FacultySectionLoadComponent } from './faculty-section-load/faculty-section-load.component';

@Component({
  selector: 'app-section-load-view',
  templateUrl: './section-load-view.component.html',
  styleUrls: ['./section-load-view.component.css'],
})
export class SectionLoadViewComponent implements OnInit, OnDestroy{
  @ViewChild('content', { static: true }) content: ElementRef;
  view = 'Class Schedule Timeline';
  currentSectionLoad: LoadItem[] = [];
  sectionSubs: Subscription;
  times: string[] = [
    '7:00 - 7:30 AM',
    '7:30 - 8:00 AM',
    '8:00 - 8:30 AM',
    '8:30 - 9:00 AM',
    '9:00 - 9:30 AM',
    '9:30 - 10:00 AM',
    '10:00 - 10:30 AM',
    '10:30 - 11:00 AM',
    '11:00 - 11:30 AM',
    '11:30 - 12:00 PM',
    '12:00 - 12:30 PM',
    '12:30 - 1:00 PM',
    '1:00 - 1:30 PM',
    '1:30 - 2:00 PM',
    '2:00 - 2:30 PM',
    '2:30 - 3:00 PM',
    '3:00 - 3:30 PM',
    '3:30 - 4:00 PM',
    '4:00 - 4:30 PM',
    '4:30 - 5:00 PM',
    '5:00 - 5:30 PM',
    '5:30 - 6:00 PM',
    '6:00 - 6:30 PM',
    '6:30 - 7:00 PM',
    '7:00 - 7:30 PM',
    '7:30 - 8:00 PM',
    '8:00 - 8:30 PM',
  ];

  mondayLoad: LoadItem[] = [];
  tuesdayLoad: LoadItem[] = [];
  wednesdayLoad: LoadItem[] = [];
  thursdayLoad: LoadItem[] = [];
  fridayLoad: LoadItem[] = [];
  saturdayLoad: LoadItem[] = [];
  sundayLoad: LoadItem[] = [];
  allLoads: LoadItem[] = [];

  monday: string[] = [];
  tuesday: string[] = [];
  wednesday: string[] = [];
  thursday: string[] = [];
  friday: string[] = [];
  saturday: string[] = [];
  sunday: string[] = [];


  faculties: Faculty[] = [];
  academicSubs: Subscription;
  activeAcademic: AcademicPeriod;
  currentChairperson: NewUser;

  constructor(
    private loadService: LoadService,
    private uiService: UIService,
    private facultyService: FacultyService,
    private academicService: AcademicService,
    private userService: UserService,
    private dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.activeAcademic = this.academicService.getActiveAcademicYear();
    this.currentChairperson = this.userService.getCurrentUser();

    this.facultyService.fetchFaculty(this.activeAcademic.startYear, this.activeAcademic.semester, this.currentChairperson.fullName);
    this.academicSubs = this.facultyService.facultyChanged.subscribe(faculties => {
      this.faculties = faculties;
      console.log(this.faculties);
    })




    this.fillDayArrays();
    this.sectionSubs = this.loadService.currentSectionLoadChange.subscribe(
      (currentSection) => {
        this.fillDayArrays();
        this.currentSectionLoad = currentSection;
        this.getDays(currentSection);
        this.checkMondayLoads();
        this.checkTuesdayLoads();
        this.checkWednesdayLoads();
        this.checkThursdayLoads();
        this.checkFridayLoads();
        this.checkSaturdayLoads();
        this.checkSundayLoads();
      }
    );
  }

  checkMondayLoads() {
    const dateFromStr: any = (str:any) => new Date('1970/01/01 ' + str);
    this.mondayLoad.sort((a,b) => dateFromStr(a.startTime) - dateFromStr(b.startTime));


    console.log(this.mondayLoad);
    this.mondayLoad.forEach((load) => {
      let startIndex = 0;
      let endIndex = 0;
      let indexDifference = 0;
      let startIndexCounter = 0;
      let endIndexCounter = 0;
      let subjectCode = '';
      let facultyName = '';

      if (load.startTime == '7:00 AM') {
        subjectCode = load.subjectCode;
        startIndex = startIndexCounter;
      }

      this.times.forEach((time) => {
        if (time.includes(load.startTime)) {
          subjectCode = load.subjectCode;
          startIndex = startIndexCounter + 1;
        }
        if (time.includes(load.endTime)) {
          let n = load.facultyName.split(' ');
          facultyName = n[n.length - 1];
          endIndex = endIndexCounter;
        }
        startIndexCounter++;
        endIndexCounter++;
      });
      let offset = 0;
      if (endIndex - startIndex != 1) {
        indexDifference = endIndex - startIndex;
        offset = Math.floor(indexDifference / 2);
        this.monday[startIndex + offset] = subjectCode;
        this.monday[endIndex - offset] = facultyName;

        for (let index = 0; index < offset; index++) {
          if(this.monday[startIndex] == '-'  || this.monday[endIndex] == '@'){
            this.monday[startIndex] = '@';
          }else {
            this.monday[startIndex] = '-';
          }
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {
          if(this.monday[endIndex] == '-' || this.monday[endIndex] == '@'){
            this.monday[startIndex] = '@';
          }
          else {
            this.monday[endIndex] = '-';
          }
          endIndex--;
        }
      } else {
        this.monday[startIndex] = subjectCode;
        this.monday[endIndex] = facultyName;
      }

      offset = 0;
      startIndex = 0;
      endIndex = 0;
      indexDifference = 0;
      startIndexCounter = 0;
      endIndexCounter = 0;
    });
  }
  checkTuesdayLoads() {

    const dateFromStr: any = (str:any) => new Date('1970/01/01 ' + str);
    this.tuesdayLoad.sort((a,b) => dateFromStr(a.startTime) - dateFromStr(b.startTime));

    this.tuesdayLoad.forEach((load) => {
      let startIndex = 0;
      let endIndex = 0;
      let indexDifference = 0;
      let startIndexCounter = 0;
      let endIndexCounter = 0;
      let subjectCode = '';
      let facultyName = '';
      if (load.startTime == '7:00 AM') {
        subjectCode = load.subjectCode;
        startIndex = startIndexCounter;
      }
      this.times.forEach((time) => {
        if (time.includes(load.startTime)) {
          subjectCode = load.subjectCode;
          startIndex = startIndexCounter + 1;
        }
        if (time.includes(load.endTime)) {
          let n = load.facultyName.split(' ');
          facultyName = n[n.length - 1];
          endIndex = endIndexCounter;
        }
        startIndexCounter++;
        endIndexCounter++;
      });

      let offset = 0;
      if (endIndex - startIndex != 1) {
        indexDifference = endIndex - startIndex;
        offset = Math.floor(indexDifference / 2);
        this.tuesday[startIndex + offset] = subjectCode;
        this.tuesday[endIndex - offset] = facultyName;

        for (let index = 0; index < offset; index++) {
          if(this.tuesday[startIndex] == '-'  || this.tuesday[endIndex] == '@'){
            this.tuesday[startIndex] = '@';
          }else {
            this.tuesday[startIndex] = '-';
          }
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {
          if(this.tuesday[endIndex] == '-' || this.tuesday[endIndex] == '@'){
            this.tuesday[startIndex] = '@';
          }
          else {
            this.tuesday[endIndex] = '-';
          }
          endIndex--;
        }
      } else {
        this.tuesday[startIndex] = subjectCode;
        this.tuesday[endIndex] = facultyName;
      }

      offset = 0;
      startIndex = 0;
      endIndex = 0;
      indexDifference = 0;
      startIndexCounter = 0;
      endIndexCounter = 0;
    });
  }
  checkWednesdayLoads() {

    const dateFromStr: any = (str:any) => new Date('1970/01/01 ' + str);
    this.wednesdayLoad.sort((a,b) => dateFromStr(a.startTime) - dateFromStr(b.startTime));

    this.wednesdayLoad.forEach((load) => {
      let startIndex = 0;
      let endIndex = 0;
      let indexDifference = 0;
      let startIndexCounter = 0;
      let endIndexCounter = 0;
      let subjectCode = '';
      let facultyName = '';

      if (load.startTime == '7:00 AM') {
        subjectCode = load.subjectCode;
        startIndex = startIndexCounter;
      }
      this.times.forEach((time) => {
        if (time.includes(load.startTime)) {
          subjectCode = load.subjectCode;
          startIndex = startIndexCounter + 1;
        }
        if (time.includes(load.endTime)) {
          let n = load.facultyName.split(' ');
          facultyName = n[n.length - 1];
          endIndex = endIndexCounter;
        }
        startIndexCounter++;
        endIndexCounter++;
      });

      let offset = 0;
      if (endIndex - startIndex != 1) {
        indexDifference = endIndex - startIndex;
        offset = Math.floor(indexDifference / 2);
        this.wednesday[startIndex + offset] = subjectCode;
        this.wednesday[endIndex - offset] = facultyName;

        for (let index = 0; index < offset; index++) {
          if(this.wednesday[startIndex] == '-'  || this.wednesday[endIndex] == '@'){
            this.wednesday[startIndex] = '@';
          }else {
            this.wednesday[startIndex] = '-';
          }
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {
          if(this.wednesday[endIndex] == '-' || this.wednesday[endIndex] == '@'){
            this.wednesday[startIndex] = '@';
          }
          else {
            this.wednesday[endIndex] = '-';
          }
          endIndex--;
        }
      } else {
        this.wednesday[startIndex] = subjectCode;
        this.wednesday[endIndex] = facultyName;
      }

      offset = 0;
      startIndex = 0;
      endIndex = 0;
      indexDifference = 0;
      startIndexCounter = 0;
      endIndexCounter = 0;
    });
  }
  checkThursdayLoads() {

    const dateFromStr: any = (str:any) => new Date('1970/01/01 ' + str);
    this.thursdayLoad.sort((a,b) => dateFromStr(a.startTime) - dateFromStr(b.startTime));

    this.thursdayLoad.forEach((load) => {
      let startIndex = 0;
      let endIndex = 0;
      let indexDifference = 0;
      let startIndexCounter = 0;
      let endIndexCounter = 0;
      let subjectCode = '';
      let facultyName = '';

      if (load.startTime == '7:00 AM') {
        subjectCode = load.subjectCode;
        startIndex = startIndexCounter;
      }
      this.times.forEach((time) => {
        if (time.includes(load.startTime)) {
          subjectCode = load.subjectCode;
          startIndex = startIndexCounter + 1;
        }
        if (time.includes(load.endTime)) {
          let n = load.facultyName.split(' ');
          facultyName = n[n.length - 1];
          endIndex = endIndexCounter;
        }
        startIndexCounter++;
        endIndexCounter++;
      });

      let offset = 0;

      if (endIndex - startIndex != 1) {
        indexDifference = endIndex - startIndex;
        offset = Math.floor(indexDifference / 2);
        this.thursday[startIndex + offset] = subjectCode;
        this.thursday[endIndex - offset] = facultyName;

        for (let index = 0; index < offset; index++) {
          if(this.thursday[startIndex] == '-'  || this.thursday[endIndex] == '@'){
            this.thursday[startIndex] = '@';
          }else {
            this.thursday[startIndex] = '-';
          }
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {
          if(this.thursday[endIndex] == '-' || this.thursday[endIndex] == '@'){
            this.thursday[startIndex] = '@';
          }
          else {
            this.thursday[endIndex] = '-';
          }
          endIndex--;
        }
      } else {
        this.thursday[startIndex] = subjectCode;
        this.thursday[endIndex] = facultyName;
      }

      offset = 0;
      startIndex = 0;
      endIndex = 0;
      indexDifference = 0;
      startIndexCounter = 0;
      endIndexCounter = 0;
    });
  }
  checkFridayLoads() {

    const dateFromStr: any = (str:any) => new Date('1970/01/01 ' + str);
    this.fridayLoad.sort((a,b) => dateFromStr(a.startTime) - dateFromStr(b.startTime));

    this.fridayLoad.forEach((load) => {
      let startIndex = 0;
      let endIndex = 0;
      let indexDifference = 0;
      let startIndexCounter = 0;
      let endIndexCounter = 0;
      let subjectCode = '';
      let facultyName = '';

      if (load.startTime == '7:00 AM') {
        subjectCode = load.subjectCode;
        startIndex = startIndexCounter;
      }
      this.times.forEach((time) => {
        if (time.includes(load.startTime)) {
          subjectCode = load.subjectCode;
          startIndex = startIndexCounter + 1;
        }
        if (time.includes(load.endTime)) {
          let n = load.facultyName.split(' ');
          facultyName = n[n.length - 1];
          endIndex = endIndexCounter;
        }
        startIndexCounter++;
        endIndexCounter++;
      });

      let offset = 0;
      if (endIndex - startIndex != 1) {
        indexDifference = endIndex - startIndex;
        offset = Math.floor(indexDifference / 2);
        this.friday[startIndex + offset] = subjectCode;
        this.friday[endIndex - offset] = facultyName;

        for (let index = 0; index < offset; index++) {
          if(this.friday[startIndex] == '-'  || this.friday[endIndex] == '@'){
            this.friday[startIndex] = '@';
          }else {
            this.friday[startIndex] = '-';
          }
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {
          if(this.friday[endIndex] == '-' || this.friday[endIndex] == '@'){
            this.friday[startIndex] = '@';
          }
          else {
            this.friday[endIndex] = '-';
          }
          endIndex--;
        }
      } else {
        this.friday[startIndex] = subjectCode;
        this.friday[endIndex] = facultyName;
      }

      offset = 0;
      startIndex = 0;
      endIndex = 0;
      indexDifference = 0;
      startIndexCounter = 0;
      endIndexCounter = 0;
    });
  }

  checkSaturdayLoads() {

    const dateFromStr: any = (str:any) => new Date('1970/01/01 ' + str);
    this.saturdayLoad.sort((a,b) => dateFromStr(a.startTime) - dateFromStr(b.startTime));

    this.saturdayLoad.forEach((load) => {
      let startIndex = 0;
      let endIndex = 0;
      let indexDifference = 0;
      let startIndexCounter = 0;
      let endIndexCounter = 0;
      let subjectCode = '';
      let facultyName = '';

      if (load.startTime == '7:00 AM') {
        subjectCode = load.subjectCode;
        startIndex = startIndexCounter;
      }
      this.times.forEach((time) => {
        if (time.includes(load.startTime)) {
          subjectCode = load.subjectCode;
          startIndex = startIndexCounter + 1;
        }
        if (time.includes(load.endTime)) {
          let n = load.facultyName.split(' ');
          facultyName = n[n.length - 1];
          endIndex = endIndexCounter;
        }
        startIndexCounter++;
        endIndexCounter++;
      });

      let offset = 0;
      if (endIndex - startIndex != 1) {
        indexDifference = endIndex - startIndex;
        offset = Math.floor(indexDifference / 2);
        this.saturday[startIndex + offset] = subjectCode;
        this.saturday[endIndex - offset] = facultyName;

        for (let index = 0; index < offset; index++) {
          if(this.saturday[startIndex] == '-'  || this.saturday[endIndex] == '@'){
            this.saturday[startIndex] = '@';
          }else {
            this.saturday[startIndex] = '-';
          }
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {
          if(this.saturday[endIndex] == '-' || this.saturday[endIndex] == '@'){
            this.saturday[startIndex] = '@';
          }
          else {
            this.saturday[endIndex] = '-';
          }
          endIndex--;
        }
      } else {
        this.saturday[startIndex] = subjectCode;
        this.saturday[endIndex] = facultyName;
      }

      offset = 0;
      startIndex = 0;
      endIndex = 0;
      indexDifference = 0;
      startIndexCounter = 0;
      endIndexCounter = 0;
    });
  }

  checkSundayLoads() {

    const dateFromStr: any = (str:any) => new Date('1970/01/01 ' + str);
    this.sundayLoad.sort((a,b) => dateFromStr(a.startTime) - dateFromStr(b.startTime));

    this.sundayLoad.forEach((load) => {
      let startIndex = 0;
      let endIndex = 0;
      let indexDifference = 0;
      let startIndexCounter = 0;
      let endIndexCounter = 0;
      let subjectCode = '';
      let facultyName = '';
      if (load.startTime == '7:00 AM') {
        subjectCode = load.subjectCode;
        startIndex = startIndexCounter;
      }
      this.times.forEach((time) => {
        if (time.includes(load.startTime)) {
          subjectCode = load.subjectCode;
          startIndex = startIndexCounter + 1;
        }
        if (time.includes(load.endTime)) {
          let n = load.facultyName.split(' ');
          facultyName = n[n.length - 1];
          endIndex = endIndexCounter;
        }
        startIndexCounter++;
        endIndexCounter++;
      });

      let offset = 0;
      if (endIndex - startIndex != 1) {
        indexDifference = endIndex - startIndex;
        offset = Math.floor(indexDifference / 2);
        this.sunday[startIndex + offset] = subjectCode;
        this.sunday[endIndex - offset] = facultyName;

        for (let index = 0; index < offset; index++) {
          if(this.sunday[startIndex] == '-'  || this.sunday[endIndex] == '@'){
            this.sunday[startIndex] = '@';
          }else {
            this.sunday[startIndex] = '-';
          }
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {
          if(this.sunday[endIndex] == '-' || this.sunday[endIndex] == '@'){
            this.sunday[startIndex] = '@';
          }
          else {
            this.sunday[endIndex] = '-';
          }
          endIndex--;
        }
      } else {
        this.sunday[startIndex] = subjectCode;
        this.sunday[endIndex] = facultyName;
      }

      offset = 0;
      startIndex = 0;
      endIndex = 0;
      indexDifference = 0;
      startIndexCounter = 0;
      endIndexCounter = 0;
    });
  }

  fillDayArrays() {
    let count = 0;
    this.times.forEach((element) => {
      this.monday[count] = ' ';
      count++;
    });
    count = 0;
    this.times.forEach((element) => {
      this.tuesday[count] = ' ';
      count++;
    });
    count = 0;
    this.times.forEach((element) => {
      this.wednesday[count] = ' ';
      count++;
    });
    count = 0;
    this.times.forEach((element) => {
      this.thursday[count] = ' ';
      count++;
    });
    count = 0;
    this.times.forEach((element) => {
      this.friday[count] = ' ';
      count++;
    });
    count = 0;
    this.times.forEach((element) => {
      this.saturday[count] = ' ';
      count++;
    });
    count = 0;
    this.times.forEach((element) => {
      this.sunday[count] = ' ';
      count++;
    });
    count = 0;
  }

  getDays(currentSection: LoadItem[]) {
    this.allLoads = [];
    this.mondayLoad = currentSection.filter((load) => {
      return load.day == 'monday';
    });
    this.tuesdayLoad = currentSection.filter((load) => {
      return load.day == 'tuesday';
    });
    this.wednesdayLoad = currentSection.filter((load) => {
      return load.day == 'wednesday';
    });
    this.thursdayLoad = currentSection.filter((load) => {
      return load.day == 'thursday';
    });
    this.fridayLoad = currentSection.filter((load) => {
      return load.day == 'friday';
    });
    this.saturdayLoad = currentSection.filter((load) => {
      return load.day == 'saturday';
    });
    this.sundayLoad = currentSection.filter((load) => {
      return load.day == 'sunday';
    });

    this.mondayLoad.forEach(element => {
      this.allLoads.push(element)
    });
    this.tuesdayLoad.forEach(element => {
      this.allLoads.push(element)
    });
    this.wednesdayLoad.forEach(element => {
      this.allLoads.push(element)
    });
    this.thursdayLoad.forEach(element => {
      this.allLoads.push(element)
    });
    this.fridayLoad.forEach(element => {
      this.allLoads.push(element)
    });
    this.saturdayLoad.forEach(element => {
      this.allLoads.push(element)
    });
    this.sundayLoad.forEach(element => {
      this.allLoads.push(element)
    });

  }

  exportToPDF() {
    const DATA = this.content.nativeElement;
    let doc: jsPDF = new jsPDF('p', 'mm', [850, 850]);
    doc.canvas;
    doc.html(DATA, {
      callback: (doc) => {
        try {
          doc.save(`${this.currentSectionLoad[0].section}.pdf`);
        } catch {
          this.uiService.showErrorToast(
            'Please choose a section first!',
            'Error'
          );
        }
      },
    });
  }


  onOpenMondayFaculty(i: number){
    let facultyId = "";
    let facultyName = "";
    let faculty: Faculty;
    this.mondayLoad.forEach(element => {
      if(element.facultyName.includes(this.monday[i])){
        facultyName = element.facultyName;
      }
    });

    this.faculties.forEach(element => {
      if(element.fullName == facultyName){
        console.log(element);
        facultyId = element.id;
        faculty = element;

        this.loadService.fetchFacultyLoad(
          this.activeAcademic.startYear,
          this.activeAcademic.semester,
          this.currentChairperson.fullName,
          faculty.fullName)

        this.dialog.open(FacultySectionLoadComponent, {data: {
          activeFaculty: faculty
        }})
      }
    });

  }
  onOpenTuesdayFaculty(i: number){
    let facultyId = "";
    let facultyName = "";
    let faculty: Faculty;
    this.tuesdayLoad.forEach(element => {
      if(element.facultyName.includes(this.tuesday[i])){
        facultyName = element.facultyName;
      }
    });

    this.faculties.forEach(element => {
      if(element.fullName == facultyName){
        console.log(element);
        facultyId = element.id;
        faculty = element;

        this.loadService.fetchFacultyLoad(
          this.activeAcademic.startYear,
          this.activeAcademic.semester,
          this.currentChairperson.fullName,
          faculty.fullName)

        this.dialog.open(FacultySectionLoadComponent, {data: {
          activeFaculty: faculty
        }})
      }
    });
  }
  onOpenWednesdayFaculty(i: number){
    let facultyId = "";
    let facultyName = "";
    let faculty: Faculty;
    this.wednesdayLoad.forEach(element => {
      if(element.facultyName.includes(this.wednesday[i])){
        facultyName = element.facultyName;
      }
    });

    this.faculties.forEach(element => {
      if(element.fullName == facultyName){
        console.log(element);
        facultyId = element.id;
        faculty = element;

        this.loadService.fetchFacultyLoad(
          this.activeAcademic.startYear,
          this.activeAcademic.semester,
          this.currentChairperson.fullName,
          faculty.fullName)

        this.dialog.open(FacultySectionLoadComponent, {data: {
          activeFaculty: faculty
        }})
      }
    });
  }
  onOpenThursdayFaculty(i: number){
    let facultyId = "";
    let facultyName = "";
    let faculty: Faculty;
    this.thursdayLoad.forEach(element => {
      if(element.facultyName.includes(this.thursday[i])){
        facultyName = element.facultyName;
      }
    });

    this.faculties.forEach(element => {
      if(element.fullName == facultyName){
        console.log(element);
        facultyId = element.id;
        faculty = element;

        this.loadService.fetchFacultyLoad(
          this.activeAcademic.startYear,
          this.activeAcademic.semester,
          this.currentChairperson.fullName,
          faculty.fullName)

        this.dialog.open(FacultySectionLoadComponent, {data: {
          activeFaculty: faculty
        }})
      }
    });
  }
  onOpenFridayFaculty(i: number){
    let facultyId = "";
    let facultyName = "";
    let faculty: Faculty;
    this.fridayLoad.forEach(element => {
      if(element.facultyName.includes(this.friday[i])){
        facultyName = element.facultyName;
      }
    });

    this.faculties.forEach(element => {
      if(element.fullName == facultyName){
        console.log(element);
        facultyId = element.id;
        faculty = element;

        this.loadService.fetchFacultyLoad(
          this.activeAcademic.startYear,
          this.activeAcademic.semester,
          this.currentChairperson.fullName,
          faculty.fullName)

        this.dialog.open(FacultySectionLoadComponent, {data: {
          activeFaculty: faculty
        }})
      }
    });
  }
  onOpenSaturdayFaculty(i: number){
    let facultyId = "";
    let facultyName = "";
    let faculty: Faculty;
    this.saturdayLoad.forEach(element => {
      if(element.facultyName.includes(this.saturday[i])){
        facultyName = element.facultyName;
      }
    });

    this.faculties.forEach(element => {
      if(element.fullName == facultyName){
        console.log(element);
        facultyId = element.id;
        faculty = element;

        this.loadService.fetchFacultyLoad(
          this.activeAcademic.startYear,
          this.activeAcademic.semester,
          this.currentChairperson.fullName,
          faculty.fullName)

        this.dialog.open(FacultySectionLoadComponent, {data: {
          activeFaculty: faculty
        }})
      }
    });
  }
  onOpenSundayFaculty(i: number){
    let facultyId = "";
    let facultyName = "";
    let faculty: Faculty;
    this.sundayLoad.forEach(element => {
      if(element.facultyName.includes(this.sunday[i])){
        facultyName = element.facultyName;
      }
    });

    this.faculties.forEach(element => {
      if(element.fullName == facultyName){
        console.log(element);
        facultyId = element.id;
        faculty = element;

        this.loadService.fetchFacultyLoad(
          this.activeAcademic.startYear,
          this.activeAcademic.semester,
          this.currentChairperson.fullName,
          faculty.fullName)

        this.dialog.open(FacultySectionLoadComponent, {data: {
          activeFaculty: faculty
        }})
      }
    });
  }

  filter(value: string) {
    this.view = value;
  }

  ngOnDestroy(): void {
      this.sectionSubs.unsubscribe();
      this.academicSubs.unsubscribe();
  }
}
