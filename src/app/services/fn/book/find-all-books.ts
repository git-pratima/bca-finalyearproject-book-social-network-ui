/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PageResponseBookResponse } from '../../models/page-response-book-response';

export interface FindAllBooks$Params {
  page?: number;
  size?: number;
  searchParameter?: 'title' | 'authorName' | 'isbn' | 'address' | string;
  state?: string;
  city?: string;
  postalCode?: string;
  searchKeyword?: string;
}

export function findAllBooks(http: HttpClient, rootUrl: string, params?: FindAllBooks$Params, context?: HttpContext): Observable<StrictHttpResponse<PageResponseBookResponse>> {
  const rb = new RequestBuilder(rootUrl, findAllBooks.PATH, 'get');
  if (params) {
    rb.query('page', params.page, {});
    rb.query('size', params.size, {});
    rb.query('searchParameter', params.searchParameter, {});
    rb.query('state', params.state, {});
    rb.query('city', params.city, {});
    rb.query('postalCode', params.postalCode, {});
    rb.query('searchKeyword', params.searchKeyword, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PageResponseBookResponse>;
    })
  );
}

findAllBooks.PATH = '/books';
