import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfiguration } from '../api-configuration';
import { BookResponse } from '../models/book-response';

interface WatchlistResponse {
  data?: BookResponse[];
}

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  constructor(
    private http: HttpClient,
    private config: ApiConfiguration
  ) {}

  getWatchlist(): Observable<BookResponse[]> {
    return this.http.get<WatchlistResponse>(`${this.config.rootUrl}/watchlist/get-watchlist`).pipe(
      map(response => response.data ?? [])
    );
  }

  toggleBook(bookId: number): Observable<unknown> {
    const params = new HttpParams().set('bookId', bookId);
    return this.http.post<unknown>(`${this.config.rootUrl}/watchlist/add-watchlist`, null, { params });
  }
}