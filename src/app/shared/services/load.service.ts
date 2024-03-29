import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subject } from "rxjs";
import { LoadItem } from "../models/load-item.model";
import { NewLoadItem } from "../models/new-load-item.model";
import { UIService } from "../UIService/ui.service";

@Injectable({providedIn: 'root'})
export class LoadService {
  currentSectionLoad: LoadItem[] = [];
  currentSectionLoadChange = new Subject<LoadItem[]>();

  currentFacultyLoad: LoadItem[] = [];
  currentFacultyLoadChange = new Subject<LoadItem[]>();

  loads: LoadItem[] = [];
  facultyLoads: LoadItem[] = [];
  allLoads: LoadItem[] = [];
  allLoadChange = new Subject<LoadItem[]>();
  loadChange = new Subject<LoadItem[]>();
  facultyLoadChange = new Subject<LoadItem[]>();

  sameRoomLoad: LoadItem[] = [];
  sameRoomLoadChange = new Subject<LoadItem[]>();

  constructor(private af: AngularFirestore, private uiService: UIService){
  }

  changeCurrentSectionLoad(currentSection: LoadItem[]){
    this.currentSectionLoad = currentSection;
    this.currentSectionLoadChange.next(currentSection);
  }

  changeCurrentFacultyLoad(currentFaculty: LoadItem[]){
    this.currentFacultyLoad = currentFaculty;
    this.currentFacultyLoadChange.next(currentFaculty);
  }

  fetchLoad(startYear: string, semester: string, chairpersonName: string, section: string) {

    this.af
      .collection('load')
      .ref.where('schoolYear', '==', startYear)
      .where('semester', '==', semester)
      .where('chairperson', '==', chairpersonName)
      .where('section', '==', section)
      .onSnapshot((result) => {
        this.loads = [];
        result.forEach((doc) => {
          this.loads.push({ id: doc.id, ...(doc.data() as NewLoadItem) });
        });
        this.loadChange.next(this.loads);
      });
  }

  fetchSectionLoad(startYear: string, semester: string, chairpersonName: string, section: string){
    this.af
    .collection('load')
    .ref.where('schoolYear', '==', startYear)
    .where('semester', '==', semester)
    .where('chairperson', '==', chairpersonName)
    .where('section', '==', section)
    .onSnapshot((result) => {
      this.currentSectionLoad = [];
      result.forEach((doc) => {
        this.currentSectionLoad.push({ id: doc.id, ...(doc.data() as NewLoadItem) });
      });
      this.currentSectionLoadChange.next(this.currentSectionLoad);
    });
  }

  fetchFacultyLoad(startYear: string, semester: string, chairpersonName: string, facultyName: string){
    this.af
    .collection('load')
    .ref.where('schoolYear', '==', startYear)
    .where('semester', '==', semester)
    .where('chairperson', '==', chairpersonName)
    .where('facultyName', '==', facultyName)
    .onSnapshot((result) => {
      this.facultyLoads = [];
      result.forEach((doc) => {
        this.facultyLoads.push({ id: doc.id, ...(doc.data() as NewLoadItem) });
      });
      this.facultyLoadChange.next(this.facultyLoads);
      this.currentFacultyLoadChange.next(this.facultyLoads);
    });
  }

  fetchAllLoad(startYear: string, semester: string, chairpersonName: string){
    // this.allLoads = [];
    // this.af
    //   .collection('load')
    //   .ref.where('schoolYear', '==', startYear)
    //   .where('semester', '==', semester)
    //   .where('chairperson', '==', chairpersonName)
    //   .onSnapshot((result) => {
    //     result.forEach((doc) => {
    //       this.allLoads.push({ id: doc.id, ...(doc.data() as NewLoadItem) });
    //     });
    //     this.allLoadChange.next(this.allLoads);
    //   });

      this.allLoads = [];
      this.af
        .collection('load')
        .ref.where('schoolYear', '==', startYear)
        .where('semester', '==', semester)
        .where('chairperson', '==', chairpersonName)
        .get().then((result) => {
          this.allLoads = [];
          result.forEach((doc) => {
            this.allLoads.push({ id: doc.id, ...(doc.data() as NewLoadItem) });
          });
          this.allLoadChange.next(this.allLoads);
        });
  }

  addLoad(load: NewLoadItem){
      this.af.collection('load').add(load);
      this.uiService.showSuccessToast('Load Added Succesfully!', 'Success');
  }

  onRemoveLoad(loadId: string){
      this.af.doc('load/' + loadId).delete()
      this.uiService.showSuccessToast('Load Deleted Succesfully!', 'Success');
  }

  updateLoadToDatabase(load: NewLoadItem, id: string) {
    this.af.doc('load/' + id).update(load);
    this.uiService.showSuccessToast('Load Updated Succesfully!', 'Success');
  }

  checkRoomLoadConflict(room: string, semester: string, startYear: string, day: string){
    this.sameRoomLoad = [];
      this.af
      .collection('load')
      .ref.where('schoolYear', '==', startYear)
      .where('semester', '==', semester)
      .where('room', '==', room)
      .where('day', '==', day)
      .get().then(result => {
        result.forEach((doc) => {
          this.sameRoomLoad.push({ id: doc.id, ...(doc.data() as NewLoadItem) });
        });
        this.sameRoomLoadChange.next(this.sameRoomLoad);
      })
  }

  // .onSnapshot((result) => {
  //   result.forEach((doc) => {
  //     this.sameRoomLoad.push({ id: doc.id, ...(doc.data() as NewLoadItem) });
  //   });
  //   this.sameRoomLoadChange.next(this.sameRoomLoad);
  // });




}
