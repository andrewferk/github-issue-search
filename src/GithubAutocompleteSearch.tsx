import React, { useState, ComponentType, useRef } from "react";
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
  onSelect: (item: SearchIssue) => void;
};
const GithubAutocompleteSearch = (props: Props) => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchIssue[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const [hasFocus, setHasFocus] = useState(false);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (value) {
      debounceSearch(value, setItems);
    } else {
      debounceSearch.cancel();
      setItems([]);
    }
  };

  const handleItemSelect = (item: SearchIssue) => {
    props.onSelect(item);
    setHasFocus(false);
    if (searchRef.current !== null) {
      searchRef.current.blur();
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
          onBlur={() => setHasFocus(false)}
          onFocus={() => setHasFocus(true)}
          className={styles.searchInput}
          ref={searchRef}
        />
        {hasFocus && items.length > 0 && (
          <ul className={styles.resultList}>
            {items.map((item) => (
              <li
                key={item.id}
                className={styles.resultItem}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleItemSelect(item)}
              >
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
