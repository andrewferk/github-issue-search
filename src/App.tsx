import React, { useState } from "react";
import "./App.css";
import { search } from "./search";
import debounce from "./debounce";

const debounceSearch = debounce(async (value: string, setResults: Function) => {
  const res = await search(value);
  setResults(res.items);
}, 600);

const App = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (value) {
      debounceSearch(value, setResults);
    } else {
      debounceSearch.cancel();
      setResults([]);
    }
  };

  return (
    <>
      <div className="autocomplete">
        <input
          type="string"
          placeholder="Search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          list="autocomplte-results"
        />
        {results.length > 0 && (
          <ul>
            {results.map((r) => (
              <li key={r.id}>{r.title}</li>
            ))}
          </ul>
        )}
      </div>

      <h2>Header</h2>
    </>
  );
};

export default App;
