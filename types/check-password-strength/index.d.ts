declare module "check-password-strength" {
  // model
  export class PasswordStrength {
    id: number;
    value: string;
    length: number;
    contains: string;
  }
  export type PasswordResponse = {
    value: string;
    id: 0 | 1 | 2 | 3;
    length: number;
    contains: string;
  };
  export function passwordStrength(value: string): PasswordResponse;
}
