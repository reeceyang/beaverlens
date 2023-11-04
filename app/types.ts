export enum SortOption {
  NONE = "none",
  TIME_ASC = "time_asc",
  TIME_DESC = "time_desc",
}

export const CONFESSIONS_PER_PAGE = 10;

export interface Confession {
  _id: string;
  post_text: string;
  time: string;
  post_url: string;
}

export interface SearchResponse {
  confessions: Array<Confession>;
  total_num: number;
}

export type SearchRequest = {
  query: string;
  fuzzy?: string;
  num?: string;
  page?: string;
  sort: SortOption;
};