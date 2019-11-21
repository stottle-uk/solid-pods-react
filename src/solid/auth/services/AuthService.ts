import auth from 'solid-auth-client';

export class AuthService {
  constructor(private store: any) {
    auth.trackSession(session => {
      if (!session) console.log('The user is not logged in');
      else console.log(`The user is ${session.webId}`);
    });
  }

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
}
