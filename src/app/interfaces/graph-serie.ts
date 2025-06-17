export interface GraphSeries {
  id_l: number;
  nomb_l: string;
  cont: GraphSerieAnio[];
}

export interface GraphSerieAnio {
  anio: string;
  count: number;
}

export interface GraphSerieTipo {
  id: number,
  tipo: string;
  count: number;
}

export interface GraphSerieVis {
  vis: string;
  count: number;
}

export interface GraphSerieLinea {
  id: number,
  nombre: string;
  count: number;
}


