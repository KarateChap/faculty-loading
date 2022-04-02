import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Section } from 'src/app/shared/models/section.model';
import { RoomSectionService } from 'src/app/shared/services/room-section.service';
import { UIService } from 'src/app/shared/UIService/ui.service';

@Component({
  selector: 'app-section-config',
  templateUrl: './section-config.component.html',
  styleUrls: ['./section-config.component.css'],
})
export class SectionConfigComponent implements OnInit, OnDestroy {
  configType = 'add';
  sectionName = '';
  sectionInvalid = false;
  sectionForm: FormGroup;

  sections: Section[] = [];
  sectionsSubs: Subscription;
  constructor(
    @Inject(MAT_DIALOG_DATA) private passedData: any,
    private rsService: RoomSectionService,
    private uiService: UIService
  ) {}

  ngOnInit(): void {
    this.configType = this.passedData.configType;
    this.rsService.fetchSections();
    this.sectionsSubs = this.rsService.sectionsChanged.subscribe((sections) => {
      this.sections = sections;
    });

    if (this.configType == 'add') {
      this.sectionForm = new FormGroup({
        course: new FormControl('', Validators.required),
        year: new FormControl('', {
          validators: [
            Validators.required,
            Validators.pattern(/^[0-9]*$/),
            Validators.maxLength(1),
          ],
        }),
        section: new FormControl('', {
          validators: [
            Validators.required,
            Validators.pattern(/^[0-9]*$/),
            Validators.maxLength(1),
          ],
        }),
      });
    } else {
      this.sectionForm = new FormGroup({
        course: new FormControl(
          this.passedData.section.course,
          Validators.required
        ),
        year: new FormControl(this.passedData.section.year, {
          validators: [
            Validators.required,
            Validators.pattern(/^[0-9]*$/),
            Validators.maxLength(1),
          ],
        }),
        section: new FormControl(this.passedData.section.section, {
          validators: [
            Validators.required,
            Validators.pattern(/^[0-9]*$/),
            Validators.maxLength(1),
          ],
        }),
      });
    }
  }

  onSubmit() {
    this.checkError();

    if (this.sectionInvalid) {
      this.uiService.showErrorToast(
        'Cannot add/edit already existing section!',
        'Error'
      );
    } else {
      if (this.configType == 'add') {
        this.rsService.addSectionToDatabase({
          course: this.sectionForm.value.course,
          year: this.sectionForm.value.year,
          section: this.sectionForm.value.section,
        });
      } else {
        this.rsService.updateSectionToDatabase(
          {
            course: this.sectionForm.value.course,
            year: this.sectionForm.value.year,
            section: this.sectionForm.value.section,
          },
          this.passedData.section.id
        );
      }
      this.sectionInvalid = false;
    }
  }

  checkError() {
    let elementString: string[] = [];

    let inputString =
      this.sectionForm.value.course +
      this.sectionForm.value.year +
      this.sectionForm.value.section;

    this.sections.forEach((element) => {
      elementString.push(element.course + element.year + element.section);
    });

    elementString.forEach((element) => {
      if (element == inputString) {
        this.sectionInvalid = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.sectionsSubs.unsubscribe();
  }
}
