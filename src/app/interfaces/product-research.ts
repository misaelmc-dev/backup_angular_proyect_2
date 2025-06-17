import {Link} from "./link";

export interface ProductResearch {
  id: number;
  titulo: string;
  DOI: string;
  url: string;
  publisher: string;
  anio: string;
  linkCitas: string;
  id_investigador: number;
  idTipo: string;
  nombreTipo: string;
  citedby: number;
  nombreInvest: string;
  coautores: [];
  fuente: string;
}

export interface ProductPageable {
  current_page: 1;
  data: ProductResearch [];
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
