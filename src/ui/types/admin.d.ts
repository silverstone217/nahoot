export type StatusType =
  | "en cours"
  | "terminée"
  | "pas encore commencée"
  | "annulée"
  | "";

export type CompetitionType = {
  id: number;
  name: string;
  created_at: Date;
  status: StatusType;
};
