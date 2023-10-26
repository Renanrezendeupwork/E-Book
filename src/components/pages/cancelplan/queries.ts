import { gql } from "@apollo/client";

export const CANCELMEMBER = gql`
  mutation {
    cancelMembership {
      id
      token
      name
      email
      active
      show_steps
      lang_id
      profile_pic
      plan {
        id
        status
        from
        to
        payment_method
        name
      }
    }
  }
`;
