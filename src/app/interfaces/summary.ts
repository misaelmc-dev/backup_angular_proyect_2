export interface Summary {
    totalsPerType: TotalsPerType,
    totalsPerSource: TotalsPerSource,
    citedTotals: CitedTotals
}

export interface TotalsPerType {
  total: number;
  totalSinTipo: number;
  totalesPorTipo: Type[];
}

export interface Type {
  id_tipo: String;
  tipo: String;
  count: number;
}

export interface TotalsPerSource {
  doaj: number;
  scopus: number;
  conacyt: number;
  scielo: number;
  jcr: number;
  otros: number;
}

export interface CitedTotals {
  citados: number;
}
