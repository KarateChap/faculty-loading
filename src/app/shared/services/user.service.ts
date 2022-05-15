import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewUserLoad } from '../models/new-user-load';
import { NewUser } from '../models/new-user.model';
import { UserLoad } from '../models/user-load';
import { User } from '../models/user.model';
import { UIService } from '../UIService/ui.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  users: User[] = [];
  usersChanged = new Subject<User[]>();
  private currentUser: NewUser;
  currentUserChanges = new Subject<NewUser>();
  userLoads: UserLoad[] = [];
  userLoadsChanged = new Subject<UserLoad[]>();
  currentUserLoad: UserLoad;
  currentUserHistoryLoad: UserLoad;
  emptyCurrentUserLoad: UserLoad;
  currentUserLoadChanged = new Subject<UserLoad>();
  currentUserHistoryLoadChanged = new Subject<UserLoad>();

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


  addUserLoadsToDatabase(userLoad: NewUserLoad) {
    this.af.collection('userLoad').add(userLoad);
    this.uiService.showSuccessToast('Load Submitted Succesfully!', 'Success');
  }

  fetchAllUserLoads(){
    this.af
    .collection('userLoad')
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
    .subscribe((userLoads: UserLoad[]) => {
      this.userLoads = userLoads;
      this.userLoadsChanged.next([...this.userLoads]);
    });
  }


  fetchUserLoad(startYear: string, semester: string, chairpersonName: string) {
    this.af
      .collection('userLoad')
      .ref.where('year', '==', startYear)
      .where('semester', '==', semester)
      .where('chairpersonName', '==', chairpersonName)
      .onSnapshot((result) => {
        this.currentUserLoad = this.emptyCurrentUserLoad;
        result.forEach((doc) => {
          this.currentUserLoad = { id: doc.id, ...(doc.data() as NewUserLoad) }
        });
        this.currentUserLoadChanged.next(this.currentUserLoad);

      });
  }

  fetchUserHistoryLoad(startYear: string, semester: string, chairpersonName: string) {
    this.af
      .collection('userLoad')
      .ref.where('year', '==', startYear)
      .where('semester', '==', semester)
      .where('chairpersonName', '==', chairpersonName)
      .onSnapshot((result) => {
        this.currentUserHistoryLoad = this.emptyCurrentUserLoad;
        result.forEach((doc) => {
          this.currentUserHistoryLoad = { id: doc.id, ...(doc.data() as NewUserLoad) }
        });
        this.currentUserHistoryLoadChanged.next(this.currentUserHistoryLoad);

      });
  }

  updateUserLoad(id: string, status: string) {
    this.af.doc('userLoad/' + id).update({ status: status });
    this.uiService.showSuccessToast(
      'Load updated Successfully!',
      'Success'
    );
  }

  updateDeclinedUserLoad(id: string, status: string, comment: string) {
    this.af.doc('userLoad/' + id).update({ status: status, comment: comment});
    this.uiService.showSuccessToast(
      'Load declined Successfully!',
      'Success'
    );
  }

}
