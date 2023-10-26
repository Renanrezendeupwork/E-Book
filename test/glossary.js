var spanish = "árbol";
var text = ` <p>
— Maman, j’ai besoin d’aller à la papeterie pour acheter du matériel. <br/>
— Et de quoi tu as besoin ? Tu as déjà des crayons, des marqueurs et
une règle. <br/>
— Le professeur dit que nous avons besoin d’une boîte spéciale pour un
projet que nous faisons, explique-t-elle. <br/>
— Pourquoi est-ce que tu me le dis maintenant ? je lui demande d’une
voix fâchée. Quand est-ce que tu as besoin de ce matériel ? <br />
— Je ne sais pas, Maman. Nous avons parlé du projet aujourd'hui à
l’école.
</p>`;

var lower_case = spanish.toLocaleLowerCase();
var regex = new RegExp("\\b" + lower_case + "\\b");
var word_position = text.search(regex); /// returns string position
if (word_position < 0) {
  ///run search again for accetns on the first and last char
  var regex_str = "(\\W|^[á-úÁ-Úâ-ûÂ-Ûà-ùÀ-Ù’]|^)" + lower_case;
  regex = new RegExp(regex_str);
  word_position = text.search(regex_str); /// returns string position
  if (word_position < 0) {
    console.log("No luck");
  } else {
    word_position += 1; /// avoid empty space at the beginning
  }
}
console.log(word_position);
