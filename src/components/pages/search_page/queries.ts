import { gql } from "@apollo/client";

export const GETSEARCH = gql`
  query getSearch($search: String!) {
    getSearch(search: $search) {
      id
      title
      chapters
      url
      total_ratings
      coming_soon
      is_new
      print_url
      level_id
      rank
      rating
      rating_teachers
      rating_students
      image_ver
      has_prereading
      user_chapter
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
      nav_colors {
        background
        color
      }
    }
  }
`;
