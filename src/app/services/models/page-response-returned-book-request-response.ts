import { ReturnedBookRequestResponse } from './returned-book-request-response';

export interface PageResponseReturnedBookRequestResponse {
  content?: Array<ReturnedBookRequestResponse>;
  first?: boolean;
  last?: boolean;
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}
