/* tslint:disable */
/* eslint-disable */
import { BorrowRequestResponse } from './borrow-request-response';

export interface PageResponseBorrowRequestResponse {
  content?: Array<BorrowRequestResponse>;
  first?: boolean;
  last?: boolean;
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}
