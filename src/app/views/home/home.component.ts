import { FirebaseService } from './../../services/firebase.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { AdminTemplate, AdminTemplates } from 'src/app/models/models';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    public authService: AuthService,
    public router: Router,
    public firebaseSerivce: FirebaseService,
    public ds: DesignService
  ) {}

  ngOnInit(): void {
    if (!this.ds.adminAllTemplates.length || !this.ds.latestTemplates.length) {
      this.readAdminTemplates();
    }
  }

  ngOnDestroy(): void {}

  readAdminTemplates() {
    this.firebaseSerivce.readAdminTemplates().subscribe((e) => {
      this.ds.adminAllTemplates = e.map((data) => {
        return {
          docId: data.payload.doc.id,
          ...data.payload.doc.data(),
        } as AdminTemplates;
      });
      console.log(this.ds.adminAllTemplates);

      for (let i = 0; i < this.ds.adminAllTemplates.length; i++) {
        this.ds.latestTemplates.push(
          this.ds.adminAllTemplates[i]['templates'][0]
        );
        for (
          let j = 0;
          j < this.ds.adminAllTemplates[i]['templates'].length;
          j++
        ) {
          if (
            this.ds.latestTemplates[i].timestamp <
            this.ds.adminAllTemplates[i]['templates'][j].timestamp
          ) {
            this.ds.latestTemplates[i] =
              this.ds.adminAllTemplates[i]['templates'][j];
          }
        }
      }
    });
  }

  async onSignOut() {
    await this.authService.signOut();
    this.router.navigate(['/']);
  }

  navigateToCategory(index) {
    this.ds.filteredTemplate = [];
    for (
      let i = 0;
      i < this.ds.adminAllTemplates[index]['templates'].length;
      i++
    ) {
      this.ds.filteredTemplate.push(
        this.ds.adminAllTemplates[index]['templates'][i]
      );
    }

    this.ds.latestTemplate = this.ds.latestTemplates[index];
    this.ds.keyword =
      this.ds.latestTemplates[index].design.category.categoryType.title;

    this.router.navigate(['/app']);
  }

  navigateToPad() {
    this.ds.selectedCategory = null;
    this.ds.filteredTemplate = null;
    this.ds.keyword = null;
    this.ds.latestTemplate = null;
    this.router.navigate(['/app']);
  }
}
