export interface UpdateBookBorrowRequest {
  bookId: number;
  borrowRequestId: number;
  shareable: boolean;
  archived: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'RETURNAPPROVED' | 'RETURNCANCEL';
  newComment?: string;
  feedbackRequest?: {
    bookId: number;
    rating: number;
    comment: string;
  };
}
