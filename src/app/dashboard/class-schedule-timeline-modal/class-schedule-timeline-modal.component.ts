import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import { LoadItem } from 'src/app/shared/models/load-item.model';
import { NewLoad } from 'src/app/shared/models/new-load.model';
import { Section } from 'src/app/shared/models/section.model';
import { LoadService } from 'src/app/shared/services/load.service';
import { RoomSectionService } from 'src/app/shared/services/room-section.service';
import { UIService } from 'src/app/shared/UIService/ui.service';

@Component({
  selector: 'app-class-schedule-timeline-modal',
  templateUrl: './class-schedule-timeline-modal.component.html',
  styleUrls: ['./class-schedule-timeline-modal.component.css']
})
export class ClassScheduleTimelineModalComponent implements OnInit, OnDestroy {
  @ViewChild('content', { static: true }) content: ElementRef;
  loadSubs: Subscription;
  allLoadItems: LoadItem[] = [];
  loads: NewLoad[] = [];

  view = 'Class Schedule Timeline';
  sectionSubs: Subscription;
  sections: Section[] = [];
  trimmedSections: string[] = [];

  isLoading = true;
  constructor(private loadService: LoadService, @Inject(MAT_DIALOG_DATA) private passedData: any, private roomSectionService: RoomSectionService, private uiService: UIService) { }
  ngOnInit(): void {

    this.roomSectionService.fetchSections();
    this.sectionSubs = this.roomSectionService.sectionsChanged.subscribe(
      (sections) => {
        this.sections = sections;

        this.sections = this.sections.sort((a, b) => {
          return +a.section - +b.section;
        });
        this.sections = this.sections.sort((a, b) => {
          return +a.year - +b.year;
        });
        this.sections = this.sections.sort((a, b) => {
          if (a.course < b.course) {
            return -1;
          }
          if (a.course > b.course) {
            return 1;
          }
          return 0;
        });

        sections = sections.filter((section) => {
          return section.course == this.passedData.currentUser.department;
        });

        this.trimmedSections = [];
        sections.forEach((element) => {
          let str = element.course;
          let acronym = str
            .split(/\s/)
            .reduce((response, word) => (response += word.slice(0, 1)), '');
          this.trimmedSections.push(
            'BS' + acronym + ' ' + element.year + '-' + element.section
          );
        });

        this.loadService.fetchAllLoad(
          this.passedData.activeAcademicYear.startYear,
          this.passedData.activeAcademicYear.semester,
          this.passedData.currentUser.fullName);
      }

    );

  this.loadSubs = this.loadService.allLoadChange.subscribe(loadItems => {
    this.allLoadItems = loadItems;
    this.loads = [];

    this.trimmedSections.forEach(element => {
      console.log(element);
      let tempItem: LoadItem[] = [];
      loadItems.forEach(loadItemElement => {
        if(loadItemElement.section === element){
          tempItem.push(loadItemElement);
        }
      });
      this.loads.push({loadItem: tempItem});
      this.isLoading = false;
    });
  })
  }

  exportToPDF() {
    const DATA = this.content.nativeElement;
    let doc: jsPDF = new jsPDF('p', 'mm', [1000, 1000]);
    doc.canvas;
    doc.html(DATA, {
      callback: (doc) => {
        try {
          doc.save(`${this.passedData.currentUser.fullName}.pdf`);
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
  }

  ngOnDestroy(): void {
    this.loadSubs.unsubscribe();
}
}
