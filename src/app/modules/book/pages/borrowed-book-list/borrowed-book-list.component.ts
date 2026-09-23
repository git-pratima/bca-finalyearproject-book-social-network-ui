import {Component, OnInit} from '@angular/core';
import {BookService} from '../../../../services/services/book.service';
import {BorrowRequestResponse} from '../../../../services/models/borrow-request-response';
import {PageResponseBorrowRequestResponse} from '../../../../services/models/page-response-borrow-request-response';

@Component({
  selector: 'app-borrowed-book-list',
  templateUrl: './borrowed-book-list.component.html',
  styleUrls: ['./borrowed-book-list.component.scss', './borrowed-book-list-filter-overrides.scss', './borrowed-book-list-header-overrides.scss']
})
export class BorrowedBookListComponent implements OnInit {
  borrowedRequests: PageResponseBorrowRequestResponse = {};
  page = 0;
  size = 5;
  pages: number[] = [];
  selectedRequest: BorrowRequestResponse | null = null;
  isLoading = false;
  errorMessage = '';
  status: '' | 'SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'CANCEL' = '';
  searchParameter: 'title' | 'authorName' | 'isbn' = 'title';
  searchKeyword = '';

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
  selectRequest(request: BorrowRequestResponse): void { this.selectedRequest = request; }
  closeDetails(): void { this.selectedRequest = null; }

  formatDate(value?: string): string {
    if (!value) { return 'Not provided'; }
    return new Intl.DateTimeFormat('en', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(value));
  }

  statusClass(status?: string): string { return `status-${(status || 'pending').toLowerCase()}`; }
  statusLabel(status?: string): string { return status ? status.charAt(0) + status.slice(1).toLowerCase() : 'Pending'; }
}
