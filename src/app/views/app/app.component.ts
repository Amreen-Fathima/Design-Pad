import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  SidebarService,
  ISidebar,
} from 'src/app/containers/layout/sidebar/sidebar.service';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  sidebar: ISidebar;
  subscription: Subscription;
  fonts;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );

    fetch(
      'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBipcG_GYuR_AN_TP6SxzppJz9sWZxIJSQ'
    )
      .then((res) => res.json())
      .then((out) => {
        this.fonts = out;
        for (let i = 0; i < this.fonts.items.length; i++) {
          if (
            this.fonts.items[i].family == 'Buda' ||
            this.fonts.items[i].family == 'Sunflower' ||
            this.fonts.items[i].family == 'UnifrakturCook' ||
            this.fonts.items[i].family == 'Molle' ||
            this.fonts.items[i].family == 'Open Sans Condensed' ||
            this.fonts.items[i].family == 'Coda Caption'
          )
            continue;
          else {
            let fontFamily = this.fonts.items[i].family;
            let fontUrl = `https://fonts.googleapis.com/css?family=${fontFamily.replace(
              ' ',
              '+'
            )}`;
            let pos = fontFamily.indexOf(':');
            if (pos > 0) {
              fontFamily = fontFamily.substring(0, pos);
            }
            let link = document.createElement('link');
            link.id = 'myfontlink';
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', fontUrl);
            document.head.appendChild(link);
          }
        }
      })
      .catch((err) => console.error(err));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
