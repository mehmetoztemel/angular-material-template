import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { AppConfig } from '../../app.config';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor destinations', () => {
  let previous: string | null;
  beforeEach(() => {
    previous = localStorage.getItem('Token');
    localStorage.setItem('Token', 'test-token');
  });
  afterEach(() => {
    if (previous === null) localStorage.removeItem('Token');
    else localStorage.setItem('Token', previous);
  });
  it('adds the token to the configured application API', () => {
    const config = new AppConfig();
    let sent: HttpRequest<unknown>;
    const next: HttpHandler = {
      handle: (request) => {
        sent = request;
        return of(new HttpResponse());
      },
    };
    new AuthInterceptor(config).intercept(
      new HttpRequest('GET', config.ApiUrl + 'facilities/'),
      next,
    );
    expect(sent.headers.get('Authorization')).toBe('Bearer test-token');
  });
  it('does not add the application token to address or map providers', () => {
    let sent: HttpRequest<unknown>;
    const next: HttpHandler = {
      handle: (request) => {
        sent = request;
        return of(new HttpResponse());
      },
    };
    new AuthInterceptor(new AppConfig()).intercept(
      new HttpRequest(
        'GET',
        'https://nominatim.openstreetmap.org/search?q=Ankara',
      ),
      next,
    );
    expect(sent.headers.has('Authorization')).toBeFalse();
  });
});
