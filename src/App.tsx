import React from "react";
import auth from "solid-auth-client";
import "./App.css";

const App: React.FC = () => {
  auth.trackSession(session => {
    if (!session) console.log("The user is not logged in");
    else console.log(`The user is ${session.webId}`);
  });

  const signIn = () =>
    auth.login("https://stottle.inrupt.net/", {
      callbackUri: "http://localhost:3000"
    });

  const logout = () => auth.logout();

  return (
    <div className="App">
      <button onClick={signIn}>Sign in</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default App;
