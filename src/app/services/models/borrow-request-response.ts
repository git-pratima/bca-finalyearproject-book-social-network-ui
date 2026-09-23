/* tslint:disable */
/* eslint-disable */
export interface BorrowRequestResponse {
  bookId?: string;
  bookName?: string;
  bookCover?: string;
  borrowerName?: string;
  ownerName?: string;
  status?: 'SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED' | string;
  borrowRequestId?: number;
  borrowFromDate?: string;
  borrowToDate?: string;
  returnPeriodDay?: number;
  finalReturnDate?: string;
  agreeToFollowPickupInstruction?: string;
  agreeToReturnBorrowedBookAtSameLocation?: string;
  comment?: string;
}
