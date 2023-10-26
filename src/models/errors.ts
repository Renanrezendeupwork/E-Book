export interface ErrorItem {
  msg?: string | null;
}

export type ErrorType = {
  message: string;
  reason?: string;
  type?: string;
  color?: ErrorColors;
  stop?: boolean;
};

export type ErrorColors =
  | "text-danger"
  | "text-warning"
  | "text-success"
  | "text-danger";
