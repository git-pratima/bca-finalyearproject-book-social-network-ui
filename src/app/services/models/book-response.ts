/* tslint:disable */
/* eslint-disable */
import { BookAddress } from './book-address';

export interface BookResponse {
  archived?: boolean;
  authorName?: string;
  bookAddress?: BookAddress;
  cover?: (string | Array<string>);
  id?: number;
  isbn?: string;
  owner?: string;
  pickUpLocation?: string;
  pickupInstructions?: string;
  rate?: number;
  shareable?: boolean;
  synopsis?: string;
  title?: string;
}
