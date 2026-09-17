# Book Social Network

## Deploying to Netlify

This repository is ready to deploy as a Netlify site. Import the Git repository in Netlify; it will read `netlify.toml` and run `npm run build`, publishing `dist/book-network-ui`.

API URLs are selected at build time:

- `npm start` / development builds use `http://localhost:8088`.
- Netlify production builds use the same-origin `/api` path, which Netlify proxies to `https://bca-finalyearproject-book-social-network.onrender.com`.

The Netlify proxy avoids browser CORS restrictions. It is still good practice to add the deployed Netlify site origin (for example, `https://your-site-name.netlify.app`) to the Render backend CORS configuration for any direct API clients.

## Google sign-in setup

1. In [Google Cloud Console](https://console.cloud.google.com/), create an OAuth 2.0 **Web application** client. Add `http://localhost:4200` and the deployed Netlify URL under **Authorized JavaScript origins**.
2. Copy the client ID (it is public) into `googleClientId` in both `src/environments/environment.ts` and `src/environments/environment.prod.ts`.
3. Set the same value as the `GOOGLE_CLIENT_ID` environment variable for the Spring backend locally and in Render. Do not put an OAuth client secret in the Angular application.

The backend verifies each Google ID token and returns the same application JWT as password login. A first-time Google user is created as an enabled `USER` account.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
