import {Component, OnInit} from '@angular/core';
import {PageResponseReturnedBookRequestResponse} from '../../../../services/models/page-response-returned-book-request-response';
import {BookService} from '../../../../services/services/book.service';
import {ReturnedBookRequestResponse} from '../../../../services/models/returned-book-request-response';

@Component({
  selector: 'app-returned-books',
  templateUrl: './returned-books.component.html',
  styleUrls: ['./returned-books.component.scss']
})
export class ReturnedBooksComponent implements OnInit {
  page = 0;
  size = 5;
  pages: any = [];
  returnedBooks: PageResponseReturnedBookRequestResponse = {};
  selectedBook: ReturnedBookRequestResponse | null = null;
  status: '' | 'RETURNREQUEST' | 'RETURNAPPROVED' | 'RETURNCANCEL' = 'RETURNAPPROVED';
  searchParameter: 'title' | 'authorName' | 'isbn' = 'title';
  searchKeyword = '';
  appliedStatus: '' | 'RETURNREQUEST' | 'RETURNAPPROVED' | 'RETURNCANCEL' = 'RETURNAPPROVED';
  appliedSearchParameter: 'title' | 'authorName' | 'isbn' = 'title';
  appliedSearchKeyword = '';
  isLoading = false;
  errorMessage = '';
  message = '';
  level: 'success' |'error' = 'success';
  constructor(
    private bookService: BookService
  ) {
  }

  ngOnInit(): void {
    this.findAllReturnedBooks();
  }

  findAllReturnedBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.bookService.findAllReturnedBooks({
      page: this.page,
      size: this.size,
      status: this.appliedStatus || undefined,
      searchParameter: this.appliedSearchKeyword.trim() ? this.appliedSearchParameter : undefined,
      searchKeyword: this.appliedSearchKeyword.trim() || undefined
    }).subscribe({
      next: (resp) => {
        this.returnedBooks = resp;
        this.pages = Array(this.returnedBooks.totalPages || 0)
          .fill(0)
          .map((x, i) => i);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load your returned books. Please try again.';
      }
    });
  }

  get filteredBooks(): ReturnedBookRequestResponse[] {
    const keyword = this.appliedSearchKeyword.trim().toLowerCase();
    return (this.returnedBooks.content || []).filter((book) => {
      const matchesStatus = !this.appliedStatus || this.getBookStatus(book) === this.appliedStatus;
      const value = (this.appliedSearchParameter === 'title' ? book.bookName : this.appliedSearchParameter === 'authorName' ? book.author : book[this.appliedSearchParameter]) || '';
      return matchesStatus && value.toLowerCase().includes(keyword);
    });
  }

  applyFilters(): void {
    this.appliedStatus = this.status;
    this.appliedSearchParameter = this.searchParameter;
    this.appliedSearchKeyword = this.searchKeyword;
    this.page = 0;
    this.findAllReturnedBooks();
  }

  clearFilters(): void {
    this.status = 'RETURNAPPROVED';
    this.searchParameter = 'title';
    this.searchKeyword = '';
    this.applyFilters();
  }
  selectBook(book: ReturnedBookRequestResponse): void { this.selectedBook = book; }
  closeDetails(): void { this.selectedBook = null; }
  getBookStatus(book: ReturnedBookRequestResponse): 'RETURNREQUEST' | 'RETURNAPPROVED' | 'RETURNCANCEL' {
    if (book.status === 'RETURNAPPROVED') { return 'RETURNAPPROVED'; }
    if (book.status === 'RETURNCANCEL') { return 'RETURNCANCEL'; }
    return 'RETURNREQUEST';
  }
  statusLabel(status: string): string {
    if (status === 'RETURNREQUEST') { return 'Return Request Submitted'; }
    if (status === 'RETURNAPPROVED') { return 'Return Approved'; }
    return 'Return Request Cancel';
  }

  gotToPage(page: number) {
    this.page = page;
    this.findAllReturnedBooks();
  }

  goToFirstPage(): void {
    this.page = 0;
    this.findAllReturnedBooks();
  }

  goToPreviousPage(): void {
    if (this.page === 0) { return; }
    this.page--;
    this.findAllReturnedBooks();
  }

  goToLastPage(): void {
    this.page = this.returnedBooks.totalPages as number - 1;
    this.findAllReturnedBooks();
  }

  goToNextPage(): void {
    if (this.isLastPage) { return; }
    this.page++;
    this.findAllReturnedBooks();
  }

  get isLastPage() {
    return this.page === this.returnedBooks.totalPages as number - 1;
  }

}
