/* tslint:disable */
/* eslint-disable */
import { BookAddress } from './book-address';

export interface BookRequest {
  authorName: string;
  bookAddress?: BookAddress;
  id?: number;
  isbn: string;
  pickUpLocation?: string;
  pickupInstructions?: string;
  shareable?: boolean;
  synopsis: string;
  title: string;
}
