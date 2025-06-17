export interface Product {
  id?: number;
  id_investigador?: number;
  titulo?: string;
  DOI?: string;
  url?: string;
  anio?: number;
  linkCitas?: string;
  nombreInvest?: string;
  coautores?: [];
  tipo?: string;
  journal?: string;
}
