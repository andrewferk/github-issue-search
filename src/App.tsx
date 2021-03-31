import React, { useState } from "react";
import GithubAutocompleteSearch from "./GithubAutocompleteSearch";
import { SearchIssue } from "./types";

const App = () => {
  const [item, setItem] = useState<SearchIssue>();

  return (
    <div className="App">
      <GithubAutocompleteSearch
        renderItem={({ item }) => (
          <>
            <strong>Title:</strong> {item.title}
            <br />
            <strong>Labels: </strong>{" "}
            {item.labels.map((l) => l.name).join(", ")}
          </>
        )}
        onSelect={setItem}
        debounceDelay={600}
      />
      <h2>Selected Issue</h2>
      {item ? (
        <>
          <strong>Title: </strong>
          {item.title}
          <br />
          <strong>Labels: </strong>
          <ul>
            {item.labels.map((tag) => (
              <li key={tag.id}>{tag.name}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>No issue selected</p>
      )}
    </div>
  );
};

export default App;
