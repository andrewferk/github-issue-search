export const search = async (value: string) => {
  const res = await fetch(
    `https://api.github.com/search/issues?q=${value}+in:title+is:issue+repo:facebook/react`
  );
  const json = await res.json();
  return json;
};
