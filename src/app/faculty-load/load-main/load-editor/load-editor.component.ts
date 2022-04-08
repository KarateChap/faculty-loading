import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Curriculum } from 'src/app/shared/models/curriculum.model';
import { Faculty } from 'src/app/shared/models/faculty.model';
import { Room } from 'src/app/shared/models/room.model';
import { Section } from 'src/app/shared/models/section.model';
import { CurriculumService } from 'src/app/shared/services/curriculum.service';
import { RoomSectionService } from 'src/app/shared/services/room-section.service';

@Component({
  selector: 'app-load-editor',
  templateUrl: './load-editor.component.html',
  styleUrls: ['./load-editor.component.css'],
})
export class LoadEditorComponent implements OnInit, OnDestroy {
  @Input() activeFaculty: Faculty;
  @ViewChild('search') searchInput: ElementRef;
  viewMode = 'facultyMode';
  curriculums: Curriculum[] = [];
  departmentCurriculums: Curriculum[] = [];
  curriculumSubs: Subscription;
  displayedColumns = [
    'code',
    'subjectTitle',
    'units',
    'preReq',
    'subjectSemester',
    'subjectYear',
    'department',
  ];
  dataSource = new MatTableDataSource<void>();

  loadForm: FormGroup;
  startTimeDisabled = true;

  subjectCodes: string[] = [];
  subjectDescriptions: string[] = [];
  days: string[] = [];
  sections: Section[] = [];
  sectionSubs: Subscription;
  roomsSubs: Subscription;
  rooms: Room[] = [];

  trimmedSections: string[] = [];
  times: string[] = [
    '7:00 AM',
    '7:30 AM',
    '8:00 AM',
    '8:30 AM',
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM',
    '5:00 PM',
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
  ];

  onSearching = false;
  filteredCurriculums: Curriculum[] = [];

  constructor(
    private curriculumService: CurriculumService,
    private roomSectionService: RoomSectionService
  ) {}

  ngOnInit(): void {
    this.activeFaculty.facultySchedule.forEach((element) => {
      this.days.push(element.day);
    });

    this.roomSectionService.fetchRooms();
    this.roomsSubs = this.roomSectionService.roomsChanged.subscribe((rooms) => {
      this.rooms = rooms;
      this.rooms = this.rooms.sort((a, b) => {
        if (a.roomName < b.roomName) {
          return -1;
        }
        if (a.roomName > b.roomName) {
          return 1;
        }
        return 0;
      });
    });

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

        this.trimmedSections = [];
        sections.forEach((element) => {
          let str = element.course;
          let acronym = str
            .split(/\s/)
            .reduce((response, word) => (response += word.slice(0, 1)), '');
          this.trimmedSections.push(
            acronym + ' ' + element.year + '-' + element.section
          );
        });
      }
    );

    this.curriculumService.fetchAllCurriculum();
    this.curriculumSubs =
      this.curriculumService.fetchCurriculumChanged.subscribe((curriculums) => {
        this.curriculums = curriculums;
        this.departmentCurriculums = this.curriculums.filter(
          (deptCurriculum) => {
            return deptCurriculum.department == this.activeFaculty.department;
          }
        );

        this.subjectCodes = [];
        this.subjectDescriptions = [];
        this.departmentCurriculums.forEach((element) => {
          this.subjectCodes.push(element.code);
          this.subjectDescriptions.push(element.subjectTitle);
        });
      });

    this.loadForm = new FormGroup({
      subjectCode: new FormControl({ value: '' }, Validators.required),
      subjectDescription: new FormControl({ value: '' }, Validators.required),
      units: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      noHour: new FormControl('', {
        validators: [
          Validators.pattern(/^[0-9]*$/),
          Validators.maxLength(1),
          Validators.required,
        ],
      }),
      section: new FormControl('', Validators.required),
      day: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl(
       '',
        Validators.required
      ),
      room: new FormControl('', Validators.required),
    });
  }

  onChangeHours(event: any) {
    if (this.loadForm.value.noHour == '') {
      this.startTimeDisabled = true;
    } else {
      this.startTimeDisabled = false;
    }

    if(this.loadForm.value.startTime){
      let newNoHour = this.loadForm.value.noHour;
      for (let i = 0; i < this.times.length; i++) {
        if(this.loadForm.value.startTime == this.times[i]){
          this.loadForm.patchValue({endTime: this.times[i + (newNoHour * 2)]})
        }
      }
    }
  }

  onChipClicked(i: number){
    this.subjectCodes.push(this.filteredCurriculums[i].code);
    this.subjectDescriptions.push(this.filteredCurriculums[i].subjectTitle);

    this.loadForm.patchValue({
      subjectCode: this.filteredCurriculums[i].code,
      subjectDescription: this.filteredCurriculums[i].subjectTitle,
      units: this.filteredCurriculums[i].units,
    });

    this.searchInput.nativeElement.value = '';
    this.onSearching = false;
  }


  doFilter(filterValue: string) {
    if(filterValue == ''){
      this.onSearching = false;
    }
    else {
      this.filteredCurriculums = [];
        this.filteredCurriculums = this.curriculums.filter(value => {
        let searchStr = filterValue.toLowerCase();
        let nameMatches = value.subjectTitle.toLowerCase().includes(searchStr);

        return nameMatches;
      });
      if(this.filteredCurriculums.length > 3){
        this.filteredCurriculums = this.filteredCurriculums.slice(0, 2);
      }
      this.onSearching = true;
    }
  }
  onClear(){
    this.loadForm.reset();
  }


  onStartTimeChange(event: any){
    let newNoHour = this.loadForm.value.noHour;
    for (let i = 0; i < this.times.length; i++) {
      if(event.value == this.times[i]){
        this.loadForm.patchValue({endTime: this.times[i + (newNoHour * 2)]})
      }
    }
  }

  onChangeToggle(event: any) {
    this.viewMode = event.value;
  }

  onCodeChange(event: any) {
    let codeValue = event.value;
    this.departmentCurriculums.forEach((element) => {
      if (element.code == codeValue) {
        this.loadForm.patchValue({
          subjectDescription: element.subjectTitle,
          units: element.units,
        });
      }
    });
  }
  onSubjectChange(event: any) {
    let subjectValue = event.value;
    this.departmentCurriculums.forEach((element) => {
      if (element.subjectTitle == subjectValue) {
        this.loadForm.patchValue({
          subjectCode: element.code,
          units: element.units,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.curriculumSubs.unsubscribe();
    this.sectionSubs.unsubscribe();
    this.roomsSubs.unsubscribe();
  }
}
