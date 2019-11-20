import { Fetcher, graph, Namespace, sym } from 'rdflib';
import React from 'react';
import auth from 'solid-auth-client';
import './App.css';

const App: React.FC = () => {
  auth.trackSession(session => {
    if (!session) console.log('The user is not logged in');
    else console.log(`The user is ${session.webId}`);

    if (session) {
      const VCARD = Namespace('http://www.w3.org/2006/vcard/ns#');
      const AUTH = Namespace('http://www.w3.org/ns/auth/acl#');

      console.log(VCARD());
      console.log(AUTH());

      const store = graph();
      const fetcher = new Fetcher(store);

      // Load the person's data into the store
      const person = session.webId;
      fetcher.load(person).then(() => {
        console.log(person);

        const personSym = sym(person);

        // console.log(personSym.doc());

        // Display their details
        const fullName = store.any(personSym, VCARD('fn'));
        const note = store.any(personSym, VCARD('note'));
        const trustedApp = store.any(personSym, AUTH('trustedApp'));
        // console.log(store);
        console.log(trustedApp);
        console.log(fullName);
        console.log(note);
      });
    }
  });

  const signIn = () =>
    auth.login('https://stottle.inrupt.net/', {
      callbackUri: 'http://localhost:3000'
    });

  const logout = () => auth.logout();

  return (
    <div className='App'>
      <button onClick={signIn}>Sign in</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default App;
