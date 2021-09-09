import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UnsplashService {
  constructor(private httpClient: HttpClient) {}

  Key = '0d1J4kJnkSJUEXn36JuOIu2APnM5v-akHxongEgf8LI';
  getImage(per_page: number, page: number) {
    return this.httpClient.get(
      `https://api.unsplash.com/photos/?per_page=${per_page}&page=${page}&client_id=${this.Key}`
    );
  }

  searchImage(per_page: number, page: number, searchkeyword: string) {
    return this.httpClient.get(
      `https://api.unsplash.com/search/photos?per_page=${per_page}&page=${page}&client_id=${this.Key}&query=${searchkeyword} `
    );
  }
}
