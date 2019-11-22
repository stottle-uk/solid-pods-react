import { Observable, Subscriber } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import auth, { Session } from 'solid-auth-client';

export class AuthService {
  sessionStatus$ = new Observable<Session>(this.trackStatus);
  isAuthenticated$ = this.sessionStatus$.pipe(map(session => !!session));
  webId$ = this.sessionStatus$.pipe(
    filter(session => !!session),
    map(session => session.webId)
  );

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
