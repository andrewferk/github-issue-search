export type SearchIssue = {
  id: number;
  title: string;
  url: string;
  labels: {
    id: number;
    name: string;
    color: string;
  }[];
};

export type SearchIssuesResponse = {
  total_count: number;
  items: SearchIssue[];
};
