import React, { useState } from "react";
import "./App.css";
import GithubAutocompleteSearch from "./GithubAutocompleteSearch";
import { SearchIssue } from "./types";

const App = () => {
  const [item, setItem] = useState<SearchIssue>();

  return (
    <div className="App">
      <GithubAutocompleteSearch
        renderItem={({ item }) => <>{item.title}</>}
        onSelect={setItem}
      />
      {item && <strong>{item.title}</strong>}
    </div>
  );
};

export default App;
