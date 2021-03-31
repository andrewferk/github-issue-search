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

const mockFetchSearch = (items: any) => {
  fetch.mockResolvedValueOnce({
    status: 200,
    json: async () => ({ items }),
  });
};

test("renders autocomplete for github issues", async () => {
  const items = [
    { id: 10015, title: "Performance issue with rendering in IE8", labels: [] },
  ];
  mockFetchSearch(items);

  render(<App />);

  const searchField = screen.getByPlaceholderText("Search");
  fireEvent.focus(searchField);
  fireEvent.input(searchField, { target: { value: "rendering" } });

  const result = await screen.findByText(items[0].title);
  expect(result).toBeInTheDocument();
});
