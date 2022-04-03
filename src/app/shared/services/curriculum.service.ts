import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { UIService } from '../UIService/ui.service';
import { map } from 'rxjs/operators';
import { NewCurriculum } from '../models/new-curriculum.model';
import { Curriculum } from '../models/curriculum.model';

@Injectable({ providedIn: 'root' })
export class CurriculumService {
  curriculums: Curriculum[] = [];
  fetchCurriculumChanged = new Subject<Curriculum[]>();
  curriculumChanged = new Subject<void>();
  constructor(private af: AngularFirestore, private uiService: UIService) {}

  setCurriculumToDatabase(curriculum: NewCurriculum[]) {
    curriculum.forEach((element) => {
      this.af.collection('curriculum').add(element);
    });
    this.uiService.showSuccessToast('Curriculum Added Succesfully!', 'Success');
  }

  deleteCurriculum(department: string){
    this.af
      .collection('curriculum')
      .ref.where('department', '==', department)
      .get()
      .then((result) => {

        result.forEach((element) => {
          const id = element.id;
          this.af.doc('curriculum/' + id).delete();
        });
        this.curriculumChanged.next();
      });
  }

  fetchAllCurriculum() {
    this.af
      .collection('curriculum')
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
      .subscribe((curriculums: Curriculum[]) => {
        this.curriculums = curriculums;
        this.fetchCurriculumChanged.next([...this.curriculums]);
      });
  }
}
