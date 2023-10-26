import { gql } from "@apollo/client";

export const GET_CLASSES = gql`
  query getStudents {
    classes {
      value: id
      txt: name
      teacher_id
      students
      created
    }
  }
`;
