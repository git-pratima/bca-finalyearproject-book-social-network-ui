import {Component, OnInit} from '@angular/core';
import {BookService} from '../../../../services/services/book.service';
import {BorrowRequestResponse} from '../../../../services/models/borrow-request-response';
import {PageResponseBorrowRequestResponse} from '../../../../services/models/page-response-borrow-request-response';

@Component({
  selector: 'app-borrowed-book-list',
  templateUrl: './borrowed-book-list.component.html',
  styleUrls: ['./borrowed-book-list.component.scss', './borrowed-book-list-filter-overrides.scss', './borrowed-book-list-status-overrides.scss', './borrowed-book-list-header-overrides.scss', '../borrow-request-list/borrow-request-update.scss']
})
export class BorrowedBookListComponent implements OnInit {
  borrowedRequests: PageResponseBorrowRequestResponse = {};
  page = 0;
  size = 5;
  pages: number[] = [];
  selectedRequest: BorrowRequestResponse | null = null;
  isLoading = false;
  errorMessage = '';
  status: '' | 'SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'RETURNREQUEST' | 'RETURNAPPROVED' | 'RETURNCANCEL' | 'CANCEL' = '';
  searchParameter: 'title' | 'authorName' | 'isbn' = 'title';
  searchKeyword = '';
  borrowedUpdateStatus: 'CANCEL' | 'RETURNREQUEST' | 'PENDING' = 'PENDING';
  isUpdatingBorrowedRequest = false;
  borrowedUpdateMessage = '';
  borrowedUpdateError = '';
  newComment = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBorrowedRequests();
  }

  loadBorrowedRequests(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.bookService.findAllBorrowedRequests({
      page: this.page,
      size: this.size,
      status: this.status || undefined,
      searchParameter: this.searchKeyword.trim() ? this.searchParameter : undefined,
      searchKeyword: this.searchKeyword.trim() || undefined
    }).subscribe({
      next: (requests) => {
        this.borrowedRequests = requests;
        this.pages = Array.from({length: requests.totalPages || 0}, (_, index) => index);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load your borrowed requests. Please try again.';
      }
    });
  }

  applyFilters(): void {
    this.page = 0;
    this.loadBorrowedRequests();
  }

  clearFilters(): void {
    this.status = '';
    this.searchParameter = 'title';
    this.searchKeyword = '';
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= (this.borrowedRequests.totalPages || 0) || page === this.page) {
      return;
    }
    this.page = page;
    this.loadBorrowedRequests();
  }

  get isFirstPage(): boolean { return this.page === 0; }
  get isLastPage(): boolean { return this.page >= (this.borrowedRequests.totalPages || 1) - 1; }

  selectRequest(request: BorrowRequestResponse): void {
    this.selectedRequest = request;
    this.borrowedUpdateStatus = this.getInitialBorrowedStatus(request.status);
    this.borrowedUpdateMessage = '';
    this.borrowedUpdateError = '';
    this.newComment = '';
  }

  closeDetails(): void { this.selectedRequest = null; }

  getInitialBorrowedStatus(status?: string): 'CANCEL' | 'RETURNREQUEST' | 'PENDING' {
    if (status === 'SUBMITTED') {
      return 'CANCEL';
    }
    if (status === 'APPROVED') {
      return 'RETURNREQUEST';
    }
    if (status === 'RETURNCANCEL') {
      return 'RETURNREQUEST';
    }
    return 'PENDING';
  }

  getBorrowedStatusOptions(status?: string): Array<{ label: string; value: 'CANCEL' | 'RETURNREQUEST' | 'PENDING' }> {
    if (status === 'SUBMITTED') {
      return [{ label: 'Cancel request', value: 'CANCEL' }];
    }
    if (status === 'APPROVED') {
      return [{ label: 'Return Request', value: 'RETURNREQUEST' }];
    }
    if (status === 'RETURNCANCEL') {
      return [{ label: 'Return Request', value: 'RETURNREQUEST' }];
    }
    if (status === 'PENDING') {
      return [{ label: 'Pending', value: 'PENDING' }];
    }
    return [];
  }

  submitBorrowedStatusUpdate(): void {
    if (!this.selectedRequest?.bookId || !this.selectedRequest.borrowRequestId) {
      this.borrowedUpdateError = 'Book and request details are required.';
      return;
    }

    this.isUpdatingBorrowedRequest = true;
    this.borrowedUpdateMessage = '';
    this.borrowedUpdateError = '';
    const newComment = [this.selectedRequest.comment, this.newComment.trim()].filter(Boolean).join('\n');

    this.bookService.updateBorrowRequest({
      body: {
        bookId: Number(this.selectedRequest.bookId),
        borrowRequestId: this.selectedRequest.borrowRequestId,
        shareable: true,
        archived: false,
        status: this.borrowedUpdateStatus as any,
        newComment
      }
    }).subscribe({
      next: () => {
        this.isUpdatingBorrowedRequest = false;
        this.borrowedUpdateMessage = 'Borrow request updated successfully.';
        this.closeDetails();
        this.loadBorrowedRequests();
      },
      error: () => {
        this.isUpdatingBorrowedRequest = false;
        this.borrowedUpdateError = 'Unable to update this borrow request. Please try again.';
      }
    });
  }

  formatDate(value?: string): string {
    if (!value) { return 'Not provided'; }
    return new Intl.DateTimeFormat('en', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(value));
  }

  statusClass(status?: string): string { return `status-${(status || 'pending').toLowerCase()}`; }
  statusLabel(status?: string): string {
    if (status === 'RETURNREQUEST') { return 'Return Request Submitted'; }
    if (status === 'RETURNAPPROVED') { return 'Return Approved'; }
    if (status === 'RETURNCANCEL') { return 'Return Cancel'; }
    return status ? status.charAt(0) + status.slice(1).toLowerCase() : 'Pending';
  }
}
