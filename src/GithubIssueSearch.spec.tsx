import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GithubIssueSearch from "./GithubIssueSearch";

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

test("renders autocomplete text input", async () => {
  render(
    <GithubIssueSearch
      renderItem={() => <></>}
      onSelect={() => {}}
      debounceDelay={0}
      repo="facebook/react"
    />
  );

  const searchField = screen.getByPlaceholderText("Search");
  expect(searchField).toBeInTheDocument();
});

test("renders renderItem component for each result", async () => {
  const items = [
    { id: 10015, title: "Performance issue with rendering in IE8", labels: [] },
    { id: 11929, title: "IE8 lacks rotating animation at 120fps", labels: [] },
  ];
  mockFetchSearch(items);

  render(
    <GithubIssueSearch
      renderItem={(props) => <>xyZ{props.item.title}Cba</>}
      onSelect={() => {}}
      debounceDelay={0}
      repo="facebook/react"
    />
  );

  const searchField = screen.getByPlaceholderText("Search");
  fireEvent.focus(searchField);
  fireEvent.input(searchField, { target: { value: "IE8" } });

  const item1 = await screen.findByText(`xyZ${items[0].title}Cba`);
  const item2 = await screen.findByText(`xyZ${items[1].title}Cba`);
  expect(item1).toBeInTheDocument();
  expect(item2).toBeInTheDocument();
});

test("searches issues using github API", async () => {
  mockFetchSearch([]);
  render(
    <GithubIssueSearch
      renderItem={() => <></>}
      onSelect={() => {}}
      debounceDelay={0}
      repo="facebook/react"
    />
  );

  const searchField = screen.getByPlaceholderText("Search");
  fireEvent.focus(searchField);
  fireEvent.input(searchField, { target: { value: "IE8" } });

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.github.com/search/issues?q=IE8+in:title+is:issue+repo:facebook/react"
    );
  });
});

test("calls onSelect when item is clicked", async () => {
  const items = [
    { id: 10015, title: "Performance issue with rendering in IE8", labels: [] },
  ];
  mockFetchSearch(items);

  const onSelect = jest.fn();
  render(
    <GithubIssueSearch
      renderItem={(props) => <>{props.item.title}</>}
      onSelect={onSelect}
      debounceDelay={0}
      repo="facebook/react"
    />
  );

  const searchField = screen.getByPlaceholderText("Search");
  fireEvent.focus(searchField);
  fireEvent.input(searchField, { target: { value: "IE8" } });

  const item1 = await screen.findByText(`${items[0].title}`);
  fireEvent.click(item1);

  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onSelect).toHaveBeenCalledWith(items[0]);
});
