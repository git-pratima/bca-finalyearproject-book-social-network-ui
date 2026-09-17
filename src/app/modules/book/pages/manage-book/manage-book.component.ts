import {Component, OnInit} from '@angular/core';
import {BookRequest} from '../../../../services/models/book-request';
import {BookService} from '../../../../services/services/book.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BookAddress} from '../../../../services/models/book-address';
import { resolveBookCover } from '../../utils/book-cover';

@Component({
  selector: 'app-manage-book',
  templateUrl: './manage-book.component.html',
  styleUrls: ['./manage-book.component.scss']
})
export class ManageBookComponent implements OnInit {

  errorMsg: Array<string> = [];
  bookRequest: BookRequest = {
    authorName: '',
    isbn: '',
    synopsis: '',
    title: '',
    shareable: true,
    bookAddress: this.emptyAddress()
  };
  selectedBookCover: any;
  selectedPicture: string | undefined;
  isEditMode = false;

  constructor(
    private bookService: BookService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const bookId = this.activatedRoute.snapshot.params['bookId'];
    if (bookId) {
      this.isEditMode = true;
      this.bookService.findBookById({
        'book-id': bookId
      }).subscribe({
        next: (book) => {
         this.bookRequest = {
           id: book.id,
           title: book.title as string,
           authorName: book.authorName as string,
           isbn: book.isbn as string,
           synopsis: book.synopsis as string,
           shareable: book.shareable,
           bookAddress: {...this.emptyAddress(), ...book.bookAddress},
           pickUpLocation: book.pickUpLocation || '',
           pickupInstructions: book.pickupInstructions || ''
         };
         this.selectedPicture = resolveBookCover(book);
        }
      });
    }
  }

  saveBook() {
    this.errorMsg = [];
    this.bookService.saveBook({
      body: this.bookRequest
    }).subscribe({
      next: (bookId) => {
        if (!this.selectedBookCover) {
          this.router.navigate(['/books/my-books']);
          return;
        }
        this.bookService.uploadBookCoverPicture({
          'book-id': bookId,
          body: {
            file: this.selectedBookCover
          }
        }).subscribe({
          next: () => {
            this.router.navigate(['/books/my-books']);
          }
        });
      },
      error: (err) => {
        console.log(err.error);
        this.errorMsg = err.error?.validationErrors || [err.error?.errorMsg || 'Unable to save this book. Please try again.'];
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedBookCover = event.target.files[0];
    if (this.selectedBookCover) {

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      };
      reader.readAsDataURL(this.selectedBookCover);
    }
  }

  private emptyAddress(): BookAddress {
    return { addressLine1: '', addressLine2: '', landmark: '', city: '', state: '', country: 'India', pin: '' };
  }
}
