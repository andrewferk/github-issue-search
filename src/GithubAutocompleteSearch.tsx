import React, { useState } from "react";
import debounce from "./debounce";
import styles from "./GithubAutocompleteSearch.module.css";
import { search } from "./search";

const debounceSearch = debounce(async (value: string, setResults: Function) => {
  const res = await search(value);
  setResults(res.items);
}, 600);

const GithubAutocompleteSearch = () => {
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
      <div className={styles.autocomplete}>
        <input
          type="string"
          placeholder="Search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          list="autocomplte-results"
          className={styles.searchInput}
        />
        {results.length > 0 && (
          <ul className={styles.resultList}>
            {results.map((r) => (
              <li key={r.id} className={styles.resultItem}>
                {r.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default GithubAutocompleteSearch;
