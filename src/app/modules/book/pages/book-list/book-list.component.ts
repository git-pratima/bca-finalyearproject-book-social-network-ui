import {Component, OnInit} from '@angular/core';
import {BookService} from '../../../../services/services/book.service';
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';
import {BookResponse} from '../../../../services/models/book-response';
import {Router} from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss', './book-list-overrides.scss', './book-list-mybook-style.scss', './book-list-filters.scss']
})
export class BookListComponent implements OnInit {
  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 10;
  pages: any = [];
  message = '';
  level: 'success' |'error' = 'success';
  searchParameter: 'title' | 'authorName' | 'isbn' | 'address' = 'title';
  addressSearchParameter: 'title' | 'authorName' | 'isbn' = 'title';
  searchKeyword = '';
  state = '';
  city = '';
  postalCode = '';
  sortOption: 'featured' | 'title' | 'rating' = 'featured';
  borrowBookSelection: BookResponse | null = null;

  constructor(
    private bookService: BookService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.findAllBooks();
  }

  private findAllBooks() {
    this.bookService.findAllBooks({
      page: this.page,
      size: this.size,
      searchParameter: this.isAddressSearch ? this.addressSearchParameter : this.searchParameter,
      state: this.isAddressSearch ? this.state.trim() || undefined : undefined,
      city: this.isAddressSearch ? this.city.trim() || undefined : undefined,
      postalCode: this.isAddressSearch ? this.postalCode.trim() || undefined : undefined,
      searchKeyword: this.searchKeyword.trim() || undefined
    })
      .subscribe({
        next: (books) => {
          this.bookResponse = books;
          this.pages = Array(this.bookResponse.totalPages)
            .fill(0)
            .map((x, i) => i);
        }
      });
  }

  gotToPage(page: number) {
    this.page = page;
    this.findAllBooks();
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllBooks();
  }

  goToPreviousPage() {
    this.page --;
    this.findAllBooks();
  }

  goToLastPage() {
    this.page = this.bookResponse.totalPages as number - 1;
    this.findAllBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllBooks();
  }

  get isLastPage() {
    return this.page === this.bookResponse.totalPages as number - 1;
  }

  get visibleBooks(): BookResponse[] {
    return [...(this.bookResponse.content || [])].sort((first, second) => {
      if (this.sortOption === 'title') {
        return (first.title || '').localeCompare(second.title || '');
      }
      if (this.sortOption === 'rating') {
        return (second.rate || 0) - (first.rate || 0);
      }
      return 0;
    });
  }

  get isAddressSearch(): boolean {
    return this.searchParameter === 'address';
  }

  applyFilters(): void {
    this.page = 0;
    this.findAllBooks();
  }

  clearFilters(): void {
    this.searchParameter = 'title';
    this.addressSearchParameter = 'title';
    this.searchKeyword = '';
    this.state = '';
    this.city = '';
    this.postalCode = '';
    this.applyFilters();
  }

  updateSort(value: string) {
    this.sortOption = value as 'featured' | 'title' | 'rating';
  }

  borrowBook(book: BookResponse) {
    this.borrowBookSelection = book;
  }

  closeBorrowRequest() {
    this.borrowBookSelection = null;
  }

  onBorrowRequestSubmitted() {
    this.borrowBookSelection = null;
    this.level = 'success';
    this.message = 'Borrow request submitted successfully';
  }

  displayBookDetails(book: BookResponse) {
    this.router.navigate(['books', 'details', book.id]);
  }
}
