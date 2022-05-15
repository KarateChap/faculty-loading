import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import { Faculty } from 'src/app/shared/models/faculty.model';
import { LoadItem } from 'src/app/shared/models/load-item.model';
import { NewLoad } from 'src/app/shared/models/new-load.model';
import { Section } from 'src/app/shared/models/section.model';
import { UserLoad } from 'src/app/shared/models/user-load';
import { FacultyService } from 'src/app/shared/services/faculty.service';
import { LoadService } from 'src/app/shared/services/load.service';
import { RoomSectionService } from 'src/app/shared/services/room-section.service';
import { UIService } from 'src/app/shared/UIService/ui.service';

@Component({
  selector: 'app-view-loads',
  templateUrl: './view-loads.component.html',
  styleUrls: ['./view-loads.component.css']
})
export class ViewLoadsComponent implements OnInit, OnDestroy{
  @ViewChild('content', { static: true }) content: ElementRef;
  view = 'Class Schedule Timeline';

  sectionSubs: Subscription;
  sections: Section[] = [];
  trimmedSections: string[] = [];

  faculties: Faculty[] = [];
  facultySubs: Subscription;

  loadItems: LoadItem[] = [];
  userLoads: UserLoad;
  classScheduleLoad: NewLoad[] = [];
  facultyLoad: NewLoad[] = [];

  isLoading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private passedData: any,
    private facultyService: FacultyService,
    private uiService: UIService,
    private roomSectionService: RoomSectionService
  ) { }

  ngOnInit(): void {
    this.userLoads = this.passedData.userLoad;
    this.loadItems = this.userLoads.loadItem;

    //section
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
          return section.course == this.userLoads.department;
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


        this.classScheduleLoad = [];

        this.trimmedSections.forEach(element => {

          let tempItem: LoadItem[] = [];
          this.loadItems.forEach(loadItemElement => {
            if(loadItemElement.section === element){
              tempItem.push(loadItemElement);
            }
          });
          this.classScheduleLoad.push({loadItem: tempItem});
        });
        console.log(this.classScheduleLoad);
        this.isLoading = false;
      }
    );
    //faculty

    this.facultyService.fetchFaculty(
      this.userLoads.year,
      this.userLoads.semester,
      this.userLoads.chairpersonName
    );

    this.facultySubs = this.facultyService.facultyChanged.subscribe(
      (faculties) => {
        this.faculties = faculties;

        this.facultyLoad = [];

        this.faculties.forEach(element => {
          let tempItem: LoadItem[] = [];
          this.loadItems.forEach(loadItemElement => {
            if(loadItemElement.facultyId === element.id){
              tempItem.push(loadItemElement);
            }
          });
          this.facultyLoad.push({loadItem: tempItem});
        });

        console.log(this.facultyLoad);
      }
    );
  }

  filter(value: string) {
    this.view = value;
  }

  exportToPDF() {
    const DATA = this.content.nativeElement;
    let doc: jsPDF = new jsPDF('p', 'mm', [1000, 1000]);
    doc.canvas;
    doc.html(DATA, {
      callback: (doc) => {
        try {
          doc.save(`${this.userLoads.chairpersonName}.pdf`);
        } catch {
          this.uiService.showErrorToast(
            'Please choose a section first!',
            'Error'
          );
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.sectionSubs.unsubscribe();
    this.facultySubs.unsubscribe();
}

}
