import React, { useState, ComponentType, useMemo, useEffect } from "react";
import debounce from "./debounce";
import styles from "./GithubAutocompleteSearch.module.css";
import { search } from "./search";
import { SearchIssue } from "./types";

type Props = {
  renderItem: ComponentType<{ item: SearchIssue }>;
  onSelect: (item: SearchIssue) => void;
  debounceDelay: number;
};
const GithubAutocompleteSearch = (props: Props) => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchIssue[]>([]);
  const [hasFocus, setHasFocus] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  const debounceSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        const res = await search(value);
        if (res.ok) {
          setItems(res.data.items);
          setActiveItem(0);
        }
      }, props.debounceDelay),
    [props.debounceDelay]
  );

  const handleItemSelect = useMemo(
    () => (item: SearchIssue) => {
      props.onSelect(item);
      setHasFocus(false);
      setActiveItem(0);
    },
    [props]
  );

  useEffect(() => {
    if (!hasFocus) return;
    const keydownHandler = (e: KeyboardEvent) => {
      if (items.length === 0) return;
      const keyFuncs: { [key: string]: Function } = {
        ArrowDown: () => setActiveItem((i) => (i + 1) % items.length),
        ArrowUp: () =>
          setActiveItem((i) => (items.length ? i - 1 : items.length - 1)),
        Enter: () => handleItemSelect(items[activeItem]),
      };
      const keyFunc = keyFuncs[e.key];
      if (!keyFunc) return;
      keyFunc();
      e.preventDefault();
    };
    window.addEventListener("keydown", keydownHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [hasFocus, items, handleItemSelect, activeItem]);

  const handleQueryChange = (value: string) => {
    setHasFocus(true);
    setQuery(value);
    if (value) {
      debounceSearch(value);
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
          onBlur={() => setHasFocus(false)}
          onFocus={() => setHasFocus(true)}
          className={styles.searchInput}
        />
        {hasFocus && items.length > 0 && (
          <ul className={styles.resultList}>
            {items.map((item, i) => (
              <li
                key={item.id}
                className={`${styles.resultItem} ${
                  i === activeItem ? styles.activeItem : ""
                }`}
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
