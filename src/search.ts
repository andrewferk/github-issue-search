import { SearchIssuesResponse, Ok } from "./types";

export const searchGithubIssues = async (
  repo: string,
  value: string
): Promise<Ok<SearchIssuesResponse>> => {
  const res = await fetch(
    `https://api.github.com/search/issues?q=${value}+in:title+is:issue+repo:${repo}`
  );
  const json = await res.json();

  if (res.status >= 400 && res.status < 500) {
    return {
      ok: false,
      error: json.message,
    };
  }

  return {
    ok: true,
    data: json,
  };
};
