import React from 'react';
import auth from 'solid-auth-client';
import './App.css';
import UserProfile from './solid/profile/components/UserProfile';
import FilesList from './solid/storage/components/FilesList';

const App: React.FC = () => {
  auth.trackSession(session => {
    if (!session) console.log('The user is not logged in');
    else console.log(`The user is ${session.webId}`);
  });

  const signIn = () =>
    auth.login('https://stottle.inrupt.net/', {
      callbackUri: 'http://localhost:3000'
    });

  const logout = () => auth.logout();

  return (
    <div className="App">
      <button onClick={signIn}>Sign in</button>
      <button onClick={logout}>Logout</button>
      <hr />
      <div>
        <UserProfile />
      </div>
      <hr />
      <div>
        <FilesList />
      </div>
    </div>
  );
};

export default App;
