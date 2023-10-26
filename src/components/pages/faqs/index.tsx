import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { GET_FAQS } from "./queries";

type FaqItemType = {
  question: string;
  answer: string;
  id: string;
};

const FaqsPage: React.FC = () => {
  const { data } = useQuery<{ fqs: FaqItemType[] }>(GET_FAQS);
  const [activeCard, setActive] = useState<string | false>(false);

  useEffect(() => {
    const document_body = document.getElementsByTagName("body")[0];
    if (document_body) {
      document_body.classList.add("white_bg");
    }
    return () => {
      document_body.classList.remove("white_bg");
    };
  }, []);

  const setActiveFun = (ev: { currentTarget: HTMLElement }) => {
    const { id } = ev.currentTarget.dataset;
    if (!id) {
      return;
    }
    setActive(id);
  };

  return (
    <div className="container first-container last-container">
      <Helmet title="Frequently Asked Questions" />
      <h4 className="">Frequently Asked Questions</h4>
      <div className="accordion">
        {data?.fqs
          ? data.fqs.map((fq, key) => (
              <FaqItem
                fq={fq}
                key={`FaqItem_${fq.id}_${key}`}
                active={fq.id ? fq.id === activeCard : key === 0}
                setActiveFun={setActiveFun}
              />
            ))
          : null}
      </div>
    </div>
  );
};

type FaqItemProps = {
  fq: FaqItemType;
  active: boolean;
  setActiveFun: any;
};

const FaqItem: React.FC<FaqItemProps> = ({ fq, active, setActiveFun }) => (
  <div className="card hovered " onClick={setActiveFun} data-id={fq.id}>
    <div className="card-header d-flex align-items-center ">
      <img
        src={`${process.env.REACT_APP_CDN_IMG}faq_icon.png`}
        className="img-fluid"
        alt="FAQ"
      />{" "}
      <h5 className="text-dark mx-2 my-0">{fq.question}</h5>
    </div>

    <div className={`animate_all collapse ${active ? "show" : ""}`}>
      <div
        className="card-body"
        dangerouslySetInnerHTML={{ __html: fq.answer }}
      ></div>{" "}
    </div>
  </div>
);

export default FaqsPage;
