import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AcademicPeriod } from 'src/app/shared/models/academic-period.model';
import { Curriculum } from 'src/app/shared/models/curriculum.model';
import { Faculty } from 'src/app/shared/models/faculty.model';
import { LoadItem } from 'src/app/shared/models/load-item.model';
import { NewUser } from 'src/app/shared/models/new-user.model';
import { Room } from 'src/app/shared/models/room.model';
import { Section } from 'src/app/shared/models/section.model';
import { AcademicService } from 'src/app/shared/services/academic.service';
import { CurriculumService } from 'src/app/shared/services/curriculum.service';
import { FacultyService } from 'src/app/shared/services/faculty.service';
import { LoadService } from 'src/app/shared/services/load.service';
import { RoomSectionService } from 'src/app/shared/services/room-section.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UIService } from 'src/app/shared/UIService/ui.service';

@Component({
  selector: 'app-load-editor',
  templateUrl: './load-editor.component.html',
  styleUrls: ['./load-editor.component.css'],
})
export class LoadEditorComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() activeFaculty: Faculty;
  @ViewChild('search') searchInput: ElementRef;
  // viewMode = 'facultyMode';
  curriculums: Curriculum[] = [];
  departmentCurriculums: Curriculum[] = [];
  curriculumSubs: Subscription;
  displayedColumns = [
    'subjectCode',
    'subjectDescription',
    'units',
    'noHour',
    'section',
    'facultyName',
    'day',
    'startTime',
    'endTime',
    'room',
    'actions',
  ];
  dataSource = new MatTableDataSource<LoadItem>();

  loadForm: FormGroup;
  startTimeDisabled = true;

  subjectCodes: string[] = [];
  subjectDescriptions: string[] = [];
  days: string[] = [
    'monday',
    'tuesday',
    'wednesday',
    'tuesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
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

  activeAcademicYear: AcademicPeriod;
  currentChairperson: NewUser;

  loads: LoadItem[] = [];
  loadSubs: Subscription;

  onAddMode = false;;
  onEditMode = false;

  currentLoad: LoadItem;
  isAllowedToEdit = false;

  faculties: Faculty[] = [];

  facultySubs: Subscription;

  constructor(
    private curriculumService: CurriculumService,
    private roomSectionService: RoomSectionService,
    private loadService: LoadService,
    private academicService: AcademicService,
    private userService: UserService,
    private uiService: UIService,
    private facultyService: FacultyService
  ) {}

  ngOnInit(): void {

    this.currentChairperson = this.userService.getCurrentUser();
    let currentDate = new Date();
    let currentTimeStamp = currentDate.getTime() / 1000.0;

    if (
      +currentTimeStamp > +this.currentChairperson.startDate.seconds &&
      +currentTimeStamp < +this.currentChairperson.endDate.seconds
    ) {
      this.isAllowedToEdit = true;
    } else {
      this.isAllowedToEdit = false;
    }

    this.activeAcademicYear = this.academicService.getActiveAcademicYear();


    this.facultySubs = this.facultyService.facultyChanged.subscribe(
      (faculties) => {
        this.faculties = faculties;
      }
    );

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
            'BS' + acronym + ' ' + element.year + '-' + element.section
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
      units: new FormControl('', Validators.required),
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
    console.log(this.loadForm.value.units);

    this.loadService.fetchFacultyLoad(
      this.activeAcademicYear.startYear,
      this.activeAcademicYear.semester,
      this.currentChairperson.fullName,
      this.activeFaculty.fullName
      );

    this.loadSubs = this.loadService.facultyLoadChange.subscribe(loads => {
      this.loads = loads;
      this.dataSource.data = this.loads;
      this.loadService.changeCurrentFacultyLoad(this.loads);
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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

  onAddLoadMode(){
    this.onAddMode = true;
    this.onEditMode = false;
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
    this.onEditMode = false;
    this.onAddMode = false;
  }


  onStartTimeChange(event: any){
    let newNoHour = this.loadForm.value.noHour;
    for (let i = 0; i < this.times.length; i++) {
      if(event.value == this.times[i]){
        this.loadForm.patchValue({endTime: this.times[i + (newNoHour * 2)]})
      }
    }
  }

  // onChangeToggle(event: any) {
  //   this.viewMode = event.value;
  // }

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

  onDeleteLoad(loadId: string) {
    if(this.loads.length > 1){
      this.loadService.onRemoveLoad(loadId);
      this.onEditMode = false;
      this.onAddMode = false;
    }
    else {
      this.uiService.showErrorToast('You should have atleast 1 load!','Error')
    }
  }

  onEditLoad(load: LoadItem, target: HTMLElement) {
    this.onEditMode = true;
    this.onAddMode = false;

    if (this.isAllowedToEdit) {
      this.currentLoad = load;
      // const selectedFacultyName = this.faculties.find(
      //   (item) =>
      //     JSON.stringify(item.fullName) === JSON.stringify(load.facultyName)
      // );
      const selectedRoomName = this.rooms.find(
        (item) => JSON.stringify(item.roomName) === JSON.stringify(load.room)
      );
      console.log(load);
      this.loadForm.patchValue({ subjectCode: load.subjectCode });
      this.loadForm.patchValue({ subjectDescription: load.subjectDescription });
      this.loadForm.patchValue({ units: load.units });
      this.loadForm.patchValue({ noHour: load.noHour });
      this.loadForm.patchValue({ section: load.section });
      this.loadForm.patchValue({ day: load.day });
      this.loadForm.patchValue({ startTime: load.startTime });
      this.loadForm.patchValue({ endTime: load.endTime });
      this.loadForm.patchValue({ room: selectedRoomName });

      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.uiService.showWarningToast(
        'You are not allowed to edit yet, contact the administrator to ask permission.',
        'Warning'
      );
    }
  }

  onSplit(element: any){
    console.log(element);
    this.loadService.updateLoadToDatabase(
      {
        facultyName: element.facultyName,
        facultyId: element.facultyId,
        department: element.department,
        chairperson: element.chairperson,
        semester: element.semester,
        schoolYear: element.schoolYear,
        subjectCode: element.subjectCode,
        subjectDescription: element.subjectDescription,
        units: element.units,
        noHour: (+element.noHour/2).toString(),
        section: element.section,
        day: '',
        startTime: '',
        endTime: '',
        room: '',
      },
      element.id
    );

    this.loadService.addLoad({
      facultyName: element.facultyName,
      facultyId: element.facultyId,
      department: element.department,
      chairperson: element.chairperson,
      semester: element.semester,
      schoolYear: element.schoolYear,
      subjectCode: element.subjectCode,
      subjectDescription: element.subjectDescription,
      units: element.units,
      noHour: (+element.noHour/2).toString(),
      section: element.section,
      day: '',
      startTime: '',
      endTime: '',
      room: '',
    });

  }


  onSubmit(){
    if(this.onAddMode){
      this.loadService.addLoad({
        facultyName: this.activeFaculty.fullName,
        facultyId: this.activeFaculty.id,
        department: this.currentChairperson.department,
        chairperson: this.currentChairperson.fullName,
        semester: this.activeAcademicYear.semester,
        schoolYear: this.activeAcademicYear.startYear,
        subjectCode: this.loadForm.value.subjectCode,
        subjectDescription: this.loadForm.value.subjectDescription,
        units: this.loadForm.value.units,
        noHour: this.loadForm.value.noHour,
        section: this.loadForm.value.section,
        day: this.loadForm.value.day,
        startTime: this.loadForm.value.startTime,
        endTime: this.loadForm.value.endTime,
        room: this.loadForm.value.room.roomName,
      })
      this.loadForm.reset();
      this.onEditMode = false;
      this.onAddMode = false;
    }
    else {
      if (this.currentLoad.id != '') {
        this.loadService.updateLoadToDatabase(
          {
            facultyName: this.activeFaculty.fullName,
            facultyId: this.activeFaculty.id,
            department: this.currentLoad.department,
            chairperson: this.currentLoad.chairperson,
            semester: this.currentLoad.semester,
            schoolYear: this.currentLoad.schoolYear,
            subjectCode: this.loadForm.value.subjectCode,
            subjectDescription: this.loadForm.value.subjectDescription,
            units: this.loadForm.value.units,
            noHour: this.loadForm.value.noHour,
            section: this.loadForm.value.section,
            day: this.loadForm.value.day,
            startTime: this.loadForm.value.startTime,
            endTime: this.loadForm.value.endTime,
            room: this.loadForm.value.room.roomName,
          },
          this.currentLoad.id
        );
        this.loadForm.reset();
        this.onEditMode = false;
        this.onAddMode = false;
      } else {
        this.uiService.showErrorToast(
          'Cannot Add new Load, please select a load to Edit!',
          'Error'
        );
      }
    }

  }

  ngOnDestroy(): void {
    this.curriculumSubs.unsubscribe();
    this.sectionSubs.unsubscribe();
    this.roomsSubs.unsubscribe();
    this.facultySubs.unsubscribe();
    this.loadSubs.unsubscribe();
  }
}
