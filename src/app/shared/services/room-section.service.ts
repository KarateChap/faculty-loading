import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NewRoom } from '../models/new-room.model';
import { UIService } from '../UIService/ui.service';
import {map} from 'rxjs/operators';
import { Room } from '../models/room.model';
import { Subject } from 'rxjs';
import { NewSection } from '../models/new-section.model';
import { Section } from '../models/section.model';

@Injectable({ providedIn: 'root' })
export class RoomSectionService {
  constructor(private af: AngularFirestore, private uiService: UIService) {}

  rooms: Room [] = [];
  roomsChanged = new Subject<Room[]>();

  sections: Section [] = [];
  sectionsChanged = new Subject<Section[]>();


  //room

  addRoomToDatabase(room: NewRoom) {
    this.af.collection('room').add(room);
    this.uiService.showSuccessToast('Room Added Succesfully!', 'Success');
  }

  fetchRooms() {
    this.af
      .collection('room')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              id: doc.payload.doc.id,
              ...(doc.payload.doc.data() as any),
            };
          });
        })
      )
      .subscribe((rooms: Room[]) => {
        this.rooms = rooms;
        this.roomsChanged.next([...this.rooms]);
      });
  }

  updateRoomToDatabase(room: NewRoom, id: string) {
    this.af.doc('room/' + id).update(room);
    this.uiService.showSuccessToast('Room Updated Succesfully!', 'Success');
  }

  deleteRoomToDatabase(roomId: string){
    this.af.doc('room/' + roomId).delete()
    this.uiService.showSuccessToast('Room Deleted Succesfully!', 'Success');
  }


  //section
  addSectionToDatabase(section: NewSection) {
    this.af.collection('section').add(section);
    this.uiService.showSuccessToast('Section Added Succesfully!', 'Success');
  }

  fetchSections() {
    this.af
      .collection('section')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              id: doc.payload.doc.id,
              ...(doc.payload.doc.data() as any),
            };
          });
        })
      )
      .subscribe((sections: Section[]) => {
        this.sections = sections;
        this.sectionsChanged.next([...this.sections]);
      });
  }

  updateSectionToDatabase(section: NewSection, id: string) {
    this.af.doc('section/' + id).update(section);
    this.uiService.showSuccessToast('Section Updated Succesfully!', 'Success');
  }

  deleteSectionToDatabase(sectionId: string){
    this.af.doc('section/' + sectionId).delete()
    this.uiService.showSuccessToast('Section Deleted Succesfully!', 'Success');
  }
}
