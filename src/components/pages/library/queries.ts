import { gql } from "@apollo/client";

export const GETCONTINUE = gql`
  query getContinueReading {
    getContinueReading {
      id
      chapters
      title
      url
      total_ratings
      coming_soon
      print_url
      level_id
      rank
      rating
      rating_teachers
      user_chapter
      rating_students
      image_ver
      images {
        cover
        thumb
        poster
      }
      level {
        id
        name
      }
      description_short
      release_date
      language {
        id
        name
      }
      categories {
        id
        name
      }
    }
    getRecentReading {
      id
      chapters
      title
      url
      total_ratings
      coming_soon
      print_url
      level_id
      rank
      rating
      rating_teachers
      user_chapter
      rating_students
      image_ver
      images {
        cover
        thumb
        poster
      }
      level {
        id
        name
      }
      description_short
      release_date
      language {
        id
        name
      }
      categories {
        id
        name
      }
    }
  }
`;

export const GETASSIGNMENT = gql`
  query getAssignment($class_id: ID!, $lang_id: ID!) {
    assignments(class_id: $class_id, lang_id: $lang_id) {
      id
      class_id
      title
      start_time
      end_time
      book_id
      message
      class {
        name
      }
      book {
        id
        title
        is_new
        url
        images {
          cover
        }
      }
    }
  }
`;

export const GETSTARTSTEPS = gql`
  query getStartSteps {
    classes {
      id
    }
    students(limit: 1) {
      id
    }
  }
`;

export const UPDATEFIRSTVISIT = gql`
  mutation updateFirstVisit($id: ID!, $first_visit: Boolean) {
    student(
      id: $id
      first_visit: $first_visit
      first_name: "noneed"
      last_name: "noneed"
      class_id: "noneed"
    ) {
      id
    }
  }
`;

export const SAVETOKEN = gql`
  mutation saveFcm($token: String!) {
    saveFcmToken(token: $token)
  }
`;
