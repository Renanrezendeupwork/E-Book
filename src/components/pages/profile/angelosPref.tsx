import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { ToggleSwitch } from "../../common/ui_elements";
import { GETANGELOSPREFF, SETANGELOSPREFF } from "./queries";

/* ANGELOS REMOVE After event */

type AngelosPrefProps = {
  toggleOnly?: boolean;
};
const AngelosPref: React.FC<AngelosPrefProps> = ({ toggleOnly = false }) => {
  const [show, setShow] = useState(false);
  const [savePref] = useMutation(SETANGELOSPREFF);
  const { data, loading } = useQuery(GETANGELOSPREFF, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (data && data.getSetting) {
      console.log("angelosPref.tsx:19 | data", data);
      const is_shown = data.getSetting === "1";
      setShow(is_shown);
    }
  }, [data]);

  const handleShow = () => {
    setShow(!show);
    savePref({
      variables: {
        pref_value: !show ? "1" : "0",
      },
    });
  };
  return (
    <div className="row align-items-center my-4">
      <div className="col">
        {toggleOnly ? null : <h5>Angelo's Quest</h5>}
        <p className="mb-0">
          Show Angelo's Quest to Students:
          <ToggleSwitch
            classes={`ml-2 ${loading ? "opacity_3" : ""}`}
            lables_txt={{ disabled: "Hide", enabled: "Show" }}
            inline
            disabled={!show}
            click={loading ? null : handleShow}
            id={"angelos"}
          />
        </p>
        <small className="text-muted my-0">
          My students{" "}
          {show ? (
            <b className="text-success">can see</b>
          ) : (
            <b className="text-danger">can't see</b>
          )}{" "}
          Angelo's Quest.
        </small>
      </div>
      {toggleOnly ? null : (
        <>
          <div className="col-4">
            <p className="text-muted">
              Do you want your student to see Angelos Quest? <br /> (applies to
              all of your students)
            </p>
          </div>
          <div className="col-3">
            <Link className="blue_text d-block d-block " to="/live">
              Go to Angelos Live page
            </Link>{" "}
          </div>
        </>
      )}
    </div>
  );
};

export default AngelosPref;
