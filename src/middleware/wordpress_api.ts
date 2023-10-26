import axios from "axios";
const url = "https://teachersdiscovery.blog/wp-json/wp/v2/";

type WordpressPageType = {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
};

export function getPost(post_id: string): Promise<WordpressPageType> {
  return new Promise((res, rej) => {
    axios
      .get(`${url}pages/${post_id}`)
      .then(({ data }) => {
        console.log("wordpress_api.js:7 | data", data);
        res(data);
      })
      .catch((err) => {
        console.log("err", err);
        rej(err);
      });
  });
}
