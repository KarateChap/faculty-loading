import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Room } from '../shared/models/room.model';
import { Section } from '../shared/models/section.model';
import { RoomSectionService } from '../shared/services/room-section.service';
import { RoomConfigComponent } from './room-config/room-config.component';
import { SectionConfigComponent } from './section-config/section-config.component';

@Component({
  selector: 'app-rooms-sections',
  templateUrl: './rooms-sections.component.html',
  styleUrls: ['./rooms-sections.component.css'],
})
export class RoomsSectionsComponent implements OnInit, OnDestroy {
  @ViewChild('group', {static: true}) buttonGroup: MatButtonToggleGroup;
  rooms: Room[] = [];
  roomsSubs: Subscription;
  isLoading = false

  sections: Section[] = [];
  unfilteredSections: Section[] = [];
  sectionsSubs: Subscription;
  isLoading2 = false;

  constructor(
    private dialog: MatDialog,
    private rsService: RoomSectionService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.rsService.fetchRooms();
    this.roomsSubs = this.rsService.roomsChanged.subscribe((rooms) => {
      this.rooms = rooms;
      this.isLoading = false;
    });

    this.isLoading2 = true;
    this.rsService.fetchSections();
    this.sectionsSubs = this.rsService.sectionsChanged.subscribe((sections) => {
      this.sections = sections;
      this.isLoading2 = false;


      console.log(this.sections);


      this.sections = this.sections.sort((a,b) => {
        return +a.section - +b.section
      })
      this.sections = this.sections.sort((a, b) => {
        return +a.year - +b.year;
      })
      this.sections = this.sections.sort((a,b)=> {
        if ( a.course < b.course ){
          return -1;
        }
        if ( a.course > b.course ){
          return 1;
        }
        return 0;
      });

      this.unfilteredSections = this.sections;


    });

  }

  compareCourseName(a: any, b: any){
    if ( a.course < b.a.course ){
      return -1;
    }
    if ( a.a.course > b.a.course ){
      return 1;
    }
    return 0;
  }


  //Room
  onAddRoom() {
    this.dialog.open(RoomConfigComponent, {
      data: {
        configType: 'add',
      },
    });
  }


  onEditRoom(index: number){
    this.dialog.open(RoomConfigComponent, {
      data: {
        configType: 'edit',
        room: this.rooms[index]
      },
    });
  }

  onRemoveRoom(index: number){
    this.rsService.deleteRoomToDatabase(this.rooms[index].id);
  }



  //Section

  onAddSection() {
    this.buttonGroup.value = 'all'
    this.dialog.open(SectionConfigComponent, {
      data: {
        configType: 'add',
      },
    });
  }


  onEditSection(index: number){
    this.buttonGroup.value = 'all'
    this.dialog.open(SectionConfigComponent, {
      data: {
        configType: 'edit',
        section: this.sections[index]
      },
    });
  }

  onRemoveSection(index: number){
    this.buttonGroup.value = 'all'
    this.rsService.deleteSectionToDatabase(this.sections[index].id);
  }

  filter(value: String){
    this.sections = this.unfilteredSections;

    if(value !== 'all'){
      this.sections = this.sections.filter(function (el) {
        return el.course === value;
      })
    }
    else {
      this.sections = this.unfilteredSections;
    }


  }




  ngOnDestroy(): void {
      this.roomsSubs.unsubscribe();
      this.sectionsSubs.unsubscribe();
  }
}
