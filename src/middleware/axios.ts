import axios from "axios";
const baseURL = process.env.REACT_APP_READER_URL + "index.php?api/";
const instance = axios.create({
  baseURL,
});

export default instance;
