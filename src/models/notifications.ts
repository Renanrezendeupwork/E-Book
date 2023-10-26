export type NotificationType = {
  id: string;
  readed: boolean;
  message: string;
  key_string?: string;
  created_at: string;
  action: string;
  cta?: {
    text: string;
    text_done: string;
    mutation: string;
    variables: any;
    called: boolean;
  };
  type: NotificationsType;
};

type NotificationsType = "link" | "function" | "read_only";
