import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BookResponse} from '../../../../services/models/book-response';
import {WatchlistService} from '../../../../services/services/watchlist.service';
import { resolveBookCover } from '../../utils/book-cover';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent {
  private _book: BookResponse = {};
  private _manage = false;
  private _discover = false;
  private coverFailed = false;
  watchlistLoading = false;
  watchlistError = false;

  constructor(private watchlistService: WatchlistService) {}

  get bookCover(): string | undefined {
    return this.coverFailed ? undefined : resolveBookCover(this._book);
  }

  get book(): BookResponse {
    return this._book;
  }

  @Input()
  set book(value: BookResponse) {
    this._book = value;
    this.coverFailed = false;
  }

  onCoverError(): void {
    this.coverFailed = true;
  }


  get manage(): boolean {
    return this._manage;
  }

  @Input()
  set manage(value: boolean) {
    this._manage = value;
  }

  get discover(): boolean {
    return this._discover;
  }

  @Input()
  set discover(value: boolean) {
    this._discover = value;
  }

  @Output() private addToWaitingList: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private borrow: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() edit: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();
  @Output() private details: EventEmitter<BookResponse> = new EventEmitter<BookResponse>();

  onAddToWaitingList() {
    this.addToWaitingList.emit(this._book);
  }

  onBorrow() {
    this.borrow.emit(this._book);
  }

  onEdit() {
    this.edit.emit(this._book);
  }

  onShowDetails() {
    this.details.emit(this._book);
  }

  toggleWatchlist(event: Event): void {
    event.stopPropagation();
    if (!this._book.id || this.watchlistLoading) {
      return;
    }

    this.watchlistLoading = true;
    this.watchlistError = false;
    this.watchlistService.toggleBook(this._book.id).subscribe({
      next: () => {
        this._book.watchlisted = !this._book.watchlisted;
        this.watchlistLoading = false;
      },
      error: () => {
        this.watchlistError = true;
        this.watchlistLoading = false;
      }
    });
  }
}
