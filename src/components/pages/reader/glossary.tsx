import { GlossaryItem } from "../../../models/reader";

type PositionType = {
  start: number;
  end: number;
  spaces?: SpacesType;
};

type SpacesType = {
  start: number;
  end: number;
  string_start?: string;
  string_end?: string;
};
async function runGlossary(glossary: GlossaryItem[]) {
  ///check word by word using glossary.jason file
  if (!glossary) {
    return;
  }
  ///arrange glossary by length
  glossary.sort(function (a, b) {
    return b.es.length - a.es.length;
  });
  return new Promise(async (res) => {
    const shown_translations: string[] = [];
    for (const translation of glossary) {
      const p = document.querySelectorAll("p,h2");

      for (const i of Array.from(p)) {
        let spanish = translation.es.trim();
        let repeated = shown_translations.indexOf(spanish);
        if (repeated >= 0) {
          continue;
        }
        let text = i.innerHTML;
        var replaced = await validateAndReplace(
          i,
          spanish,
          text,
          translation,
          0,
          0
        );
        if (replaced) shown_translations.push(spanish);
      }
    }
    console.log("glossary.tsx:47 | shown_translations", shown_translations);
    return res(true);
  });
}

async function highlight_string(
  element: HTMLElement | Element,
  translation: GlossaryItem,
  position: PositionType
): Promise<boolean> {
  return new Promise(async (res) => {
    const innerHTML = element.innerHTML;
    const word_en = translation.en.trim();
    const word = innerHTML.slice(position.start, position.end); ///match case
    if (!position.spaces) return res(false);
    var translationHtml =
      '<a href="javascript:;" class="highlight" data-tooltip="' +
      word_en +
      '">' +
      word +
      "</a>";

    const newHtml =
      '<span class="translation">' +
      position.spaces.string_start +
      translationHtml +
      position.spaces.string_end +
      "</span>";
    const newInnerHTML: string = await replaceGlossary(
      innerHTML,
      position,
      newHtml
    );

    element.innerHTML = newInnerHTML;
    res(true);
  });
}

async function replaceGlossary(
  value: string,
  position: PositionType,
  join: string
): Promise<string> {
  return new Promise((res) => {
    if (!position.spaces) {
      return res(value);
    }
    var result =
      value.slice(0, position.spaces.start) +
      join +
      value.slice(position.spaces.end);

    return res(result);
  });
}

function getAllIndexes(arr: string, val: string) {
  const indexes = [];
  let i = -1;
  while ((i = arr.indexOf(val, i + 1)) !== -1) {
    indexes.push(i);
  }
  return indexes;
}

async function validateAndReplace(
  element: HTMLElement | Element,
  spanish: string,
  text: string,
  translation: GlossaryItem,
  search_position: number,
  text_offset: number
): Promise<boolean> {
  return new Promise(async (res) => {
    if (search_position) {
      text = text.substring(search_position);
    }

    const lower_case = spanish.toLocaleLowerCase();
    const search_text = text.toLocaleLowerCase();
    let regex = new RegExp("\\b" + lower_case + "\\b");
    let word_position = search_text.search(regex); /// returns string position
    if (word_position < 0) {
      ///run search again for accetns on the first and last char
      const regex_str = "(\\W|^[á-úÁ-Úâ-ûÂ-Ûà-ùÀ-Ù’]|^)" + lower_case;
      regex = new RegExp(regex_str);
      word_position = search_text.search(regex); /// returns string position
      if (word_position < 0) {
        return res(false);
      }
      word_position += 1; /// avoid empty space at the beginning
    }
    const word_position_end = word_position + spanish.length; ///add up string length

    const position: PositionType = {
      start: word_position,
      end: word_position_end,
    };

    ///validate whole word
    const next_char = text[position.end];
    const prev_char = text[position.start - 1];
    if (next_char && next_char.search(/^[A-Za-z0-9áéíóúñÁÉÍÓÚÑ]+$/i) >= 0)
      return res(false);
    if (prev_char && prev_char.search(/^[A-Za-z0-9áéíóúñÁÉÍÓÚÑ]+$/i) >= 0)
      return res(false);
    ////check if not translated already inside another string
    ///check if string inside an <a> tag by its position
    let duplicated = false;
    const open_tags = getAllIndexes(text, "<a");
    const closed_tags = getAllIndexes(text, "</a>");

    open_tags.forEach(function (tag_start, key) {
      const tag_end = closed_tags[key];
      if (position.start >= tag_start && position.end <= tag_end) {
        duplicated = true;
      }
    });

    if (duplicated) {
      ///serch if word appiears again on same <p>
      let new_position = position.end;
      for (const closed_tag of closed_tags) {
        if (closed_tag > new_position) {
          new_position = closed_tag + 4;
          break;
        }
      }
      const response = await validateAndReplace(
        element,
        spanish,
        text,
        translation,
        new_position,
        text_offset + new_position
      );
      return res(response);
    }
    position.spaces = findSpaces(text, word_position - 1, word_position_end);
    ///check if prev char is a symbol
    position.start += text_offset;
    position.end += text_offset;
    if (position.spaces) {
      position.spaces.start += text_offset;
      position.spaces.end += text_offset;
    }
    await highlight_string(element, translation, position);
    return res(true);
  });
}

function findSpaces(
  text: string,
  position_start: number,
  position_end: number
): SpacesType {
  let start = 0;
  let end = 0;
  let string_start = "";
  let string_end = "";
  let total_chars = text.length;
  ///find previous space
  for (let i = position_start; i >= 0; i--) {
    if (typeof text[i] !== undefined) {
      let char = text[i];
      if (char === " " || char === "-") {
        start = i + 1;
        break;
      }
      string_start = char + string_start; ////add to the beginig to avoid reverted string
    }
  }

  ///find next space
  for (let i = position_end; i <= total_chars; i++) {
    if (typeof text[i] !== undefined) {
      let char = text[i];
      end = i;
      if (char === " " || char === "-") {
        ///search for "!" after one space
        let next_char = text[i + 1];
        if (next_char !== "!") {
          break;
        }
      }
      if (char) {
        string_end += char;
      }
    }
  }
  return { start, end, string_start, string_end };
}

export default runGlossary;
