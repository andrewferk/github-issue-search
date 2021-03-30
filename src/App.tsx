import React from "react";
import "./App.css";
import GithubAutocompleteSearch from "./GithubAutocompleteSearch";

const App = () => {
  return (
    <div className="App">
      <GithubAutocompleteSearch renderItem={({ item }) => <>{item.title}</>} />
    </div>
  );
};

export default App;
