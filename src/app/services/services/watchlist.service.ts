import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfiguration } from '../api-configuration';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  constructor(
    private http: HttpClient,
    private config: ApiConfiguration
  ) {}

  toggleBook(bookId: number): Observable<unknown> {
    const params = new HttpParams().set('bookId', bookId);
    return this.http.post<unknown>(`${this.config.rootUrl}/watchlist/add-watchlist`, null, { params });
  }
}