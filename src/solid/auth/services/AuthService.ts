import { Observable, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import auth, { Session } from 'solid-auth-client';

export class AuthService {
  sessionStatus$ = new Observable<Session>(this.trackStatus);
  isAuthenticated$ = this.sessionStatus$.pipe(map(session => !!session));

  constructor(private store: any) {}

  //   register(idp: string): Promise<void> {
  //     return auth.(idp, {
  //       callbackUri: 'http://localhost:3000'
  //     });
  //   }

  signIn(idp: string): Promise<void> {
    return auth.login(idp, {
      callbackUri: 'http://localhost:3000'
    });
  }

  logout() {
    return auth.logout();
  }

  private trackStatus(observer: Subscriber<Session>) {
    auth.trackSession(session => observer.next(session));
  }
}
