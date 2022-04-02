import { Component, OnDestroy, OnInit } from '@angular/core';
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
  rooms: Room[] = [];
  roomsSubs: Subscription;
  isLoading = false

  sections: Section[] = [];
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
    });

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
    this.dialog.open(SectionConfigComponent, {
      data: {
        configType: 'add',
      },
    });
  }


  onEditSection(index: number){
    this.dialog.open(SectionConfigComponent, {
      data: {
        configType: 'edit',
        section: this.sections[index]
      },
    });
  }

  onRemoveSection(index: number){
    this.rsService.deleteSectionToDatabase(this.sections[index].id);
  }




  ngOnDestroy(): void {
      this.roomsSubs.unsubscribe();
      this.sectionsSubs.unsubscribe();
  }
}
