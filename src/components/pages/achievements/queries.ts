import { gql } from "@apollo/client";

export const GETACHIEVEMENTS = gql`
  query {
    achievements {
      id
      title
      type_name
      value
      group
      user_type
      teacher_id
      desc
      success_msg
      badge
      badge_fade
      points
      grade
      hidden
      completed
      progress
      completed_at
    }
    leaderboard {
      points
      student {
        id
        name
        class {
          id
          name
        }
      }
    }
    classes {
      value: id
      txt: name
      teacher_id
      students
      created
    }
    students {
      id
      created
      name
      last_name
      login_code
      class_id
      minutes
      semester_minutes
      last_login
      class {
        name
      }
    }
    stats {
      value
      id
      name
      type
      class_id
      icon
    }
  }
`;

export const SAVEACHIEVEMENT = gql`
  mutation saveAchievement($id: ID!) {
    achievement(id: $id)
  }
`;
