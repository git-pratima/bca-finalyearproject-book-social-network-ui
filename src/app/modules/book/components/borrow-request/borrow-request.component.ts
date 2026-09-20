import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BookResponse} from '../../../../services/models/book-response';
import {BookBorrowRequest} from '../../../../services/models/book-borrow-request';
import {BookService} from '../../../../services/services/book.service';
import {resolveBookCover} from '../../utils/book-cover';
import {Router} from '@angular/router';

interface BorrowConfirmation {
  bookName?: string;
  borrowRequestId?: number;
  borrowFromDate?: string;
  borrowToDate?: string;
  returnPeriodDay?: number;
  finalReturnDate?: string;
  agreeToFollowPickupInstruction?: string;
  agreeToReturnBorrowedBookAtSameLocation?: string;
  comment?: string;
}

@Component({
  selector: 'app-borrow-request',
  templateUrl: './borrow-request.component.html',
  styleUrls: ['./borrow-request.component.scss']
})
export class BorrowRequestComponent {
  @Input() book: BookResponse = {};
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  borrowFromDate = '';
  borrowToDate = '';
  returnPeriodDay: number | null = null;
  comment = '';
  agreeToFollowPickupInstruction = false;
  agreeToReturnBorrowedBookAtSameLocation = false;
  isSubmitting = false;
  coverFailed = false;
  errorMessage = '';
  confirmation: BorrowConfirmation | null = null;
  confirmationMessage = '';

  constructor(
    private bookService: BookService,
    private router: Router
  ) {}

  get coverSrc(): string | undefined {
    return this.coverFailed ? undefined : resolveBookCover(this.book);
  }

  get finalReturnDate(): string {
    if (!this.borrowToDate || !this.returnPeriodDay || this.returnPeriodDay < 1 || this.returnPeriodDay > 7) {
      return '';
    }
    const date = new Date(`${this.borrowToDate}T10:00:00`);
    date.setDate(date.getDate() + this.returnPeriodDay);
    return this.toDateInputValue(date);
  }

  onCoverError(): void {
    this.coverFailed = true;
  }

  private toApiDateTime(value: string): string {
    return value.length === 10 ? `${value}T10:00:00` : value.length === 16 ? `${value}:00` : value;
  }

  private toDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  close(): void {
    if (!this.isSubmitting) {
      if (this.confirmation) {
        this.router.navigate(['/books']);
      }
      this.closed.emit();
    }
  }

  formatConfirmationDate(value?: string): string {
    if (!value) {
      return 'Not provided';
    }
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  }

  submit(form: NgForm): void {
    if (form.invalid || !this.book.id || !this.book.title || !this.returnPeriodDay || this.returnPeriodDay < 1 || this.returnPeriodDay > 7 || !this.finalReturnDate || this.isSubmitting) {
      return;
    }

    const request: BookBorrowRequest = {
      bookId: this.book.id,
      borrowFromDate: this.toApiDateTime(this.borrowFromDate),
      borrowToDate: this.toApiDateTime(this.borrowToDate),
      returnPeriodDay: this.returnPeriodDay,
      finalReturnDate: this.toApiDateTime(this.finalReturnDate),
      agreeToFollowPickupInstruction: 'YES',
      agreeToReturnBorrowedBookAtSameLocation: 'YES',
      comment: this.comment.trim()
    };

    this.isSubmitting = true;
    this.errorMessage = '';
    this.bookService.createBorrowRequest({body: request}).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        const result = response as {status?: {message?: string}; data?: BorrowConfirmation};
        this.confirmation = result.data || null;
        this.confirmationMessage = result.status?.message || 'Book Borrow Request Submitted.';
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || error?.error?.error || 'We could not submit your request. Please try again.';
      }
    });
  }
}