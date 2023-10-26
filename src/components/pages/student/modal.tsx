import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { StudentItem } from "../../../models/student";

type ModalProps = {
  show: boolean;
  student: StudentItem;
  confirm: () => void;
  toggle: () => void;
};

const RemoveStudent: React.FC<ModalProps> = ({
  show,
  student,
  toggle,
  confirm,
}) => (
  <Modal isOpen={show} toggle={toggle}>
    <ModalHeader toggle={toggle}>Remove {student.name}?</ModalHeader>
    <ModalBody>
      <p>This action can't be reverted</p>
    </ModalBody>
    <ModalFooter>
      <Button color="danger" className="btn-block" onClick={confirm}>
        Yes, Remove {student.first_name}
      </Button>
    </ModalFooter>
  </Modal>
);

export default RemoveStudent;
