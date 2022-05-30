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
  sectionCurriculum: Curriculum[] = [];
  sectionCurriculumChanged = new Subject<Curriculum[]>();
  fetchCurriculumChanged = new Subject<Curriculum[]>();
  curriculumChanged = new Subject<void>();
  constructor(private af: AngularFirestore, private uiService: UIService) {}

  setCurriculumToDatabase(curriculum: NewCurriculum[]) {
    curriculum.forEach((element) => {
      this.af.collection('curriculum').add(element);
    });
    this.uiService.showSuccessToast('Curriculum Added/Edited Succesfully!', 'Success');
  }

  // async deleteCurriculum(){
  //   await this.af.collection('curriculum')
  //   .get().forEach((res: any) => {
  //     res.forEach((element:any) => {
  //       element.ref.delete();
  //     });
  //   });
  // }


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
          return docArray.map((doc: any) => {
            return {
              id: doc.payload.doc.id,
              code: doc.payload.doc.data()['code'],
              subjectTitle: doc.payload.doc.data()['subjectTitle'],
              units: doc.payload.doc.data()['units'],
              preReq: doc.payload.doc.data()['preReq'],
              subjectSemester: doc.payload.doc.data()['subjectSemester'],
              subjectYear: doc.payload.doc.data()['subjectYear'],
              department: doc.payload.doc.data()['department'],
              year: doc.payload.doc.data()['year']
            };
          });
        })
      )
      .subscribe((curriculums: Curriculum[]) => {
        this.curriculums = curriculums;
        this.fetchCurriculumChanged.next([...this.curriculums]);
      }, (error) => {
        console.log(error);
      });
  }

  fetchSectionCurriculum(department: string, semester: string, chairperson: string, year: string){
    this.af
    .collection('curriculum')
    .ref.where('department', '==', department)
    .where('subjectSemester', '==', semester)
    .where('subjectYear', '==', year)
    .onSnapshot((result) => {
      this.sectionCurriculum = [];
      result.forEach((doc) => {
        this.sectionCurriculum.push({ id: doc.id, ...(doc.data() as NewCurriculum) });
      });
      this.sectionCurriculumChanged.next(this.sectionCurriculum);
    });
  }

  checkCurriculumExist(department: string){
    this.af
    .collection('curriculum')
    .ref.where('department', '==', department)
    .get().then((result: any) => {
      if(result){
        this.deleteCurriculum(department);
      }
    });
  }
}
