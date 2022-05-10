import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadItem } from 'src/app/shared/models/load-item.model';
import { LoadService } from 'src/app/shared/services/load.service';
import jsPDF from 'jspdf';
import { UIService } from 'src/app/shared/UIService/ui.service';

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

  constructor(private loadService: LoadService, private uiService: UIService) {}

  ngOnInit(): void {
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
          this.monday[startIndex] = '-';
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {

          this.monday[endIndex] = '-';
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
          this.tuesday[startIndex] = '-';
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {

          this.tuesday[endIndex] = '-';
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
          this.wednesday[startIndex] = '-';
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {

          this.wednesday[endIndex] = '-';
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
          this.thursday[startIndex] = '-';
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {

          this.thursday[endIndex] = '-';
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
          this.friday[startIndex] = '-';
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {

          this.friday[endIndex] = '-';
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
          this.saturday[startIndex] = '-';
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {

          this.saturday[endIndex] = '-';
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
          this.sunday[startIndex] = '-';
          startIndex++;
        }
        for (let index = 0; index < offset; index++) {

          this.sunday[endIndex] = '-';
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
    console.log(this.allLoads);
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
    let doc: jsPDF = new jsPDF('p', 'mm', [730, 730]);
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

  filter(value: string) {
    this.view = value;
    // this.newCurriculum = this.unfilteredNewCurriculum;
    // if (value !== 'All') {
    //   this.dataSource.data = this.newCurriculum.filter(function (el) {
    //     return el.department === value;
    //   });
    // } else {
    //   this.newCurriculum = this.unfilteredNewCurriculum;
    //   this.dataSource.data = this.newCurriculum;
    // }
  }

  ngOnDestroy(): void {
      this.sectionSubs.unsubscribe();
  }
}
