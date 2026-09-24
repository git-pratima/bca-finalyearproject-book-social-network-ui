import { BorrowRequestResponse } from './borrow-request-response';

export interface ReturnedBookRequestResponse extends BorrowRequestResponse {
  author?: string;
  isbn?: string;
}
