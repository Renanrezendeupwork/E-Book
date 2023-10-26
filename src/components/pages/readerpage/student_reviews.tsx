import React from "react";
import { useQuery } from "@apollo/client";
import { toDate } from "../../../middleware/dates";
import { IconJumbotron, RatingStars } from "../../common/icons";
import { BookReview } from "./models";
import { GETREVIEWS } from "./queries";
import { LoaderDots } from "../../../middleware/main_loader";
import { StudentItem } from "../../../models/student";

type ReviewsProps = {
  book_id: string;
  students: StudentItem[];
};
const Reviews: React.FC<ReviewsProps> = ({ book_id, students }) => {
  const { data, loading, called } = useQuery<{
    bookReviews: BookReview[];
  }>(GETREVIEWS, {
    variables: { id: book_id },
    fetchPolicy: "no-cache",
  });

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <LoaderDots />
      </div>
    );
  }
  if ((called && !data) || (data && data.bookReviews.length < 1)) {
    return (
      <div className="container my-5">
        <IconJumbotron
          txt="None of your students have rated this book yet"
          icon="fas fa-star-shooting"
          classes="py-5"
        />
      </div>
    );
  }
  return (
    <div className="container my-5">
      <div className="raitings_cards">
        {data?.bookReviews.map((item, key) => {
          const student = students.find((s) => s.id === item.user_id);
          if (!student) {
            return null;
          }
          return (
            <RatingCard
              review={item}
              student={student}
              key={`RatingCard${item.user_id}${key}`}
            />
          );
        })}
      </div>
    </div>
  );
};

type RatingCardProps = {
  review: BookReview;
  student: StudentItem;
};
const RatingCard: React.FC<RatingCardProps> = ({ review, student }) => (
  <div className="rating_card">
    <div className="heading">
      <h5>{student.name}</h5>
      <h6> {toDate(review.timestamp)}</h6>
    </div>
    <RatingStars id={`rating_stars_${review.user_id}`} value={review.rating} />
    <p> {review.opinion}</p>
  </div>
);

export default Reviews;
