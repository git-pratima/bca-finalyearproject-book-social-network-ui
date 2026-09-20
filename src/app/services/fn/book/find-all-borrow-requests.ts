/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { PageResponseBorrowRequestResponse } from '../../models/page-response-borrow-request-response';

export interface FindAllBorrowRequests$Params {
  page?: number;
  size?: number;
}

export interface BorrowRequestListResponse {
  status?: { status?: number; message?: string };
  data?: PageResponseBorrowRequestResponse;
}

export function findAllBorrowRequests(http: HttpClient, rootUrl: string, params?: FindAllBorrowRequests$Params, context?: HttpContext): Observable<StrictHttpResponse<BorrowRequestListResponse>> {
  const rb = new RequestBuilder(rootUrl, findAllBorrowRequests.PATH, 'get');
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

findAllBorrowRequests.PATH = '/books/borrow-request';
