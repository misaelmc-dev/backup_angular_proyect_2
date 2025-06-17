import {Link} from "./link";

export interface Source {
  id: number;
  titulo: string;
  publisher: string;
  rights_uri: string;
}

export interface SourcePageable {
  current_page: number;
  data: Source [];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string;
  path: string;
  per_page: string;
  prev_page_url: string;
  to: number;
  total: number;
}
