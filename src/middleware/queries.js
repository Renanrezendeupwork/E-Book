import { gql } from "@apollo/client";

export const GET_PLANS = gql`
  query {
    plans(all: true) {
      id
      name
      price_amount
      regular_price
      subtitle
      students
      days
    }
    pageSettings(types: ["paypal"]) {
      id
      type
      description
    }
  }
`;

export const GET_LANGUAGES = gql`
  query {
    languages {
      id
      name
      active
    }
  }
`;

export const GET_READERS = gql`
  query getBooks($lang_id: ID!, $class_id: ID) {
    books(lang_id: $lang_id, class_id: $class_id) {
      id
      chapters
      title
      url
      total_ratings
      coming_soon
      is_new
      print_url
      level_id
      video_url
      rank
      rating
      rating_teachers
      user_chapter
      rating_students
      vocab_url
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
        buy_text
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query get_categories(
    $lang_id: ID!
    $limit: Int
    $offset: Int
    $category_id: Int
    $active: Boolean
  ) {
    categories(
      lang_id: $lang_id
      limit: $limit
      offset: $offset
      category_id: $category_id
      active: $active
    ) {
      id
      name
      active
      is_level
      is_trending
    }
  }
`;

export const INITIAL_FETCH = gql`
  query get_categories(
    $lang_id: ID!
    $limit: Int
    $offset: Int
    $category_id: Int
    $active: Boolean
    $class_id: ID
  ) {
    categories(
      lang_id: $lang_id
      limit: $limit
      offset: $offset
      category_id: $category_id
      active: $active
    ) {
      id
      name
      active
      is_level
      is_trending
    }
    books(lang_id: $lang_id, class_id: $class_id, order: "release_date") {
      id
      title
      chapters
      url
      total_ratings
      coming_soon
      is_new
      print_url
      vocab_url
      video_url
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
        buy_text
      }
      nav_colors {
        background
        color
      }
    }
    languages {
      id
      name
      active
    }
    getSettings {
      angelos_show
      time_zone
      hide_achievements
      block_password_change
      hide_quizzes
      allow_retakes
      theme
    }
  }
`;
export const REFRECH_FETCH = gql`
  query getRefreshData {
    getSettings {
      hide_achievements
      block_password_change
      hide_quizzes
      allow_retakes
      angelos_show
      time_zone
      theme
    }
  }
`;
