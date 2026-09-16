import { Component } from '@angular/core';
import { ThemeService } from './services/theme/theme.service';
import { LoadingService } from './services/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'book-network-ui';
  loading$ = this.loadingService.loading$;

  constructor(
    private themeService: ThemeService,
    private loadingService: LoadingService
  ) {
    this.themeService.initialize();
  }
}
