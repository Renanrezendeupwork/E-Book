import { gql } from "@apollo/client";

export const SETTIMER = gql`
  mutation saveTimer($book_id: ID!, $audio_time: Int) {
    setTimer(book_id: $book_id, audio_time: $audio_time)
  }
`;

export const SAVEBOOKMARK = gql`
  mutation saveBookmark($book_id: ID!, $chapter: Int!) {
    saveBookmark(book_id: $book_id, chapter: $chapter)
  }
`;

export const SAVERESPONSE = gql`
  mutation saveResponse($question_id: ID!, $response: ID!, $correct: Boolean!) {
    saveQuestionResponse(
      question_id: $question_id
      response: $response
      correct: $correct
    )
  }
`;

export const GETREADER = gql`
  query getReader($book_id: ID!, $class_id: ID) {
    book(id: $book_id, class_id: $class_id) {
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
      rating_students
      score
      image_ver
      has_prereading
      has_glossary
      has_introduction
      has_aboutstory
      has_cultural
      glossary
      read_time
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

export const GET_QUESTIONS = gql`
  query getQuestions($book_id: ID!, $chapter: String!) {
    bookQuestions(book_id: $book_id, chapter: $chapter, random: true) {
      id
      chapter
      question
      success_meme
      success_msg
      fail_msg
      fail_meme
      response
      correct
      updated
      timestamp
      tries
      options {
        id
        question_id
        option_txt
        accepted
      }
    }
    retakeChapter(book_id: $book_id, chapters: [$chapter]) {
      requested
      created_at
    }
  }
`;
export const GET_AFFIRMATIONS = gql`
  query {
    affirmations {
      id
      message
      type
    }
  }
`;

export const ALLOW_TEACHER_RETAKE = gql`
  mutation allowTeacherRetake($book_id: ID!, $page: String) {
    allowTeacherRetake(book_id: $book_id, page: $page)
  }
`;
