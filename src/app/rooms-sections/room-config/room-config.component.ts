import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/shared/models/room.model';
import { RoomSectionService } from 'src/app/shared/services/room-section.service';
import { UIService } from 'src/app/shared/UIService/ui.service';

@Component({
  selector: 'app-room-config',
  templateUrl: './room-config.component.html',
  styleUrls: ['./room-config.component.css'],
})
export class RoomConfigComponent implements OnInit, OnDestroy {
  configType = 'add';
  roomName = '';
  nameInvalid = false;

  rooms: Room[] = [];
  roomsSubs: Subscription;
  constructor(
    @Inject(MAT_DIALOG_DATA) private passedData: any,
    private rsService: RoomSectionService,
    private uiService: UIService
  ) {}

  ngOnInit(): void {
    this.rsService.fetchRooms();
    this.roomsSubs = this.rsService.roomsChanged.subscribe((rooms) => {
      this.rooms = rooms;
    });
    if (this.passedData.room) {
      this.roomName = this.passedData.room.roomName;
    }
    this.configType = this.passedData.configType;
  }

  onSubmit() {
    this.checkError();
    if (this.nameInvalid) {
      this.uiService.showErrorToast(
        'Cannot add/edit already existing room!',
        'Error'
      );
    }
    else {
      if (this.configType == 'add') {
        this.rsService.addRoomToDatabase({
          roomName: this.roomName.toUpperCase(),
        });
      } else {
        this.rsService.updateRoomToDatabase(
          { roomName: this.roomName },
          this.passedData.room.id
        );
      }
      this.nameInvalid = false;
    }
  }

  checkError() {
    this.rooms.forEach((element) => {
      if (element.roomName == this.roomName.toUpperCase()) {
        this.nameInvalid = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.roomsSubs.unsubscribe();
  }
}
