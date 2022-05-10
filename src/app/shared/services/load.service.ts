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

  loads: LoadItem[] = [];
  loadChange = new Subject<LoadItem[]>();
  constructor(private af: AngularFirestore, private uiService: UIService){
  }

  changeCurrentSectionLoad(currentSection: LoadItem[]){
    this.currentSectionLoad = currentSection;
    this.currentSectionLoadChange.next(currentSection);
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

  fetchFacultyLoad(startYear: string, semester: string, chairpersonName: string, facultyName: string){
    this.af
    .collection('load')
    .ref.where('schoolYear', '==', startYear)
    .where('semester', '==', semester)
    .where('chairperson', '==', chairpersonName)
    .where('facultyName', '==', facultyName)
    .onSnapshot((result) => {
      this.loads = [];
      result.forEach((doc) => {
        this.loads.push({ id: doc.id, ...(doc.data() as NewLoadItem) });
      });
      this.loadChange.next(this.loads);
    });
  }

  addSectionLoad(load: NewLoadItem){
      this.af.collection('load').add(load);
  }

  onRemoveLoad(loadId: string){
      this.af.doc('load/' + loadId).delete()
      this.uiService.showSuccessToast('Load Deleted Succesfully!', 'Success');
  }

  updateLoadToDatabase(load: NewLoadItem, id: string) {
    this.af.doc('load/' + id).update(load);
    this.uiService.showSuccessToast('Load Updated Succesfully!', 'Success');
  }
}
