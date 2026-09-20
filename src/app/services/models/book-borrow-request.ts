/* tslint:disable */
/* eslint-disable */
export interface BookBorrowRequest {
  agreeToFollowPickupInstruction: 'YES' | 'NO';
  agreeToReturnBorrowedBookAtSameLocation: 'YES' | 'NO';
  bookId: number;
  borrowFromDate: string;
  borrowToDate: string;
  comment?: string;
  finalReturnDate: string;
  returnPeriodDay: number;
}
