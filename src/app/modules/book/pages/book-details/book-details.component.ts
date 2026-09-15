import {Component, OnInit} from '@angular/core';
import {BookResponse} from '../../../../services/models/book-response';
import {BookService} from '../../../../services/services/book.service';
import {ActivatedRoute} from '@angular/router';
import {FeedbackService} from '../../../../services/services/feedback.service';
import {PageResponseFeedbackResponse} from '../../../../services/models/page-response-feedback-response';

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
          this.findAllFeedbacks();
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

  get addressLines(): string[] {
    const address = this.book.bookAddress;
    if (!address) {
      return [];
    }
    const locality = [address.city, address.state, address.pin].filter(Boolean).join(', ');
    return [address.addressLine1, address.addressLine2, address.landmark && `Near ${address.landmark}`, locality, address.country]
      .filter((line): line is string => !!line);
  }

  get coverSrc(): string {
    const cover = this.book.cover as unknown as string | string[] | undefined;
    const coverValue = Array.isArray(cover) ? cover[0] : cover;
    if (!coverValue) {
      return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80';
    }
    return coverValue.startsWith('data:') ? coverValue : `data:image/webp;base64,${coverValue}`;
  }

  borrowBook(): void {
    if (!this.book.id || !this.book.shareable || this.isBorrowing) {
      return;
    }
    this.isBorrowing = true;
    this.message = '';
    this.bookService.borrowBook({'book-id': this.book.id}).subscribe({
      next: () => {
        this.isBorrowing = false;
        this.messageType = 'success';
        this.message = 'Your borrow request has been added to your list.';
      },
      error: (error) => {
        this.isBorrowing = false;
        this.messageType = 'error';
        this.message = error?.error?.error || 'We could not submit your request. Please try again.';
      }
    });
  }

}
