/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { PageResponseBorrowRequestResponse } from '../../models/page-response-borrow-request-response';
import { BorrowRequestListResponse } from './find-all-borrow-requests';

export interface FindAllBorrowedRequests$Params {
  page?: number;
  size?: number;
}

export function findAllBorrowedRequests(http: HttpClient, rootUrl: string, params?: FindAllBorrowedRequests$Params, context?: HttpContext): Observable<StrictHttpResponse<BorrowRequestListResponse>> {
  const rb = new RequestBuilder(rootUrl, findAllBorrowedRequests.PATH, 'get');
  if (params) {
    rb.query('page', params.page, {});
    rb.query('size', params.size, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => r as StrictHttpResponse<BorrowRequestListResponse>)
  );
}

findAllBorrowedRequests.PATH = '/books/borrowed';
