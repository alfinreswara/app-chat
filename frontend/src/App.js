import React from "react";
import { Route } from "react-router-dom";
import ChatsPage from "./pages/ChatsPage";
import HomePages from "./pages/HomePage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Route path="/" component={HomePages} exact />
      <Route path="/chats" component={ChatsPage} />
    </div>
  );
}

export default App;
