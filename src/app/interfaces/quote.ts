import {Link} from "./link";

export interface Quote {
  id?: number;
  titulo?: string;
  DOI?: string;
  url?: string;
  anio?: number;
  autocita_autor: boolean;
  autocita_journal: boolean;
  journal: string;
  nombreTipo?: string;
  idTipo?: string;
  producto: {};
  coautores: [];
}

export interface QuotePageable {
  current_page: number 
  data: Quote [];
  first_page_url: String;
  from: number;
  last_page: number;
  last_page_url: String;
  links: Link[];
  next_page_url: String;
  path: String;
  per_page: number;
  prev_page_url: String;
  to: number;
  total: number;
}
