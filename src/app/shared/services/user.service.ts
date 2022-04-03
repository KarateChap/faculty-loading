import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewUser } from '../models/new-user.model';
import { User } from '../models/user.model';
import { UIService } from '../UIService/ui.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  users: User[] = [];
  usersChanged = new Subject<User[]>();
  private currentUser: NewUser;
  currentUserChanges = new Subject<NewUser>();

  constructor(private af: AngularFirestore, private uiService: UIService) {}

  fetchUsers() {
    this.af
      .collection('user')
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
      .subscribe((users: User[]) => {
        this.users = users;
        this.usersChanged.next([...this.users]);
      });
  }

  addUserToDatabase(user: NewUser) {
    this.af.collection('user').add(user);
    this.uiService.showSuccessToast('User Added Succesfully!', 'Success');
  }

  updateUserToDatabase(user: NewUser, id: string) {
    this.af.doc('user/' + id).update(user);
    this.uiService.showSuccessToast('User Updated Succesfully!', 'Success');
  }

  fetchCurrentUser(email: string) {
    let id = '';
    this.af
      .collection('user')
      .ref.where('email', '==', email)
      .get()
      .then((result) => {
        if (result) {
          id = result.docs[0].id;
          this.af
            .collection('user')
            .doc(id)
            .snapshotChanges()
            .subscribe((result) => {
              this.currentUser = result.payload.data() as NewUser;
              this.currentUserChanges.next(this.currentUser);
            });
        }
      });
  }

  getCurrentUser() {
    return { ...this.currentUser };
  }

  updateUserDeadline(id: string, newStartDate: any, newEndDate: any) {
    this.af
      .doc('user/' + id)
      .update({ startDate: newStartDate, endDate: newEndDate });
    this.uiService.showSuccessToast('User Updated Succesfully!', 'Success');
  }

  setUserDeadline(startDate: any, endDate: any){
    this.users.forEach(element => {
      this.af
      .doc('user/' + element.id)
      .update({ startDate: startDate, endDate: endDate });
    this.uiService.showSuccessToast('All Users Updated Succesfully!', 'Success');
    });
  }
}
