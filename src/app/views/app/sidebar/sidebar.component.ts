import { Component, OnInit, OnDestroy } from '@angular/core';
import menuItems, { IMenuItem } from 'src/app/constants/menu';
import {
  SidebarService,
  ISidebar,
} from 'src/app/containers/layout/sidebar/sidebar.service';
import { Subscription } from 'rxjs';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { style } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: IMenuItem[];
  theId: number;
  theItem: IMenuItem;

  sidebar: ISidebar;
  subscription: Subscription;

  constructor(
    private sidebarService: SidebarService,
    public ds: DesignService,
    public moveableService: MoveableService
  ) {
    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
    this.menuItems = menuItems;
    this.theId = 0;
    this.theItem = this.menuItems[0];
  }

  async ngOnInit(): Promise<void> {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  menuClicked(event) {
    event.stopPropagation();
    this.moveableService.isPosition = false;
  }

  menuItemClicked(event, item, index) {
    this.theId = index;
    this.theItem = item;

    // this.ds.setStatus(ItemStatus.none);
  }

  closeSidebar() {
    let anelWidth = document.querySelector('app-design-panel').clientWidth;

    if (this.ds.isOpenSidebar) {
      (document.querySelector('#sub-menu') as HTMLElement).style.marginLeft =
        '-370px';
      (document.querySelector('app-design-panel') as HTMLElement).style.width =
        'calc(100% - 85px)';

      setTimeout(() => {
        (
          document.querySelector('.close-btn-boxShows').lastChild as HTMLElement
        ).setAttribute('fill', 'white');
        (
          document.querySelector('.close-btn-boxShows').lastChild as HTMLElement
        ).style.transform = 'rotate(180deg)';
        (
          document.querySelector('.close-btn-boxShows')
            .firstChild as HTMLElement
        ).setAttribute('fill', '#0e1317');
      }, 400);

      (document.querySelector('#sub-menu') as HTMLElement).animate(
        [{ marginLeft: '0px' }, { marginLeft: '-370px' }],
        {
          easing: 'ease-in',
          duration: 400,
        }
      );
      (document.querySelector('app-design-panel') as HTMLElement).animate(
        [{ width: 'calc(100% - 455px)' }, { width: 'calc(100% - 85px)' }],
        {
          easing: 'ease-in',
          duration: 400,
        }
      );
    } else {
      (document.querySelector('#sub-menu') as HTMLElement).style.marginLeft =
        '0px';
      (document.querySelector('app-design-panel') as HTMLElement).style.width =
        'calc(100% - 455px)';
      (
        document.querySelector('.close-btn-boxShows').firstChild as HTMLElement
      ).setAttribute('fill', '#f7f7f7');
      (
        document.querySelector('.close-btn-boxShows').lastChild as HTMLElement
      ).setAttribute('fill', '#0e1317');
      (
        document.querySelector('.close-btn-boxShows').lastChild as HTMLElement
      ).style.transform = 'rotate(0deg)';

      (document.querySelector('#sub-menu') as HTMLElement).animate(
        [{ marginLeft: '-370px' }, { marginLeft: '0px' }],
        {
          easing: 'ease-out',
          duration: 400,
        }
      );
      (document.querySelector('app-design-panel') as HTMLElement).animate(
        [{ width: 'calc(100% - 85px)' }, { width: 'calc(100% - 455px)' }],
        {
          easing: 'ease-out',
          duration: 400,
        }
      );
    }
    this.ds.isOpenSidebar = !this.ds.isOpenSidebar;
  }
}
