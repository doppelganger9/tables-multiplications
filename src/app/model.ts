export type Action = 'Réviser' | 'Afficher';

export interface StatistiqueReponses {
  min: number;
  max: number;
  moy: number;
  vuesSurLEnsemble: number;
  reponsesCorrectesSurLEnsemble: number;
  reponses: Array<Reponse>;
}

// pour une question de type X fois Y = Z, trouver Y
export interface Reponse {
  tempsMillisecondes: number;
  correcte: boolean;
  nombre: number;
  operande: number;
  reponse: number;
}

export interface Question {
  nombre: number;
  operande: number;
  total?: number;
  dateDebut: Date;
  finie: boolean;
}
