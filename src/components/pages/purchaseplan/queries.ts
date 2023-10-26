import { gql } from "@apollo/client";

export const GET_PLANS = gql`
  query {
    plans(all: false) {
      id
      name
      price_amount
      regular_price
      subtitle
      students
      days
      sku
    }
    pageSettings(types: ["paypal"]) {
      id
      type
      description
    }
  }
`;

export const PAYMUTATION = gql`
  mutation paymentSuccess($pay_id: ID!, $plan_id: ID!, $method: String!) {
    paymentSuccess(pay_id: $pay_id, plan_id: $plan_id, method: $method)
  }
`;
