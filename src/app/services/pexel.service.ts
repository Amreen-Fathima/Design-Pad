import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: '563492ad6f91700001000001f36e8f73ecf34e72a63e76dc93c40869',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class PexelService {
  constructor(private httpClient: HttpClient) {}

  getImage(per_page: number, page: number) {
    const url =
      'https://api.pexels.com/v1/curated/?per_page=' +
      per_page +
      '&page=' +
      page;
    return this.httpClient.get<any>(url, httpOptions);
  }

  searchImage(per_page: number, page: number, searchkeyword: string) {
    const url =
      'https://api.pexels.com/v1/search/?per_page=' +
      per_page +
      '&page=' +
      page +
      '&query=' +
      searchkeyword;
    return this.httpClient.get<any>(url, httpOptions);
  }
}
