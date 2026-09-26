import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { BookCardComponent } from './book-card.component';
import { WatchlistService } from '../../../../services/services/watchlist.service';
import { RatingComponent } from '../rating/rating.component';

describe('BookCardComponent', () => {
  let component: BookCardComponent;
  let fixture: ComponentFixture<BookCardComponent>;
  let watchlistService: jasmine.SpyObj<WatchlistService>;

  beforeEach(() => {
    watchlistService = jasmine.createSpyObj<WatchlistService>('WatchlistService', ['toggleBook']);
    TestBed.configureTestingModule({
      declarations: [BookCardComponent, RatingComponent],
      providers: [{ provide: WatchlistService, useValue: watchlistService }]
    });
    fixture = TestBed.createComponent(BookCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggles watchlist state after the request succeeds', () => {
    watchlistService.toggleBook.and.returnValue(of(undefined));
    component.book = { id: 1, watchlisted: false };

    component.toggleWatchlist(new Event('click'));

    expect(watchlistService.toggleBook).toHaveBeenCalledWith(1);
    expect(component.book.watchlisted).toBeTrue();
  });
});
