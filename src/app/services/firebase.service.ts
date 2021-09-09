import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdminTemplates, UserData, UploadUserTemplate } from '../models/models';
import { UserRole } from 'src/app/shared/auth.roles';
import { DesignService } from './design.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(public db: AngularFirestore, public ds: DesignService) {}

  users = [];
  readUser(tag) {
    return new Promise((resolve, reject) => {
      this.db
        .collection<UserData>('User', (ref) => ref.where('uid', '==', tag))
        .snapshotChanges()
        .subscribe((data) => {
          let users = data.map((e) => {
            return {
              docId: e.payload.doc.id,
              ...e.payload.doc.data(),
            } as UserData;
          });

          resolve(users[0]);
        });
    });
  }

  readObservableUser(tag) {
    return this.db
      .collection<UserData>('User', (ref) => ref.where('uid', '==', tag))
      .snapshotChanges();
  }

  readAllUser() {
    return this.db.collection<UserData>('User').snapshotChanges();
  }

  createUser(user) {
    return new Promise((resolve, reject) => {
      this.db.collection<UserData>('User').add({
        uid: user.uid,
        displayName: user.displayName,
        role: UserRole.Editor,
        template: [],
        email: user.email,
        timestamp: Date.now(),
      });

      resolve(true);
    });
  }

  updateUserTemplate(templates: UploadUserTemplate[], docId) {
    this.db.collection<UserData>('User').doc(docId).update({
      template: templates,
    });
  }

  updateUserDownloadCount(count, id) {
    this.db
      .collection<UserData>('User')
      .doc(id)
      .update({ downloadCount: count });
  }

  readAdminTemplates() {
    return this.db
      .collection<AdminTemplates>('AdminTemplates')
      .snapshotChanges();
  }

  removeAdminCategory(docId) {
    // arr: AdminTemplates[]
    // arr.forEach((asset) => {
    this.db.collection<AdminTemplates>('AdminTemplates').doc(docId).delete();
    // });
  }

  createAdminTemplates(templates, docId) {
    this.db
      .collection<AdminTemplates>('AdminTemplates')
      .doc(docId)
      .set({ templates: templates });
  }

  updateTemplateCount(count, docId) {
    this.db.collection<AdminTemplates>('AdminTemplates').doc(docId).update({
      clickCount: count,
    });
  }

  updateDownloadTemplateCount(count, docId) {
    this.db.collection<AdminTemplates>('AdminTemplates').doc(docId).update({
      downloadCount: count,
    });
  }

  readTemplateCount(docId) {
    return this.db
      .collection<AdminTemplates>('AdminTemplates')
      .doc(docId)
      .get();
  }

  updateAdminCategory(templates, docId) {
    this.db.collection<AdminTemplates>('AdminTemplates').doc(docId).update({
      templates: templates,
    });
  }

  getCategoryName() {
    this.readAdminTemplates().subscribe((e) => {
      this.ds.categoryName = [];

      e.forEach((data) => {
        this.ds.categoryName.push(data.payload.doc.id);
      });
    });
  }
}
