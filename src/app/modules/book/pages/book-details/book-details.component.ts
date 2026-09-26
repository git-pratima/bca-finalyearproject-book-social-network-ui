import {Component, OnInit} from '@angular/core';
import {BookResponse} from '../../../../services/models/book-response';
import {BookService} from '../../../../services/services/book.service';
import {ActivatedRoute} from '@angular/router';
import {FeedbackService} from '../../../../services/services/feedback.service';
import {PageResponseFeedbackResponse} from '../../../../services/models/page-response-feedback-response';
import {FeedbackResponse} from '../../../../services/models/feedback-response';
import { resolveBookCover } from '../../utils/book-cover';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  book: BookResponse = {};
  feedbacks: PageResponseFeedbackResponse = {};
  page = 0;
  size = 5;
  pages: any = [];
  message = '';
  messageType: 'success' | 'error' = 'success';
  isBorrowing = false;
  isBorrowRequestOpen = false;
  coverFailed = false;
  private bookId = 0;

  constructor(
    private bookService: BookService,
    private feedbackService: FeedbackService,
    private activatedRoute: ActivatedRoute
  ) {
  }
  ngOnInit(): void {
    this.bookId = this.activatedRoute.snapshot.params['bookId'];
    if (this.bookId) {
      this.bookService.findBookById({
        'book-id': this.bookId
      }).subscribe({
        next: (book) => {
          this.book = book;
          this.coverFailed = false;
          if (book.feedbackList === undefined) {
            this.findAllFeedbacks();
          }
        }
      });
    }
  }

  private findAllFeedbacks() {
    this.feedbackService.findAllFeedbacksByBook({
      'book-id': this.bookId,
      page: this.page,
      size: this.size
    }).subscribe({
      next: (data) => {
        this.feedbacks = data;
        this.pages = Array(data.totalPages || 0).fill(0).map((_, index) => index);
      }
    });
  }

  gotToPage(page: number) {
    this.page = page;
    this.findAllFeedbacks();
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllFeedbacks();
  }

  goToPreviousPage() {
    if (this.page > 0) {
      this.page--;
      this.findAllFeedbacks();
    }
  }

  goToLastPage() {
    if ((this.feedbacks.totalPages || 0) > 0) {
      this.page = (this.feedbacks.totalPages as number) - 1;
      this.findAllFeedbacks();
    }
  }

  goToNextPage() {
    if (!this.isLastPage) {
      this.page++;
      this.findAllFeedbacks();
    }
  }

  get isLastPage() {
    return this.page >= (this.feedbacks.totalPages || 1) - 1;
  }

  get displayedFeedbacks(): FeedbackResponse[] {
    return this.book.feedbackList ?? this.feedbacks.content ?? [];
  }

  get displayedFeedbackCount(): number {
    return this.book.feedbackList?.length ?? this.feedbacks.totalElements ?? 0;
  }

  get averageRating(): number {
    return this.book.averageRating ?? this.book.rate ?? 0;
  }

  get addressLines(): string[] {
    const address = this.book.bookAddress;
    if (!address) {
      return [];
    }
    const locality = [address.city, address.state, address.pin].filter(Boolean).join(', ');
    return [address.addressLine1, address.addressLine2, address.landmark && `Near ${address.landmark}`, locality, address.country]
      .filter((line): line is string => !!line);
  }

  get coverSrc(): string | undefined {
    return this.coverFailed ? undefined : resolveBookCover(this.book);
  }

  onCoverError(): void {
    this.coverFailed = true;
  }

  borrowBook(): void {
    if (!this.book.id || !this.book.shareable || this.isBorrowing) {
      return;
    }
    this.message = '';
    this.isBorrowRequestOpen = true;
  }

  closeBorrowRequest(): void {
    this.isBorrowRequestOpen = false;
  }

  onBorrowRequestSubmitted(): void {
    this.isBorrowRequestOpen = false;
    this.messageType = 'success';
    this.message = 'Your borrow request has been submitted.';
  }

}
