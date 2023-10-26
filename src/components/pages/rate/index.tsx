import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RateDataType, ReaderItem } from "../../../models/reader";
import { SAVERATING } from "./queries";
import RateInput from "./rate_input";
import BookResume from "./reader_data";

const RatePage: React.FC = () => {
  const local_readers = localStorage.getItem("local_readers")
    ? JSON.parse(localStorage.getItem("local_readers") || "{}")
    : false;
  const { reader_id } = useParams<{ reader_id: string }>();
  const [reader, setReader] = useState<ReaderItem | false>(false);
  const [saveRating, { loading }] = useMutation(SAVERATING);
  const [rateData, setRateData] = useState<RateDataType>({
    selected: 0,
    hovered: 0,
  } as RateDataType);
  useEffect(() => {
    getReader(local_readers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reader_id]);

  const getReader = (readers: [ReaderItem]): void => {
    if (!readers) {
      return;
    }
    const get_reader: ReaderItem | undefined = readers.find(
      (r: ReaderItem) => r.id === reader_id
    );
    console.log("index.js:27 | get_reader", get_reader);
    if (get_reader) {
      setReader(get_reader);
    }
  };

  const handleHover = (ev: { currentTarget: HTMLButtonElement }) => {
    const current_data = { ...rateData };
    const value = ev.currentTarget.dataset.value;
    current_data.hovered = Number(value);
    setRateData(current_data);
  };

  const handleHoverOut = () => {
    const current_data = { ...rateData };
    current_data.hovered = 0;
    setRateData(current_data);
  };

  const handleSelect = (ev: { currentTarget: HTMLButtonElement }) => {
    const current_data = { ...rateData };
    const value = ev.currentTarget.dataset.value;
    current_data.selected = Number(value);
    setRateData(current_data);
  };

  const handleTypeMessage = (ev: { target: HTMLInputElement }) => {
    const current_data = { ...rateData };
    const value = ev.target.value;
    current_data.message = value;
    setRateData(current_data);
  };
  const handleSave = () => {
    const current_data = { ...rateData };
    ///validate if rate is not empty
    if (rateData.selected <= 0) {
      current_data.error =
        "Please select your rating opinion on the Overall rating";
      setRateData(current_data);
      return;
    }
    delete current_data.error;
    setRateData(current_data);
    saveRating({
      variables: {
        book_id: reader_id,
        rating: rateData.selected,
        message: rateData.message,
      },
    });
  };

  return (
    <main className="first-container last-container raitings_page">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <RateInput
              error={rateData.error}
              data={rateData}
              handleSelect={handleSelect}
              handleTypeMessage={handleTypeMessage}
              handleHover={handleHover}
              handleHoverOut={handleHoverOut}
              handleSave={handleSave}
              loading={loading}
            />
          </div>
          <div className="col-md-6">
            {reader && <BookResume reader={reader} />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default RatePage;
