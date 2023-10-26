import axios from "axios";
import { UserItem } from "../models/user";

const baseURL = process.env.REACT_APP_FIREBASE_URL;
const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");

const instance = axios.create({
  baseURL,
  headers: {
    authorization: `Bearer ${user.token}`,
  },
});

export default instance;
