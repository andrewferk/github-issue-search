import React, { useState, ComponentType } from "react";
import debounce from "./debounce";
import styles from "./GithubAutocompleteSearch.module.css";
import { search } from "./search";
import { SearchIssue } from "./types";

const debounceSearch = debounce(
  async (value: string, cb: (items: SearchIssue[]) => void) => {
    const res = await search(value);
    if (res.ok) {
      cb(res.data.items);
    }
  },
  600
);

type Props = {
  renderItem: ComponentType<{ item: SearchIssue }>;
};
const GithubAutocompleteSearch = (props: Props) => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchIssue[]>([]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (value) {
      debounceSearch(value, setItems);
    } else {
      debounceSearch.cancel();
      setItems([]);
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
        {items.length > 0 && (
          <ul className={styles.resultList}>
            {items.map((item) => (
              <li key={item.id} className={styles.resultItem}>
                <props.renderItem item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default GithubAutocompleteSearch;
