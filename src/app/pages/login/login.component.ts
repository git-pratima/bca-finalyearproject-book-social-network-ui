import {AfterViewInit, Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/services/authentication.service';
import {AuthenticationRequest} from '../../services/models/authentication-request';
import {TokenService} from '../../services/token/token.service';
import {GoogleAuthenticationService} from '../../services/google-authentication.service';
import {AuthenticationResponse} from '../../services/models/authentication-response';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleButton') googleButton?: ElementRef<HTMLElement>;
  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg: Array<string> = [];
  showPassword = false;
  googleConfigured = Boolean(environment.googleClientId);

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private googleAuthenticationService: GoogleAuthenticationService,
    private zone: NgZone
  ) {
  }

  ngAfterViewInit() {
    if (this.googleConfigured) {
      this.loadGoogleIdentityServices()
        .then(() => this.renderGoogleButton())
        .catch(() => this.errorMsg = ['Unable to load Google Sign-In. Please try again.']);
    }
  }

  login() {
    this.errorMsg = [];
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        this.completeLogin(res);
      },
      error: (err) => this.showLoginError(err)
    });
  }

  private renderGoogleButton() {
    const google = (window as any).google;
    if (!google || !this.googleButton) {
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: { credential: string }) => this.zone.run(() => this.googleLogin(response.credential))
    });
    google.accounts.id.renderButton(this.googleButton.nativeElement, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      width: 360
    });
  }

  private googleLogin(credential: string) {
    this.errorMsg = [];
    this.googleAuthenticationService.authenticate(credential).subscribe({
      next: (res) => this.completeLogin(res),
      error: (err) => this.showLoginError(err)
    });
  }

  private completeLogin(res: AuthenticationResponse) {
    this.tokenService.token = res.token as string;
    localStorage.setItem('userId', String(res.userId ?? res.id ?? ''));
    localStorage.setItem('userName', res.userName || '');
    localStorage.setItem('userEmail', res.userEmail || '');
    this.router.navigate(['books']);
  }

  private showLoginError(err: any) {
    this.errorMsg = err?.error?.validationErrors || [err?.error?.errorMsg || 'Unable to sign in. Please try again.'];
  }

  private loadGoogleIdentityServices(): Promise<void> {
    if ((window as any).google?.accounts?.id) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Unable to load Google Sign-In.'));
      document.head.appendChild(script);
    });
  }

  register() {
    this.router.navigate(['register']);
  }
}
