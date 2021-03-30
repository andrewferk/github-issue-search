import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders search field", () => {
  render(<App />);
  const searchField = screen.getByPlaceholderText("Search");
  expect(searchField).toBeInTheDocument();
});
