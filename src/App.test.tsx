import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

let fetch: jest.Mock;
beforeAll(() => {
  jest.spyOn(window, "fetch");
  fetch = window.fetch as jest.Mock;
});
afterEach(() => {
  fetch.mockReset();
});

const mockFetchSearch = (items: { id: number; title: string }[]) => {
  fetch.mockResolvedValueOnce({
    status: 200,
    json: async () => ({ items }),
  });
};

test("renders autocomplete text input", async () => {
  const items = [
    { id: 10015, title: "Performance issue with rendering in IE8" },
  ];
  mockFetchSearch(items);

  render(<App />);

  const searchField = screen.getByPlaceholderText("Search");
  expect(searchField).toBeInTheDocument();
  fireEvent.focus(searchField);
  fireEvent.input(searchField, { target: { value: "rendering" } });

  const result = await screen.findByText(items[0].title);
  expect(result).toBeInTheDocument();

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(
    "https://api.github.com/search/issues?q=rendering+in:title+is:issue+repo:facebook/react"
  );
});
