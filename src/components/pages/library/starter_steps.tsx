import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReaderItem } from "../../../models/reader";
import { UserItem } from "../../../models/user";
import { GETSTARTSTEPS } from "./queries";

type stepsItems = {
  students: boolean;
  classes: boolean;
  books: boolean;
  show_discard: boolean;
};

type StarterStepsProps = {
  discardFunction: any;
};
const StarterSteps: React.FC<StarterStepsProps> = ({ discardFunction }) => {
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const local_readers: ReaderItem[] = JSON.parse(
    localStorage.getItem("local_readers") || "{}"
  );
  const [stepsState, setSteps] = useState<stepsItems>({
    students: false,
    classes: false,
    books: false,
    show_discard: false,
  });
  const { data: steps, loading } = useQuery(GETSTARTSTEPS, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (steps) {
      const set_steps = { ...stepsState };
      set_steps.students = steps.students.length > 0;
      set_steps.classes = steps.classes.length > 0;
      set_steps.books =
        local_readers.filter(
          (item) => item.user_chapter && item.user_chapter > 0
        ).length > 0;
      if ((set_steps.students, set_steps.classes, set_steps.books)) {
        set_steps.show_discard = true;
      }
      setSteps(set_steps);
    }
    // eslint-disable-next-line
  }, [steps]);

  if (loading) {
    return null;
  }
  return (
    <div className="starter_steps first-container" id="starter_steps">
      <div className="container">
        <div className="text-center hero-txt">
          <h1>You can actually use this in <br />Class this week!</h1>
          <p>Get started in four easy steps:</p>
        </div>
        <div className="row">
          <Item
            title="Browse the Readers"
            txt="Choose a reader from the list below and start reading."
            checked={stepsState.books}
          />
          <Item
            title="Create a Class Group"
            txt="Organize all your classes in one convenient location."
            checked={stepsState.classes}
            link="/students"
          />
          <Item
            title="Add Student Accounts"
            txt="Share the readers with all your students!"
            checked={stepsState.students}
            link="/students"
          />
          <Item
            title="Purchase subscription so everyone can use it all year!"
            txt="Don’t lose access to your digital Spanish reader library."
            checked={
              user && user.plan && user.plan.payment_method !== "FREE"
                ? true
                : false
            }
            link="/youraccount"
          />
        </div>
        {stepsState.show_discard ? (
          <button className="btn btn-dark px-4" onClick={discardFunction}>
            Discard{" "}
          </button>
        ) : null}
      </div>
    </div>
  );
};

type ItemPrps = {
  title: string;
  txt: string;
  checked: boolean;
  link?: string;
};

const Item: React.FC<ItemPrps> = ({ title, txt, checked, link }) => (
  <div className="item col-lg-3 col-md-4 col-sm-6 col-12">
    {link ? <Link to={link}></Link> : null}
    <div className="icon">
      <i
        className={`fa-fw ${checked ? "fal fa-check-square" : "fal fa-square"}`}
        aria-hidden="true"
      ></i>
    </div>
    <div className="desc">
      <h6>{title}</h6>
      <p>{txt}</p>
    </div>
  </div>
);

export default StarterSteps;
