/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PageResponseReturnedBookRequestResponse } from '../../models/page-response-returned-book-request-response';

export interface ReturnedBookListResponse {
  status?: { status?: number; message?: string };
  data?: PageResponseReturnedBookRequestResponse;
}

export interface FindAllReturnedBooks$Params {
  page?: number;
  size?: number;
  status?: string;
  searchParameter?: string;
  searchKeyword?: string;
}

export function findAllReturnedBooks(http: HttpClient, rootUrl: string, params?: FindAllReturnedBooks$Params, context?: HttpContext): Observable<StrictHttpResponse<ReturnedBookListResponse>> {
  const rb = new RequestBuilder(rootUrl, findAllReturnedBooks.PATH, 'get');
  if (params) {
    rb.query('page', params.page, {});
    rb.query('size', params.size, {});
    rb.query('status', params.status, {});
    rb.query('searchParameter', params.searchParameter, {});
    rb.query('searchKeyword', params.searchKeyword, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ReturnedBookListResponse>;
    })
  );
}

findAllReturnedBooks.PATH = '/books/returnbooks';
