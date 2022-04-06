import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { NewAcademicPeriod } from '../models/new-academic-period.model';
import { UIService } from '../UIService/ui.service';
import { map } from 'rxjs/operators';
import { AcademicPeriod } from '../models/academic-period.model';

@Injectable({ providedIn: 'root' })
export class AcademicService {
  activeAcadId: string;
  activeAcademicYear: AcademicPeriod;
  activeAcademicChange = new Subject<AcademicPeriod>();
  activeIdChange = new Subject<string>();
  academicYears: AcademicPeriod[] = [];
  academicYearChange = new Subject<AcademicPeriod[]>();

  constructor(private af: AngularFirestore, private uiService: UIService) {}

  setAcademicYear(academicPeriod: NewAcademicPeriod) {
    this.af.collection('academic').add(academicPeriod);
    this.uiService.showSuccessToast(
      'Academic Year Changed Succesfully!',
      'Success'
    );

    this.fetchActiveAcademicYear();
  }

  setInactiveAcademicYear(activeId: string) {
    this.af.doc('academic/' + activeId).update({ isActive: false });
  }

  fetchActiveAcademicYear() {
    this.af
      .collection('academic')
      .ref.where('isActive', '==', true)
      .get()
      .then((result) => {
        let id = '';
        id = result.docs[0].id;
        this.activeAcadId = id;
        this.activeIdChange.next(id);

        this.af
          .collection('academic')
          .doc(id)
          .snapshotChanges()
          .subscribe((result) => {
            this.activeAcademicYear = result.payload.data() as AcademicPeriod;
            this.activeAcademicChange.next(this.activeAcademicYear);
          });
      });
  }

  fetchAllAcademicYear() {
    this.af
      .collection('academic')
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
      .subscribe(
        (academicYear: AcademicPeriod[]) => {
          this.academicYears = academicYear;
          this.academicYearChange.next([...this.academicYears]);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  updateActiveAcademicYear(academicId: string) {
    this.af.doc('academic/' + academicId).update({ isActive: true });
    this.uiService.showSuccessToast(
      'Academic Year Changed Succesfully!',
      'Success'
    );
  }
}
