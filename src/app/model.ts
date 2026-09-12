export type Action = 'Réviser' | 'Afficher' | 'Statistiques';

export interface StatistiqueReponses {
  min: number;
  max: number;
  moy: number;
  ecartType: number;
  vuesSurLEnsemble: number;
  reponsesCorrectesSurLEnsemble: number;
  reponsesIncorrectesSurLEnsemble: number;
  reponses: Array<Reponse>;
}

// pour une question de type X fois Y = Z, trouver Y
export interface Reponse {
  tempsMillisecondes: number;
  correcte: boolean;
  nombre: number;
  operande: number;
  reponse: number;
  repetitions?: number;
  prochaineRevision?: number;
}

export interface Question {
  nombre: number;
  operande: number;
  total?: number;
  dateDebut: Date;
  finie: boolean;
}

export interface VersionData {
  version?: string;
  shortSHA?: string;
  lastCommitTime?: Date;
}
