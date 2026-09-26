import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookResponse } from '../../../../services/models/book-response';
import { WatchlistService } from '../../../../services/services/watchlist.service';
import { resolveBookCover } from '../../utils/book-cover';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  books: BookResponse[] = [];
  isLoading = false;
  errorMessage = '';
  private readonly pendingBookIds = new Set<number>();
  private readonly failedBookIds = new Set<number>();

  constructor(
    private watchlistService: WatchlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.watchlistService.getWatchlist().subscribe({
      next: books => {
        this.books = books;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load your watchlist. Please try again.';
        this.isLoading = false;
      }
    });
  }

  removeFromWatchlist(book: BookResponse): void {
    if (!book.id || this.pendingBookIds.has(book.id)) {
      return;
    }

    this.pendingBookIds.add(book.id);
    this.failedBookIds.delete(book.id);
    this.watchlistService.toggleBook(book.id).subscribe({
      next: () => {
        this.books = this.books.filter(item => item.id !== book.id);
        this.pendingBookIds.delete(book.id as number);
      },
      error: () => {
        this.failedBookIds.add(book.id as number);
        this.pendingBookIds.delete(book.id as number);
      }
    });
  }

  isPending(bookId?: number): boolean {
    return !!bookId && this.pendingBookIds.has(bookId);
  }

  hasError(bookId?: number): boolean {
    return !!bookId && this.failedBookIds.has(bookId);
  }

  bookCover(book: BookResponse): string | undefined {
    return resolveBookCover(book);
  }

  showBookDetails(book: BookResponse): void {
    if (book.id) {
      this.router.navigate(['books', 'details', book.id]);
    }
  }
}