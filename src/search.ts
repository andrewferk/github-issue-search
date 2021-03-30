import { SearchIssuesResponse } from "./types";

type Ok<T> =
  | {
      ok: true;
      data: T;
    }
  | { ok: false; error: string };

export const search = async (
  value: string
): Promise<Ok<SearchIssuesResponse>> => {
  const res = await fetch(
    `https://api.github.com/search/issues?q=${value}+in:title+is:issue+repo:facebook/react`
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
