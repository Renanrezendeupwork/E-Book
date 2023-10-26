import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { LoaderBar } from "../../../middleware/loaders";
import { Userquiz } from "../../../models/questions";
import { StudentItem } from "../../../models/student";
import ResponseTable from "../readerpage/response_table";

type ModalProps = {
  show: boolean;
  refetch: () => void;
  reader_id: string;
  toggle: () => void;
  questions: Userquiz[];
  student: StudentItem;
  refetch_loading: boolean;
};

const RetakeModal: React.FC<ModalProps> = ({
  show,
  toggle,
  questions,
  reader_id,
  student,
  refetch_loading,
  refetch,
}) => {
  return (
    <Modal isOpen={show} toggle={toggle}>
      <ModalHeader toggle={toggle}>Allow Retake by Chapters</ModalHeader>
      <ModalBody className="position-relative">
        {refetch_loading ? <LoaderBar absolute={true} /> : null}
        <ResponseTable
          questions={questions}
          student={student}
          refetch={refetch}
          loading={false}
          allow_retake={true}
          book_url={reader_id}
          book_id={reader_id}
        />
      </ModalBody>
    </Modal>
  );
};

export default RetakeModal;
