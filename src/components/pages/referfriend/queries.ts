import { gql } from "@apollo/client";

export const SENDREFERERS = gql`
  mutation sendReferer($referrals: [ReferralInput!]!, $message: String) {
    referFriends(referrals: $referrals, message: $message)
  }
`;
