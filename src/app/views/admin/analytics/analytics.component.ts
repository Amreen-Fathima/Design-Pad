import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DesignService } from 'src/app/services/design.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AssetService } from 'src/app/services/asset.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  categoryName = [];
  categoryCount = [];
  categoryDownloadCount = [];
  elementName = [];
  elementCount = [];
  userData = [];
  constructor(
    public auth: AngularFireAuth,
    public ds: DesignService,
    public firebaseService: FirebaseService,
    public assetService: AssetService
  ) {}

  ngOnInit(): void {
    // Increase click count...
    this.firebaseService.readAdminTemplates().subscribe((e) => {
      e.forEach((data) => {
        this.categoryName.push(data.payload.doc.id);
      });

      for (let i = 0; i < this.categoryName.length; i++) {
        this.firebaseService
          .readTemplateCount(this.categoryName[i])
          .subscribe((e) => {
            let data = e.data();
            if (data['clickCount'] == undefined) {
              this.categoryCount.push(0);
            } else {
              this.categoryCount.push(data['clickCount']);
            }
            if (data['downloadCount'] == undefined) {
              this.categoryDownloadCount.push(0);
            } else {
              this.categoryDownloadCount.push(data['downloadCount']);
            }
          });
      }
    });

    this.assetService.readElementCategoryName().subscribe((e) => {
      let data = e.data();
      this.elementName = data['categoryName'];
      for (let i = 0; i < this.elementName.length; i++) {
        let count = 0;
        this.assetService
          .readElementByCategory(this.elementName[i])
          .subscribe((data) => {
            let clickData = data.map((e) => {
              return {
                uid: e.payload.doc.id,
                ...e.payload.doc.data(),
              };
            });
            for (let j = 0; j < clickData.length; j++) {
              count +=
                clickData[j]['clickCount'] == undefined
                  ? 0
                  : clickData[j]['clickCount'];
            }
            this.elementCount.push(count);
          });
      }
    });

    this.firebaseService.readAllUser().subscribe((data) => {
      this.userData = [];
      let users = data.map((e) => {
        return {
          docId: e.payload.doc.id,
          ...e.payload.doc.data(),
        };
      });
      for (let i = 0; i < users.length; i++) {
        this.userData.push({
          displayName: users[i]['displayName'],
          email: users[i]['email'] == undefined ? '' : users[i]['email'],
          date: users[i]['timestamp'] == undefined ? '' : users[i]['timestamp'],
          downloadCount:
            users[i]['downloadCount'] == undefined
              ? 0
              : users[i]['downloadCount'],
        });
      }
    });
  }
}
