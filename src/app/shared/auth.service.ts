import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { from, Subject } from 'rxjs';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { UserRole } from './auth.roles';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { environment } from 'src/environments/environment';
import { UserData } from '../models/models';

export interface ISignInCredentials {
  email: string;
  password: string;
}

export interface ICreateCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface IPasswordReset {
  code: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user;
  subjectAuth = new Subject<boolean>();

  constructor(
    private auth: AngularFireAuth,
    private notifications: NotificationsService,
    private router: Router,
    public ngZone: NgZone,
    public firebaseService: FirebaseService
  ) {
    var unsubscribe = auth.onAuthStateChanged(async (user: User) => {
      this.user = JSON.parse(localStorage.getItem('user'));
      await this.setAuthData(user);
    });
  }

  async setAuthData(authUser: User) {
    if (authUser) {
      if ((await this.firebaseService.readUser(authUser.uid)) as UserData) {
        let role = (
          (await this.firebaseService.readUser(authUser.uid)) as UserData
        ).role;
        this.user = {
          displayName: authUser.displayName,
          role: role,
          photoURL: authUser.photoURL,
          uid: authUser.uid,
          email: authUser.email,
        };
        localStorage.setItem('user', JSON.stringify(this.user));
        this.user = JSON.parse(localStorage.getItem('user'));
        this.subjectAuth.next(true);
      }
    } else this.signOut();
  }

  // tslint:disable-next-line:typedef
  emailSignIn(credentials: ISignInCredentials) {
    return this.auth
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(async ({ user }) => {
        return user;
      });
  }

  async signOut() {
    await this.auth.signOut();
    this.user = null;
    localStorage.setItem('user', null);
    this.ngZone.run(() => {
      this.router.navigate(['/']);
    });
    // this.subjectAuth.next(false);
  }

  // tslint:disable-next-line:typedef
  emailSignUp(credentials: ICreateCredentials) {
    return this.auth
      .createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(async ({ user }) => {
        await user.updateProfile({
          displayName: credentials.displayName,
        });
        await this.auth.updateCurrentUser(user);

        return user;
      });
  }

  googleAuth() {
    return this.auth
      .signInWithPopup(new auth.GoogleAuthProvider())
      .then(async ({ user }) => {
        return user;
      })
      .catch((error) => {
        this.notifications.create(
          'Error',
          error.message,
          NotificationType.Bare,
          {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false,
          }
        );
      });
  }

  facebookAuth() {
    return this.auth
      .signInWithPopup(new auth.FacebookAuthProvider())
      .then(async ({ user }) => {
        return user;
      })
      .catch((error) => {
        this.notifications.create(
          'Error',
          error.message,
          NotificationType.Bare,
          {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false,
          }
        );
      });
  }

  // tslint:disable-next-line:typedef
  sendPasswordResetEmail(email) {
    return this.auth.sendPasswordResetEmail(email).then(() => {
      return true;
    });
  }

  // tslint:disable-next-line:typedef
  resetPassword(credentials: IPasswordReset) {
    return this.auth
      .confirmPasswordReset(credentials.code, credentials.newPassword)
      .then((data) => {
        return data;
      });
  }
}
