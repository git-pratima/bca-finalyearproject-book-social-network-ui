import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowedBookListComponent } from './borrowed-book-list.component';

describe('BorrowedBookListComponent', () => {
  let component: BorrowedBookListComponent;
  let fixture: ComponentFixture<BorrowedBookListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BorrowedBookListComponent],
      imports: [FormsModule, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(BorrowedBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose CANCEL for submitted requests, RETURNREQUEST for approved requests, and PENDING for pending requests', () => {
    expect(component.getBorrowedStatusOptions('SUBMITTED')).toEqual([
      { label: 'Cancel request', value: 'CANCEL' }
    ]);

    expect(component.getBorrowedStatusOptions('APPROVED')).toEqual([
      { label: 'Return Request', value: 'RETURNREQUEST' }
    ]);

    expect(component.getBorrowedStatusOptions('PENDING')).toEqual([
      { label: 'Pending', value: 'PENDING' }
    ]);
  });
});
