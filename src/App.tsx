import React from 'react';
import './App.css';
import UserProfile from './solid/profile/components/UserProfile';
import { authService } from './solid/shared';
import FilesList from './solid/storage/components/FilesList';

const App: React.FC = () => {
  const signIn = () => authService.signIn('https://stottle.solid.community/');
  const logout = () => authService.logout();

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
