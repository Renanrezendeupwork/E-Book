import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UserItem } from "../../../models/user";
import { UPDATEFIRSTVISIT } from "./queries";

type FirstModalProps = {
  user: UserItem;
};
const FirstModal: React.FC<FirstModalProps> = ({ user }) => {
  const [modal, setModal] = useState(true);
  const [disabled, setDisbled] = useState(true);
  const toggle = () => setModal(!modal);
  const [updateFirstVisit] = useMutation(UPDATEFIRSTVISIT);

  useEffect(() => {
    setTimeout(() => {
      setDisbled(false);
    }, 4000);
  }, []);

  const removeModal = () => {
    setModal(false);
    const set_user = { ...user };
    set_user.last_login = "today";
    set_user.first_visit = false;
    localStorage.setItem("user", JSON.stringify(set_user));
    if (!user.is_teacher)
      updateFirstVisit({ variables: { first_visit: false, id: user.id } });
  };

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      className="bg-white"
      size="lg"
      id="student_modal"
    >
      <ModalHeader toggle={toggle}>
        {user.is_teacher
          ? "WANT MORE FREE FLANGOO TIME?"
          : "Welcome to Flangoo!"}
      </ModalHeader>
      <ModalBody>
        <p>
          {user.is_teacher
            ? null
            : "To login next time you will need your login code and password."}
        </p>
        {user.is_teacher ? (
          <div>
            <p className="text-center">
              Leave a Written Review, Get 1 Extra Month <br />
              or
              <br />
              Leave a Video Review, Get 3 Extra Months!
            </p>
          </div>
        ) : (
          <div>
            <h4 className="m-1 text-center">Your login code is:</h4>
            <h3
              className="m-1 text-center text_underline"
              id="student_logincode"
            >
              {" "}
              {user.login_code}{" "}
            </h3>
            <p className="mt-5">
              {" "}
              Please write these down and keep them somewhere safe.
            </p>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        {user.is_teacher ? (
          <a
            className="btn btn-block btn-danger text-white"
            data-dismiss="modal"
            href="https://promo.teachersdiscovery.com/flangoo-video-experience-2/"
            target="_blank"
            rel="noreferrer"
            onClick={removeModal}
          >
            CLICK HERE TO LEAVE YOUR REVIEW!
          </a>
        ) : (
          <button
            className="btn btn-block btn-danger"
            data-dismiss="modal"
            disabled={disabled}
            aria-label="Close"
            id="remove_modal_button"
            onClick={removeModal}
          >
            I have written these down in a safe place
          </button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default FirstModal;
