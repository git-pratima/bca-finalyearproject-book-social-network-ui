import {Component, OnInit} from '@angular/core';
import {BookService} from '../../../../services/services/book.service';
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';
import {BookResponse} from '../../../../services/models/book-response';
import {Router} from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss', './book-list-overrides.scss', './book-list-mybook-style.scss']
})
export class BookListComponent implements OnInit {
  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 10;
  pages: any = [];
  message = '';
  level: 'success' |'error' = 'success';
  searchTerm = '';
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
      size: this.size
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
    const query = this.searchTerm.trim().toLowerCase();
    const books = (this.bookResponse.content || []).filter((book) => {
      if (!query) {
        return true;
      }
      return [book.title, book.authorName, book.owner, book.isbn]
        .some((value) => value?.toLowerCase().includes(query));
    });

    return [...books].sort((first, second) => {
      if (this.sortOption === 'title') {
        return (first.title || '').localeCompare(second.title || '');
      }
      if (this.sortOption === 'rating') {
        return (second.rate || 0) - (first.rate || 0);
      }
      return 0;
    });
  }

  updateSearch(value: string) {
    this.searchTerm = value;
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
