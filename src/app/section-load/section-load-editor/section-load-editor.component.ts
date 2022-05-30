import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription} from 'rxjs';
import { take } from 'rxjs/operators';
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
  selector: 'app-section-load-editor',
  templateUrl: './section-load-editor.component.html',
  styleUrls: ['./section-load-editor.component.css'],
})
export class SectionLoadEditorComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('search') searchInput: ElementRef;
  // @ViewChild('target') target: HTMLElement;
  // viewMode = 'facultyMode';
  curriculums: Curriculum[] = [];
  departmentCurriculums: Curriculum[] = [];
  curriculumSubs: Subscription;
  onEditMode = false;
  onAddMode = false;

  totalUnits = 0;

  currentFacultyLoad: LoadItem[] = [];
  currentFacultySubs: Subscription;
  // onSingleDelete = true;

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
  // startTimeDisabled = true;

  subjectCodes: string[] = [];
  subjectDescriptions: string[] = [];
  days: string[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  availableDays = [
    {day: 'monday', conflict: 'conflict'},
    {day: 'tuesday', conflict: 'conflict'},
    {day: 'wednesday', conflict: 'conflict'},
    {day: 'thursday', conflict: 'conflict'},
    {day: 'friday', conflict: 'conflict'},
    {day: 'saturday', conflict: 'conflict'},
    {day: 'sunday', conflict: 'conflict'},
  ]

  sections: Section[] = [];
  section: string = '';
  faculties: Faculty[] = [];
  facultySubs: Subscription;
  sectionSubs: Subscription;
  activeAcademicYear: AcademicPeriod;
  roomsSubs: Subscription;
  rooms: Room[] = [];
  currentChairperson: NewUser;
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



  availableTimes = [
    {time: '7:00 AM', conflict: 'conflict'},
    {time: '7:30 AM', conflict: 'conflict'},
    {time: '8:00 AM', conflict: 'conflict'},
    {time: '8:30 AM', conflict: 'conflict'},
    {time: '9:00 AM', conflict: 'conflict'},
    {time: '9:30 AM', conflict: 'conflict'},
    {time: '10:00 AM', conflict: 'conflict'},
    {time: '10:30 AM', conflict: 'conflict'},
    {time: '11:00 AM', conflict: 'conflict'},
    {time: '11:30 AM', conflict: 'conflict'},
    {time: '12:00 PM', conflict: 'conflict'},
    {time: '12:30 PM', conflict: 'conflict'},
    {time: '1:00 PM', conflict: 'conflict'},
    {time: '1:30 PM', conflict: 'conflict'},
    {time: '2:00 PM', conflict: 'conflict'},
    {time: '2:30 PM', conflict: 'conflict'},
    {time: '3:00 PM', conflict: 'conflict'},
    {time: '3:30 PM', conflict: 'conflict'},
    {time: '4:00 PM', conflict: 'conflict'},
    {time: '4:30 PM', conflict: 'conflict'},
    {time: '5:00 PM', conflict: 'conflict'},
    {time: '5:30 PM', conflict: 'conflict'},
    {time: '6:00 PM', conflict: 'conflict'},
    {time: '6:30 PM', conflict: 'conflict'},
    {time: '7:00 PM', conflict: 'conflict'},
    {time: '7:30 PM', conflict: 'conflict'},
    {time: '8:00 PM', conflict: 'conflict'},
    {time: '8:30 PM', conflict: 'conflict'},
  ]

  onSearching = false;
  filteredCurriculums: Curriculum[] = [];

  loads: LoadItem[] = [];
  loadSubs: Subscription;

  sectionCurriculums: Curriculum[] = [];
  secCurSubs: Subscription;

  currentLoad: LoadItem;

  isAllowedToEdit = false;


  roomStartTime = '';
  roomEndTime = '';
  roomLoad: LoadItem[] = [];
  roomLoadSubs: Subscription;


  constructor(
    private curriculumService: CurriculumService,
    private roomSectionService: RoomSectionService,
    private userService: UserService,
    private facultyService: FacultyService,
    private academicService: AcademicService,
    private loadService: LoadService,
    private uiService: UIService,
    private snackBar: MatSnackBar,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // this.dataSource.data = [
    //   {
    //     id: 'hehe',
    //     facultyName: 'hehe',
    //     facultyId: 'hehe',
    //     department: 'hehe',
    //     chairperson: 'hehe',
    //     chairpersonId: 'hehe',
    //     semester: 'hehe',
    //     schoolYear: 'hehe',
    //     subjectCode: 'hehe',
    //     subjectDescription: 'hehe',
    //     units: '3',
    //     noHour: '3',
    //     section: 'hehe',
    //     day: 'hehe',
    //     startTime: 'hehe',
    //     endTime: 'hehe',
    //     room: 'hehe',
    //   },
    // ];

    this.currentChairperson = this.userService.getCurrentUser();
    let currentDate = new Date();
    let currentTimeStamp = currentDate.getTime() / 1000.0;

    if(this.currentChairperson.startDate){
      if (
        +currentTimeStamp > +this.currentChairperson.startDate.seconds &&
        +currentTimeStamp < +this.currentChairperson.endDate.seconds
      ) {
        this.isAllowedToEdit = true;
      } else {
        this.isAllowedToEdit = false;
      }
    }


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

    this.activeAcademicYear = this.academicService.getActiveAcademicYear();
    this.academicService.fetchActiveAcademicYear();

    this.facultyService.fetchFaculty(
      this.activeAcademicYear.startYear,
      this.activeAcademicYear.semester,
      this.currentChairperson.fullName
    );

    this.facultySubs = this.facultyService.facultyChanged.subscribe(
      (faculties) => {
        this.faculties = faculties;
      }
    );

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
          return section.course == this.currentChairperson.department;
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
            return (
              deptCurriculum.department == this.currentChairperson.department
            );
          }
        );

        this.subjectCodes = [];
        this.subjectDescriptions = [];
        this.departmentCurriculums.forEach((element) => {
          this.subjectCodes.push(element.code);
          this.subjectDescriptions.push(element.subjectTitle);
        });
      });

    // load specifics


      this.loadSubs = this.loadService.loadChange.subscribe((loads) => {
        this.loads = loads;
        if (loads.length == 0) {
          // if(this.onSingleDelete){
            // console.log(this.onSingleDelete);
            this.autoCreateLoad();
          // }
        } else {
          this.dataSource.data = loads;
          this.loadService.changeCurrentSectionLoad(this.loads);
        }
      });


    this.secCurSubs = this.curriculumService.sectionCurriculumChanged.subscribe(sectionCurriculums => {
        this.sectionCurriculums = sectionCurriculums;
      }
    );
    this.initializeForm();


    this.roomLoadSubs = this.loadService.sameRoomLoadChange.subscribe(roomLoad =>{
      this.roomLoad = roomLoad;

      this.roomStartTime = this.loadForm.value.startTime;
      this.roomEndTime = this.loadForm.value.endTime;
      // console.log(this.roomLoad);

      let startTimeIndex = 0;
      let endTimeIndex = 0;
      let counter1 = 0;
      let counter2 = 0;

      this.roomLoad.forEach(element => {

      let roomLoadTimes = [
          {time: '7:00 AM', isFilled: 'no'},
          {time: '7:30 AM', isFilled: 'no'},
          {time: '8:00 AM', isFilled: 'no'},
          {time: '8:30 AM', isFilled: 'no'},
          {time: '9:00 AM', isFilled: 'no'},
          {time: '9:30 AM', isFilled: 'no'},
          {time: '10:00 AM', isFilled: 'no'},
          {time: '10:30 AM', isFilled: 'no'},
          {time: '11:00 AM', isFilled: 'no'},
          {time: '11:30 AM', isFilled: 'no'},
          {time: '12:00 PM', isFilled: 'no'},
          {time: '12:30 PM', isFilled: 'no'},
          {time: '1:00 PM', isFilled: 'no'},
          {time: '1:30 PM', isFilled: 'no'},
          {time: '2:00 PM', isFilled: 'no'},
          {time: '2:30 PM', isFilled: 'no'},
          {time: '3:00 PM', isFilled: 'no'},
          {time: '3:30 PM', isFilled: 'no'},
          {time: '4:00 PM', isFilled: 'no'},
          {time: '4:30 PM', isFilled: 'no'},
          {time: '5:00 PM', isFilled: 'no'},
          {time: '5:30 PM', isFilled: 'no'},
          {time: '6:00 PM', isFilled: 'no'},
          {time: '6:30 PM', isFilled: 'no'},
          {time: '7:00 PM', isFilled: 'no'},
          {time: '7:30 PM', isFilled: 'no'},
          {time: '8:00 PM', isFilled: 'no'},
          {time: '8:30 PM', isFilled: 'no'}
        ]

        // console.log(element);

        // roomLoadTimes.forEach(time =>{
        //   if(element.startTime == time.time){
        //     time.isFilled = 'yes';
        //     startTimeIndex = counter;
        //     // console.log(time);
        //   }

        //   if(element.endTime == time.time){
        //     time.isFilled = 'yes';
        //     endTimeIndex = counter;
        //     // console.log(time);
        //   }
        //   counter += 1;
        // })
        // counter = 0;

        for (let index = 0; index < roomLoadTimes.length; index++) {
          if(element.startTime == roomLoadTimes[index].time){
            roomLoadTimes[index + 1].isFilled = 'yes';
            startTimeIndex = counter1 + 1;
            // console.log(time);
          }

          if(element.endTime == roomLoadTimes[index].time){
            roomLoadTimes[index - 1].isFilled = 'yes';
            endTimeIndex = counter2 - 1;
            // console.log(time);
          }
          counter1 += 1;
          counter2 += 1;
        }
        counter1 = 0;
        counter2 = 0;

        for (let index = startTimeIndex; index < endTimeIndex; index++) {
          roomLoadTimes[index].isFilled = 'yes';
        }

        // console.log(roomLoadTimes);

        console.log(element);
        roomLoadTimes.forEach(element2 => {

          if(element.subjectCode == this.loadForm.value.subjectCode && element.section == this.section){

          }
          else if(element2.time == this.roomStartTime || element2.time == this.roomEndTime){
            if(element2.isFilled == 'yes'){

              this.toastr.error('Your chosen Room: '
              + element.room + ' (' + element.day + ')' + ' for ' + this.section + ' with the time: ' + this.loadForm.value.startTime + ' - ' + this.loadForm.value.endTime + ' has a conflict with ' +
              (element.department == this.currentChairperson.department ? 'your own schedule for ' : (element.chairperson + "'s schedule for ")) + element.section + " with the time: " + element.startTime + ' - ' + element.endTime, "", {

                disableTimeOut: true,
                positionClass: 'toast-bottom-left',
              });

              // this.snackBar.open('Conflict Detected! Your chosen Room: '
              // + element.room + ' (' + element.day + ')' + ' for ' + this.section + ' with the time: ' + this.loadForm.value.startTime + ' - ' + this.loadForm.value.endTime + ' has a conflict with ' +
              // (element.department == this.currentChairperson.department ? 'your own schedule for ' : (element.chairperson + "'s schedule for ")) + element.section + " with the time: " + element.startTime + ' - ' + element.endTime,
              // 'close', {panelClass: ['red-snackbar']});
            }
          }
          else if (element.startTime == this.loadForm.value.startTime || element.endTime == this.loadForm.value.endtime){
            // this.snackBar.open('Conflict Detected! Your chosen Room: '
            // + element.room + ' (' + element.day + ')' + ' for ' + this.section + ' with the time: ' + this.loadForm.value.startTime + ' - ' + this.loadForm.value.endTime + ' has a conflict with ' +
            // (element.department == this.currentChairperson.department ? 'your own schedule for ' : (element.chairperson + "'s schedule for ")) + element.section + " with the time: " + element.startTime + ' - ' + element.endTime,
            // 'close', {panelClass: ['red-snackbar']});


            this.toastr.error('Your chosen Room: '
            + element.room + ' (' + element.day + ')' + ' for ' + this.section + ' with the time: ' + this.loadForm.value.startTime + ' - ' + this.loadForm.value.endTime + ' has a conflict with ' +
            (element.department == this.currentChairperson.department ? 'your own schedule for ' : (element.chairperson + "'s schedule for ")) + element.section + " with the time: " + element.startTime + ' - ' + element.endTime, "", {

              disableTimeOut: true,
              positionClass: 'toast-bottom-left',
            });
          }
        });

      });

    })


    this.currentFacultySubs = this.loadService.facultyLoadChange.subscribe(faculty => {
      this.totalUnits = 0;

        this.currentFacultyLoad = faculty;
        console.log(this.currentFacultyLoad);


        let uniqueLoads = this.currentFacultyLoad.filter((e, i) => {
          return this.currentFacultyLoad.findIndex((x) => {
            return x.subjectCode == e.subjectCode && x.section == e.section;
          }) == i;
        })

        uniqueLoads.forEach((element) => {
          this.totalUnits += +element.units;
          if(this.totalUnits > 20){
            this.toastr.error('The Total Units for ' + element.facultyName + ' Exceeded 20!',"", {

              disableTimeOut: true,
              positionClass: 'toast-bottom-left',
            });
          }
        });


    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  initializeForm() {
    this.loadForm = new FormGroup({
      subjectCode: new FormControl({ value: '' }, Validators.required),
      subjectDescription: new FormControl({ value: '' }, Validators.required),
      units: new FormControl({ value: '' }, Validators.required),
      noHour: new FormControl('', {
        validators: [
          Validators.pattern(/^[0-9]*$/),
          Validators.maxLength(1),
          Validators.required,
        ],
      }),
      faculty: new FormControl('', Validators.required),
      day: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', Validators.required),
      room: new FormControl('', Validators.required),
    });
  }

  async autoCreateLoad() {
    console.log("sectionCurriculums")
    console.log(this.sectionCurriculums);
    await this.sectionCurriculums.forEach((element) => {
      this.loadService.addLoad({
        facultyName: '',
        facultyId: '',
        department: this.currentChairperson.department,
        chairperson: this.currentChairperson.fullName,
        semester: this.activeAcademicYear.semester,
        schoolYear: this.activeAcademicYear.startYear,
        subjectCode: element.code,
        subjectDescription: element.subjectTitle,
        units: element.units,
        noHour: '',
        section: this.section,
        day: '',
        startTime: '',
        endTime: '',
        room: '',
      });
      // this.onSingleDelete = true;
    });
  }



  onChangeHours(event: any) {
    // if (this.loadForm.value.noHour == '') {
    //   this.startTimeDisabled = true;
    // } else {
    //   this.startTimeDisabled = false;
    // }

    if (this.loadForm.value.startTime) {
      let newNoHour = this.loadForm.value.noHour;
      for (let i = 0; i < this.times.length; i++) {
        if (this.loadForm.value.startTime == this.times[i]) {
          this.loadForm.patchValue({ endTime: this.times[i + newNoHour * 2] });
        }
      }
    }
  }

  onChipClicked(i: number) {
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
    if (filterValue == '') {
      this.onSearching = false;
    } else {
      this.filteredCurriculums = [];
      this.filteredCurriculums = this.curriculums.filter((value) => {
        let searchStr = filterValue.toLowerCase();
        let nameMatches = value.subjectTitle.toLowerCase().includes(searchStr);

        return nameMatches;
      });
      if (this.filteredCurriculums.length > 3) {
        this.filteredCurriculums = this.filteredCurriculums.slice(0, 2);
      }
      this.onSearching = true;
    }
  }
  onClear() {
    this.loadForm.reset();
    this.onEditMode = false;
    this.onAddMode = false;
  }

  onStartTimeChange(event: any) {
    if(this.loadForm.value.room){
      this.loadService.checkRoomLoadConflict(this.loadForm.value.room.roomName, this.activeAcademicYear.semester, this.activeAcademicYear.startYear, this.loadForm.value.day);
    }


    let newNoHour = this.loadForm.value.noHour;
    for (let i = 0; i < this.times.length; i++) {
      if (event.value == this.times[i]) {
        this.loadForm.patchValue({ endTime: this.times[i + newNoHour * 2] });
      }
    }

    this.availableTimes.forEach(element => {
      if(element.time == event.value){
        if(element.conflict == 'conflict'){

          this.toastr.error('Your chosen time: ' + event.value.toUpperCase() +' is not listed in ' + this.loadForm.value.faculty.fullName + "'s time schedule", "", {

              disableTimeOut: true,
              positionClass: 'toast-bottom-left',
            });

          // this.snackBar.open('Conflict Detected! Your chosen time: ' + event.value.toUpperCase() +' is not listed in ' + this.loadForm.value.faculty.fullName + "'s time schedule", 'close', {panelClass: ['red-snackbar']});
        }
      }
    });
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

  onFacultyChanged(event: any){

    this.availableDays.forEach(element => {
      element.conflict ="conflict";
    });

    let activeFaculty = event.value;

    this.availableDays.forEach(days => {
      activeFaculty.facultySchedule.forEach((element: any) => {
        if(days.day == element.day){
          days.conflict = 'noConflict'
        }
      });
    });


    let activeDay: any;
    let activeStartTime;
    let activeEndTime;

    this.availableTimes.forEach(element => {
      element.conflict = "conflict";
    })

    if(this.loadForm.value.day){
      activeFaculty.facultySchedule.forEach((element: any) => {
        if(this.loadForm.value.day == element.day){
          activeDay = element;
          console.log(activeDay);




          let counter = 0;
          let oneStartTime = false;
          let startIndex = 0;
          let oneEndTime = false;
          let endIndex = 0;

          this.availableTimes.forEach(element => {
            if(activeDay.startTime.charAt(0) == element.time.charAt(0) && activeDay.startTime.charAt(1) == element.time.charAt(1) && activeDay.startTime.charAt(5) == element.time.charAt(5)){
              if(oneStartTime == false){
                startIndex = counter;
                console.log("START TIME: " + element.time);
                oneStartTime = true;
              }

            }
            counter++;
          });

          counter = 0;

          this.availableTimes.forEach(element => {
            if(activeDay.endTime.charAt(0) == element.time.charAt(0) && activeDay.endTime.charAt(1) == element.time.charAt(1) && activeDay.endTime.charAt(5) == element.time.charAt(5)){
              if(oneEndTime == false){
                endIndex = counter;
                console.log("END TIME: " + element.time);
                oneEndTime = true;
              }

            }
            counter++;
          });

        console.log(startIndex);
        console.log(endIndex);

        for (let index = startIndex; index <= endIndex; index++) {
          this.availableTimes[index].conflict = 'noConflict';
        }

        console.log(this.availableTimes);

        }
      });
    }
  }

  onDayChanged(event: any){

    if(this.loadForm.value.room){
        this.loadService.checkRoomLoadConflict(this.loadForm.value.room.roomName, this.activeAcademicYear.semester, this.activeAcademicYear.startYear, this.loadForm.value.day);
    }

    console.log(event.value);
    this.availableDays.forEach(element => {
      if(element.day == event.value){
        if(element.conflict == 'conflict'){

          this.toastr.error('Your chosen day: ' + event.value.toUpperCase() +' is not listed in ' + this.loadForm.value.faculty.fullName + "'s day schedule", "", {

            disableTimeOut: true,
            positionClass: 'toast-bottom-left',
          });


          // this.snackBar.open('Conflict Detected! Your chosen day: ' + event.value.toUpperCase() +' is not listed in ' + this.loadForm.value.faculty.fullName + "'s day schedule", 'close', {panelClass: ['red-snackbar']});
        }
      }
    });

    let activeDay: any;
    let activeStartTime;
    let activeEndTime;

    this.availableTimes.forEach(element => {
      element.conflict = "conflict";
    })

      this.loadForm.value.faculty.facultySchedule.forEach((element: any) => {
        if(this.loadForm.value.day == element.day){
          activeDay = element;
          console.log(activeDay);

          let counter = 0;
          let oneStartTime = false;
          let startIndex = 0;
          let oneEndTime = false;
          let endIndex = 0;

          this.availableTimes.forEach(element => {
            if(activeDay.startTime.charAt(0) == element.time.charAt(0) && activeDay.startTime.charAt(1) == element.time.charAt(1) && activeDay.startTime.charAt(5) == element.time.charAt(5)){
              if(oneStartTime == false){
                startIndex = counter;
                console.log("START TIME: " + element.time);
                oneStartTime = true;
              }

            }
            counter++;
          });

          counter = 0;

          this.availableTimes.forEach(element => {
            if(activeDay.endTime.charAt(0) == element.time.charAt(0) && activeDay.endTime.charAt(1) == element.time.charAt(1) && activeDay.endTime.charAt(5) == element.time.charAt(5)){
              if(oneEndTime == false){
                endIndex = counter;
                console.log("END TIME: " + element.time);
                oneEndTime = true;
              }

            }
            counter++;
          });

        console.log(startIndex);
        console.log(endIndex);

        for (let index = startIndex; index <= endIndex; index++) {
          this.availableTimes[index].conflict = 'noConflict';
        }

        console.log(this.availableTimes);

        }
      });

  }

  async onSectionChanged(event: any) {

    this.onEditMode = false;
    this.onAddMode = false;
    let year = event.value.charAt(3);
    this.section = 'BS' + event.value;
    console.log(this.section)
    await this.loadService.fetchLoad(
      this.activeAcademicYear.startYear,
      this.activeAcademicYear.semester,
      this.currentChairperson.fullName,
      this.section
    );

    await this.curriculumService.fetchSectionCurriculum(
      this.currentChairperson.department,
      this.activeAcademicYear.semester,
      this.currentChairperson.fullName,
      year
    );

    this.loadForm.reset();
  }


  onRoomLoadChange(event: any){
    this.roomLoad = [];
    let room: string = event.value.roomName;
    this.loadService.checkRoomLoadConflict(room, this.activeAcademicYear.semester, this.activeAcademicYear.startYear, this.loadForm.value.day);
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
      const selectedFacultyName = this.faculties.find(
        (item) =>
          JSON.stringify(item.fullName) === JSON.stringify(load.facultyName)
      );
      const selectedRoomName = this.rooms.find(
        (item) => JSON.stringify(item.roomName) === JSON.stringify(load.room)
      );
      console.log(load);
      this.loadForm.patchValue({ subjectCode: load.subjectCode });
      this.loadForm.patchValue({ subjectDescription: load.subjectDescription });
      this.loadForm.patchValue({ units: load.units });
      this.loadForm.patchValue({ noHour: load.noHour });
      this.loadForm.patchValue({ faculty: selectedFacultyName });
      this.loadForm.patchValue({ day: load.day });
      this.loadForm.patchValue({ startTime: load.startTime });
      this.loadForm.patchValue({ endTime: load.endTime });
      this.loadForm.patchValue({ room: selectedRoomName });




      if(selectedFacultyName){
        this.availableDays.forEach(element => {
          element.conflict ="conflict";
        });

        this.availableDays.forEach(days => {
          selectedFacultyName.facultySchedule.forEach((element: any) => {
            if(days.day == element.day){
              days.conflict = 'noConflict'
            }
          });
        });
      }



    let activeDay: any;
    let activeStartTime;
    let activeEndTime;

    this.availableTimes.forEach(element => {
      element.conflict = "conflict";
    })

    if(selectedFacultyName && this.loadForm.value.day){
      selectedFacultyName.facultySchedule.forEach((element: any) => {
        if(this.loadForm.value.day == element.day){
          activeDay = element;
          console.log(activeDay);




          let counter = 0;
          let oneStartTime = false;
          let startIndex = 0;
          let oneEndTime = false;
          let endIndex = 0;

          this.availableTimes.forEach(element => {
            if(activeDay.startTime.charAt(0) == element.time.charAt(0) && activeDay.startTime.charAt(1) == element.time.charAt(1) && activeDay.startTime.charAt(5) == element.time.charAt(5)){
              if(oneStartTime == false){
                startIndex = counter;
                console.log("START TIME: " + element.time);
                oneStartTime = true;
              }

            }
            counter++;
          });

          counter = 0;

          this.availableTimes.forEach(element => {
            if(activeDay.endTime.charAt(0) == element.time.charAt(0) && activeDay.endTime.charAt(1) == element.time.charAt(1) && activeDay.endTime.charAt(5) == element.time.charAt(5)){
              if(oneEndTime == false){
                endIndex = counter;
                console.log("END TIME: " + element.time);
                oneEndTime = true;
              }

            }
            counter++;
          });

        console.log(startIndex);
        console.log(endIndex);

        for (let index = startIndex; index <= endIndex; index++) {
          this.availableTimes[index].conflict = 'noConflict';
        }

        console.log(this.availableTimes);

        }
      });
    }


      // this.loadForm.setValue({
      //   subjectCode: load.subjectCode,
      //   subjectDescription: load.subjectDescription,
      //   units: load.units,
      //   noHour: load.noHour,
      //   faculty: load.facultyName,
      //   day: load.day,
      //   startTime: load.startTime,
      //   endTime: load.endTime,
      //   room: load.room
      // })
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.uiService.showWarningToast(
        'You are not allowed to edit yet, contact the administrator to ask permission.',
        'Warning'
      );
    }
  }

  onSubmit() {
    // let hasConflict = false;
    // let conflict = '';

    // this.availableDays.forEach(element => {
    //   if(element.day == this.loadForm.value.day){
    //     if(element.conflict == 'conflict'){
    //       hasConflict = true;
    //       conflict = 'your chosen day is not in the faculty day schedule'
    //     }
    //   }
    // });


    // if(hasConflict){
    //   console.log(hasConflict);
    //   console.log(conflict);
    // }

    // if(!hasConflict){
      if (this.onEditMode) {
        if (this.currentLoad.id != '') {
          this.loadService.updateLoadToDatabase(
            {
              facultyName: this.loadForm.value.faculty.fullName,
              facultyId: this.loadForm.value.faculty.id,
              department: this.currentLoad.department,
              chairperson: this.currentLoad.chairperson,
              semester: this.currentLoad.semester,
              schoolYear: this.currentLoad.schoolYear,
              subjectCode: this.loadForm.value.subjectCode,
              subjectDescription: this.loadForm.value.subjectDescription,
              units: this.loadForm.value.units,
              noHour: this.loadForm.value.noHour,
              section: this.currentLoad.section,
              day: this.loadForm.value.day,
              startTime: this.loadForm.value.startTime,
              endTime: this.loadForm.value.endTime,
              room: this.loadForm.value.room.roomName,
            },
            this.currentLoad.id
          );
          this.onEditMode = false;
          this.onAddMode = false;
        } else {
          this.uiService.showErrorToast(
            'Cannot Add new Load, please select a load to Edit!',
            'Error'
          );
        }
      }
      else if (this.onAddMode) {
        this.loadService.addLoad({
          facultyName: this.loadForm.value.faculty.fullName,
          facultyId: this.loadForm.value.faculty.id,
          department: this.currentChairperson.department,
          chairperson: this.currentChairperson.fullName,
          semester: this.activeAcademicYear.semester,
          schoolYear: this.activeAcademicYear.startYear,
          subjectCode: this.loadForm.value.subjectCode,
          subjectDescription: this.loadForm.value.subjectDescription,
          units: this.loadForm.value.units,
          noHour: this.loadForm.value.noHour,
          section: this.section,
          day: this.loadForm.value.day,
          startTime: this.loadForm.value.startTime,
          endTime: this.loadForm.value.endTime,
          room: this.loadForm.value.room.roomName,
        });
        this.onEditMode = false;
        this.onAddMode = false;
      }
    // }

    this.loadService.fetchFacultyLoad(this.activeAcademicYear.startYear, this.activeAcademicYear.semester, this.currentChairperson.fullName, this.loadForm.value.faculty.fullName);

    this.loadForm.reset();
  }

  onAddLoadMode() {
    this.onAddMode = true;
    this.onEditMode = false;
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

  clearError(){
    this.toastr.clear();
  }

  ngOnDestroy(): void {
    this.loadSubs.unsubscribe();
    this.curriculumSubs.unsubscribe();
    this.sectionSubs.unsubscribe();
    this.roomsSubs.unsubscribe();
    this.facultySubs.unsubscribe();
    this.secCurSubs.unsubscribe();
    this.roomLoadSubs.unsubscribe();
    this.currentFacultySubs.unsubscribe();
  }
}
