import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, ButtonGroup } from "reactstrap";
import { LangItem } from "../../../models/lang";
import { UPDATELANG, SETHOW } from "../profile/queries";
import { useMutation } from "@apollo/client";
import { SETLANG } from "../../layouts/queries";

const WelcomePage: React.FC = () => {
  const history = useHistory();
  const [updateLangs] = useMutation(UPDATELANG);
  const [setHow] = useMutation(SETHOW);
  const [setLang] = useMutation(SETLANG);

  const local_languages: LangItem[] = JSON.parse(
    localStorage.getItem("local_languages") || "{}"
  );
  const [langs, setLangs] = useState(local_languages);
  const [first_lang, setFirstLang] = useState("spanish");
  const [form, setForm] = useState({
    how: "",
    langs: [] as string[],
  });

  useEffect(() => {
    const selected = langs.find((l) => l.active);
    if (selected) {
      setLang({ variables: { lang_id: selected.id } });
      setFirstLang(selected.name.toLocaleLowerCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langs]);

  const updateLangsFun = (ev: { currentTarget: HTMLButtonElement }) => {
    const set_langs = [...langs];
    const lang_id = ev.currentTarget.dataset.lang_id;
    const active = ev.currentTarget.dataset.active === "true" ? false : true;
    if (!lang_id) {
      return;
    }
    const index_of = set_langs.findIndex((l: LangItem) => l.id === lang_id);
    if (index_of < 0) {
      return;
    }
    set_langs[index_of].active = active;

    const active_langs = set_langs
      .filter((item) => item.active)
      .map((item) => item.id);
    updateLangs({ variables: { langs: active_langs } });
    localStorage.setItem("local_languages", JSON.stringify(set_langs));
    setLangs(set_langs);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const type = e.target.id;
    const value = e.target.value;
    const set_form = { ...form, [type]: value };
    setForm(set_form);
  };

  const handleSave = () => {
    if (form.how === "" || form.how === "false") {
      return;
    }
    setHow({ variables: { how: form.how } });
    history.push({
      pathname: `/library/${first_lang}`,
    });
  };

  return (
    <main className="first-container last-container thankyou_page">
      <div>
        <h1>Thank you for signing up for Flangoo! </h1>
      </div>
      <div className="my-4">
        <p>
          We want to send you only the news that is related to the languages you
          currently teach.
        </p>
        <p>What Subject Do You Teach? (check all that apply)</p>
        <ButtonGroup>
          {langs && langs.length > 0
            ? langs.map((lang) => (
                <Button
                  color="primary"
                  className="no_focus"
                  active={lang.active}
                  key={`Button_${lang.id}`}
                  data-lang_id={lang.id}
                  data-active={lang.active ? "true" : "false"}
                  onClick={updateLangsFun}
                >
                  <i
                    className={`fal mr-2 ${
                      lang.active ? "fa-check-square" : "fa-square"
                    }`}
                  ></i>
                  {lang.name}
                </Button>
              ))
            : null}
        </ButtonGroup>
        <HowDid handleChange={handleChange} how={form.how} />
        <button onClick={handleSave} className="btn btn-danger mb-3">
          Save and Continue
        </button>
        <br />
        <Link to={`/library/${first_lang}`} className="btn btn-link ">
          Skip
        </Link>
      </div>
    </main>
  );
};

type HowDidProps = {
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  how: string;
};

const HowDid: React.FC<HowDidProps> = ({ handleChange, how }) => (
  <>
    <p className="mt-3 mb-0">How did you discover Flangoo?</p>
    <div className="black_text form-group">
      <select
        className="form-control"
        name="how"
        id="how"
        onChange={handleChange}
        value={how}
      >
        <option value="false">Select an option</option>
        <option value="email">I got an email</option>
        <option value="facebook">I saw it on Facebook</option>
        <option value="referrer" disabled={false}>
          I got a referrer invitation
        </option>
        <option value="search">Online search</option>
        <option value="colleague">A colleague shared it with me</option>
        <option value="catalog">Saw it in your catalog</option>
        <option value="other">Other</option>
      </select>
    </div>
  </>
);

export default WelcomePage;
