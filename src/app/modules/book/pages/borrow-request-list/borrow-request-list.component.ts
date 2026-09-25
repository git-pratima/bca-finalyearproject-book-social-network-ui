import {Component, OnInit} from '@angular/core';
import {BookService} from '../../../../services/services/book.service';
import {BorrowRequestResponse} from '../../../../services/models/borrow-request-response';
import {PageResponseBorrowRequestResponse} from '../../../../services/models/page-response-borrow-request-response';

@Component({
  selector: 'app-borrow-request-list',
  templateUrl: './borrow-request-list.component.html',
  styleUrls: ['./borrow-request-list.component.scss', './borrow-request-list-status.scss', './borrow-request-list-status-overrides.scss', './borrow-request-list-filters.scss', './borrow-request-list-filter-overrides.scss', './borrow-request-update.scss', './borrow-request-list-header-overrides.scss']
})
export class BorrowRequestListComponent implements OnInit {
  requests: PageResponseBorrowRequestResponse = {};
  page = 0;
  size = 5;
  pages: number[] = [];
  selectedRequest: BorrowRequestResponse | null = null;
  isLoading = false;
  errorMessage = '';
  status: '' | 'SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'RETURNREQUEST' | 'RETURNAPPROVED' | 'RETURNCANCEL' | 'CANCEL' = '';
  searchParameter: 'title' | 'authorName' | 'isbn' = 'title';
  searchKeyword = '';
  updateStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | 'RETURNAPPROVED' | 'RETURNCANCEL' = 'PENDING';
  updateShareable = true;
  updateArchived = false;
  newComment = '';
  isUpdatingRequest = false;
  updateMessage = '';
  updateError = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.bookService.findAllBorrowRequests({
      page: this.page,
      size: this.size,
      status: this.status || undefined,
      searchParameter: this.searchKeyword.trim() ? this.searchParameter : undefined,
      searchKeyword: this.searchKeyword.trim() || undefined
    }).subscribe({
      next: (requests) => {
        this.requests = requests;
        this.pages = Array.from({length: requests.totalPages || 0}, (_, index) => index);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load your borrow requests. Please try again.';
      }
    });
  }

  applyFilters(): void {
    this.page = 0;
    this.loadRequests();
  }

  clearFilters(): void {
    this.status = '';
    this.searchParameter = 'title';
    this.searchKeyword = '';
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= (this.requests.totalPages || 0) || page === this.page) {
      return;
    }
    this.page = page;
    this.loadRequests();
  }

  get isFirstPage(): boolean {
    return this.page === 0;
  }

  get isLastPage(): boolean {
    return this.page >= (this.requests.totalPages || 1) - 1;
  }

  selectRequest(request: BorrowRequestResponse): void {
    this.selectedRequest = request;
    this.updateStatus = request.status === 'RETURNREQUEST' ? 'RETURNAPPROVED' : request.status === 'APPROVED' || request.status === 'REJECTED' ? request.status : 'PENDING';
    this.updateShareable = true;
    this.updateArchived = false;
    this.newComment = '';
    this.updateMessage = '';
    this.updateError = '';
  }

  closeDetails(): void {
    this.selectedRequest = null;
  }

  getUpdateStatusOptions(): Array<{ label: string; value: 'APPROVED' | 'PENDING' | 'REJECTED' | 'RETURNAPPROVED' | 'RETURNCANCEL' }> {
    if (this.selectedRequest?.status === 'RETURNREQUEST') {
      return [
        { label: 'Approve Return', value: 'RETURNAPPROVED' },
        { label: 'Cancel Return', value: 'RETURNCANCEL' }
      ];
    }
    return [
      { label: 'Approved', value: 'APPROVED' },
      { label: 'Pending', value: 'PENDING' },
      { label: 'Rejected', value: 'REJECTED' }
    ];
  }

  updateBorrowRequest(): void {
    if (!this.selectedRequest?.bookId || !this.selectedRequest.borrowRequestId) {
      this.updateError = 'Book and request details are required.';
      return;
    }

    this.isUpdatingRequest = true;
    this.updateMessage = '';
    this.updateError = '';
    const comment = this.newComment.trim();
    const datedComment = comment ? `${this.formatCommentDate()}: ${comment}` : '';
    const newComment = [this.selectedRequest.comment?.trim(), datedComment].filter(Boolean).join('\n');
    this.bookService.updateBorrowRequest({
      body: {
        bookId: Number(this.selectedRequest.bookId),
        borrowRequestId: this.selectedRequest.borrowRequestId,
        shareable: this.updateShareable,
        archived: this.updateArchived,
        status: this.updateStatus,
        newComment
      }
    }).subscribe({
      next: (response) => {
        this.isUpdatingRequest = false;
        this.selectedRequest = null;
        this.loadRequests();
      },
      error: () => {
        this.isUpdatingRequest = false;
        this.updateError = 'Unable to update this borrow request. Please try again.';
      }
    });
  }

  formatDate(value?: string): string {
    if (!value) {
      return 'Not provided';
    }
    return new Intl.DateTimeFormat('en', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(value));
  }

  formatCommentDate(): string {
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(date.getDate()).padStart(2, '0')}-${months[date.getMonth()]}`;
  }

  statusClass(status?: string): string {
    return `status-${(status || 'pending').toLowerCase()}`;
  }

  statusLabel(status?: string): string {
    if (status === 'RETURNREQUEST') { return 'Return Request Submitted'; }
    if (status === 'RETURNAPPROVED') { return 'Return Approved'; }
    if (status === 'RETURNCANCEL') { return 'Return Cancel'; }
    return status ? status.charAt(0) + status.slice(1).toLowerCase() : 'Pending';
  }
}
