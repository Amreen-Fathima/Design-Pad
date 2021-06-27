import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  tabs: TabData[] = [
    { title: 'Photo' },
    { title: 'Element' },
    { title: 'Music' },
    { title: 'Video' },
    { title: 'Text', disabled: true },
    { title: 'Template', disabled: false },
  ];
  theTabId: number = 0;

  goHome() {
    this.router.navigate(['/app']);
  }
}

interface TabData {
  title: string;
  disabled?: boolean;
}
