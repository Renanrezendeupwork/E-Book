import React, { useEffect, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../../middleware/firebase";
import { PollType, PollOption } from "./models";
import axios from "../../../middleware/axios_firebase";
import { UserItem } from "../../../models/user";

type AngelosPollProps = { pollData: PollType };
const AngelosPoll: React.FC<AngelosPollProps> = ({ pollData }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}") as UserItem;
  const [selected, setSelected] = useState<string | false>(false);
  const [responded, setResponded] = useState<boolean>(false);

  useEffect(() => {
    getResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getResponse = async () => {
    const user_record = `${user.is_teacher ? "t" : "s"}_${user.id}`;
    const docRef = doc(db, "polls", pollData.id, "responses", user_record);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const response_data = docSnap.data();
      setSelected(response_data?.optionId);
      setResponded(true);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const handleSelect = (option_id: string) => {
    if (!option_id) return;
    setSelected(option_id);
  };

  const handleSendResponse = () => {
    if (!selected) return;
    try {
      axios.post("/scriptsPollResponseSave", {
        poll_id: pollData.id,
        user_id: user.id,
        is_teacher: user.is_teacher,
        option_id: selected,
      });
      setResponded(true);
    } catch (error) {
      console.log("poll.tsx:18 | error ", error);
    }
  };

  return (
    <div className="angelos_poll">
      <div className="row ">
        <div className="col-9">
          <h5>{pollData.question}</h5>
        </div>
        <div className="col-3 opacity_7 text-right d-flex align-content-center ">
          <p>
            {pollData.total_votes + 642}
            <i className="ml-1 fal fa-users"></i>
          </p>
        </div>
      </div>
      {responded ? (
        <BarsContanier options={pollData.options} selected={selected} />
      ) : (
        <ResponseContaner
          options={pollData.options}
          selected={selected}
          handleSelect={handleSelect}
          handleSendResponse={handleSendResponse}
        />
      )}
    </div>
  );
};

const ResponseContaner = ({
  options,
  handleSelect,
  selected,
  handleSendResponse,
}: {
  options: PollOption[];
  handleSelect: (option_id: string) => void;
  selected: string | false;
  handleSendResponse: () => void;
}) => (
  <div className="bars_container">
    {options.map((option) => (
      <Option
        key={`responses_${option.id}`}
        value={option.option}
        id={option.id}
        select={handleSelect}
        selected={selected === option.id}
      />
    ))}

    <button onClick={handleSendResponse} className="btn btn-success w-100 mt-3">
      Send
    </button>
  </div>
);

const Option = ({
  value,
  id,
  selected,
  select,
}: {
  value: string;
  id: string;
  select: any;
  selected?: boolean;
}) => (
  <button
    className={`btn btn_option ${selected ? "selected " : ""} `}
    data-value={id}
    onClick={() => {
      select(id);
    }}
  >
    <i className={selected ? `fas fa-check-circle` : `far fa-circle`}></i>
    {value}
  </button>
);
const BarsContanier = ({
  options,
  selected,
}: {
  options: PollOption[];
  selected: string | false;
}) => (
  <div className="bars_container">
    {options.map((option) => (
      <OptionBar
        key={`bars_${option.id}`}
        selected={selected === option.id}
        option={option.option}
        percentage={option.percentage}
        winner
      />
    ))}
  </div>
);

type OptionBarProps = {
  option: string;
  percentage: number;
  winner?: boolean;
  selected?: boolean;
};
const OptionBar: React.FC<OptionBarProps> = ({
  option,
  percentage,
  winner,
  selected,
}) => (
  <div className="bar_option">
    <h6>
      {option}{" "}
      {selected && <i className="icon fas fa-check-circle text-success"></i>}
    </h6>
    <ProgressBar
      now={percentage}
      label={`${percentage}%`}
      variant={winner ? "success" : "secondary"}
    />
  </div>
);

export default AngelosPoll;
