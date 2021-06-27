import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { FirebaseService } from 'src/app/services/firebase.service';
import { FirebaseApp } from '@angular/fire';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm: NgForm;
  buttonDisabled = false;
  buttonState = '';

  constructor(
    public authService: AuthService,
    private notifications: NotificationsService,
    private router: Router,
    private firebaseService: FirebaseService,
    private firebase: FirebaseApp
  ) {}

  onSubmit(): void {
    if (!this.registerForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    this.authService
      .emailSignUp(this.registerForm.value)
      .then(async (user) => {
        if (!(await this.firebaseService.readUser(user.uid))) {
          await this.firebaseService.createUser(user);
          await this.authService.setAuthData(user);
        }
        user.sendEmailVerification();
        this.buttonState = '';
        this.notifications.create(
          'Verify your email',
          'We have sent an email with a confirmation link to your email address. Please allow 5-10 minutes for this message to arrive.',
          NotificationType.Bare,
          {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: true,
          }
        );
      })
      .catch((error) => {
        if (
          !this.firebase.auth().currentUser.emailVerified &&
          error.code == 'auth/email-already-in-use'
        ) {
          this.firebase
            .auth()
            .currentUser?.sendEmailVerification()
            .then(() => {
              this.notifications.create(
                'Resent verification email',
                'We have sent an email with a confirmation link to your email address. Please allow 5-10 minutes for this message to arrive.',
                NotificationType.Bare,
                {
                  theClass: 'outline primary',
                  timeOut: 6000,
                  showProgressBar: true,
                }
              );
            })
            .catch((error) => {
              if (error.code == 'auth/too-many-requests') {
                this.notifications.create(
                  'Error',
                  error.message,
                  NotificationType.Bare,
                  {
                    theClass: 'outline primary',
                    timeOut: 6000,
                    showProgressBar: true,
                  }
                );
              }
            });
        } else {
          this.notifications.create(
            'Error',
            error.message,
            NotificationType.Bare,
            {
              theClass: 'outline primary',
              timeOut: 6000,
              showProgressBar: true,
            }
          );
          this.buttonDisabled = false;
        }
        this.buttonState = '';
      });
  }

  async googleAuth() {
    this.authService.googleAuth().then(async (user: firebase.User) => {
      if (!(await this.firebaseService.readUser(user.uid))) {
        await this.firebaseService.createUser(user);
        await this.authService.setAuthData(user);
      }

      this.router.navigate([environment.adminRoot]);
    });
  }

  async facebookAuth() {
    this.authService.facebookAuth().then(async (user: firebase.User) => {
      if (!(await this.firebaseService.readUser(user.uid))) {
        await this.firebaseService.createUser(user);
        await this.authService.setAuthData(user);
      }

      this.router.navigate([environment.adminRoot]);
    });
  }
}
