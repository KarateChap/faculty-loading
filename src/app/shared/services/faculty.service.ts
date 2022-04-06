import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NewFaculty } from '../models/new-faculty.model';
import { UIService } from '../UIService/ui.service';
import { map } from 'rxjs/operators';
import { Faculty } from '../models/faculty.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FacultyService {
  faculties: Faculty[] = [];
  facultyChanged = new Subject<Faculty[]>();
  facultyAddedChanged = new Subject<void>();

  constructor(private af: AngularFirestore, private uiService: UIService) {}

  addFacultyToDatabase(faculty: NewFaculty) {
    this.af.collection('faculty').add(faculty);
    this.uiService.showSuccessToast('Faculty Added Succesfully!', 'Success');
  }

  fetchFaculty(startYear: string, semester: string, chairpersonName: string) {

    this.af
      .collection('faculty')
      .ref.where('startYear', '==', startYear)
      .where('semester', '==', semester)
      .where('chairpersonName', '==', chairpersonName)
      .onSnapshot((result) => {
        this.faculties = [];
        result.forEach((doc) => {
          this.faculties.push({ id: doc.id, ...(doc.data() as NewFaculty) });
        });
        this.facultyChanged.next(this.faculties);
      });
  }

  onRemoveFaculty(facultyId: string) {
    this.af.doc('faculty/' + facultyId).delete();
    this.uiService.showSuccessToast('Faculty Deleted Succesfully!', 'Success');
  }

  updateFacultyToDatabase(faculty: NewFaculty, id: string) {
    this.af.doc('faculty/' + id).update(faculty);
    this.uiService.showSuccessToast('Faculty Updated Succesfully!', 'Success');
  }
}
