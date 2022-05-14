import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import { Faculty } from 'src/app/shared/models/faculty.model';
import { LoadItem } from 'src/app/shared/models/load-item.model';
import { NewLoad } from 'src/app/shared/models/new-load.model';
import { FacultyService } from 'src/app/shared/services/faculty.service';
import { LoadService } from 'src/app/shared/services/load.service';
import { UIService } from 'src/app/shared/UIService/ui.service';

@Component({
  selector: 'app-faculty-load-timeline-modal',
  templateUrl: './faculty-load-timeline-modal.component.html',
  styleUrls: ['./faculty-load-timeline-modal.component.css']
})
export class FacultyLoadTimelineModalComponent implements OnInit, OnDestroy {
  @ViewChild('content', { static: true }) content: ElementRef;
  loadSubs: Subscription;
  allLoadItems: LoadItem[] = [];
  loads: NewLoad[] = [];

  view = 'Faculty Load Timeline';
  faculties: Faculty[] = [];
  facultySubs: Subscription;
  trimmedSections: string[] = [];
  isLoading = true;
  constructor(private loadService: LoadService, @Inject(MAT_DIALOG_DATA) private passedData: any, private facultyService: FacultyService, private uiService: UIService) { }

  ngOnInit(): void {

    this.facultyService.fetchFaculty(
      this.passedData.activeAcademicYear.startYear,
      this.passedData.activeAcademicYear.semester,
      this.passedData.currentUser.fullName
    );

    this.facultySubs = this.facultyService.facultyChanged.subscribe(
      (faculties) => {
        this.faculties = faculties;
        this.loadService.fetchAllLoad(
          this.passedData.activeAcademicYear.startYear,
          this.passedData.activeAcademicYear.semester,
          this.passedData.currentUser.fullName);
      }
    );
      this.loadSubs = this.loadService.allLoadChange.subscribe(loadItems => {
        this.loads = [];
        this.allLoadItems = loadItems;

        this.faculties.forEach(element => {
          let tempItem: LoadItem[] = [];
          loadItems.forEach(loadItemElement => {
            if(loadItemElement.facultyId === element.id){
              tempItem.push(loadItemElement);
            }
          });
          this.loads.push({loadItem: tempItem});
        });
        this.isLoading = false;
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
