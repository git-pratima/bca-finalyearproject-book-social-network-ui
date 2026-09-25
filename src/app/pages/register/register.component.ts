import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/services/authentication.service';
import {RegistrationRequest} from '../../services/models/registration-request';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerRequest: RegistrationRequest = {email: '', firstname: '', lastname: '', password: ''};
  confirmPassword = '';
  errorMsg: Array<string> = [];
  showPassword = false;

  get passwordsMatch(): boolean {
    return this.registerRequest.password === this.confirmPassword;
  }

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
  }

  login() {
    this.router.navigate(['login']);
  }

  register() {
    if (!this.passwordsMatch) {
      this.errorMsg = ['Passwords do not match.'];
      return;
    }

    this.errorMsg = [];
    this.authService.register({
      body: this.registerRequest
    })
      .subscribe({
        next: (response) => {
          const registrationMessage = (response as { status?: { message?: string } })
            .status?.message;

          this.router.navigate(['activate-account'], {
            state: { registrationMessage }
          });
        },
        error: (err) => {
          this.errorMsg = err.error.validationErrors;
        }
      });
  }
}
