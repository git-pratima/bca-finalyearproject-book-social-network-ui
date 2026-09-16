import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationResponse } from './models/authentication-response';
import { ApiConfiguration } from './api-configuration';

@Injectable({ providedIn: 'root' })
export class GoogleAuthenticationService {
  constructor(
    private http: HttpClient,
    private apiConfiguration: ApiConfiguration
  ) {}

  authenticate(credential: string): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      `${this.apiConfiguration.rootUrl}/auth/google`,
      { credential }
    );
  }
}
