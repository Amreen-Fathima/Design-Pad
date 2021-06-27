import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { LangService } from './shared/lang.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { ToolbarService } from './services/toolbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
@Injectable()
export class AppComponent implements OnInit, AfterViewInit {
  isMultiColorActive = environment.isMultiColorActive;
  constructor(
    private authService: AuthService,
    private langService: LangService,
    private renderer: Renderer2,
    public ToolbarService: ToolbarService,
    private router: Router
  ) {
    // this.authService.init();
  }

  ngOnInit(): void {
    this.langService.init();

    window.onclick = (event) => {
      let modal = document.querySelector('.model-container') as HTMLElement;
      let logo = document.querySelector('.logo-icon') as HTMLElement;

      if (event.target.className == 'logo-icon') {
        this.router.navigate(['/']);
      }
    };
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderer.addClass(document.body, 'show');
    }, 1000);
    setTimeout(() => {
      this.renderer.addClass(document.body, 'default-transition');
    }, 1500);
  }
}
