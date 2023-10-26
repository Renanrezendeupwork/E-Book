import { gql } from "@apollo/client";

export const SAVERATING = gql`
  mutation saveRating($book_id: ID!, $rating: Int!, $message: String) {
    saveRating(book_id: $book_id, rating: $rating, message: $message)
  }
`;
