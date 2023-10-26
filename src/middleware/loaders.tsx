import React from "react";
import BarLoader from "react-spinners/BarLoader";
import PuffLoader from "react-spinners/PuffLoader";
import SyncLoader from "react-spinners/SyncLoader";

import tips from "../data/tips.json";

type FullPageLoaderProps = {
  show: boolean;
};
export const FullPageLoader: React.FC<FullPageLoaderProps> = ({ show }) => {
  const random = Math.floor(Math.random() * tips.length);
  const tip = tips[random];
  return (
    <main className="full_page_loader">
      <img
        src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/Flangoo_logo_white512.png"
        alt="Flangoo Logo"
      />
      <p>{tip}</p>
      <BarLoader color={"#fff"} loading={show} />
    </main>
  );
};

type LoaderDotsProps = {
  size?: number;
  color?: string;
  text?: string;
  centered?: boolean;
  display?: string;
};
export const LoaderDots: React.FC<LoaderDotsProps> = ({
  size = 20,
  color = "#bdbdbd",
  text = false,
  centered = true,
  display = "normal",
}) => (
  <div className={`loader ${centered ? "center_loader" : ""} ${display}`}>
    <SyncLoader size={size} color={color} />
    {text ? <small className="text-muted my-4">{text}</small> : null}
  </div>
);
export const LoaderBar = ({ fixed = false, absolute = false }) => (
  <div
    className={`${fixed ? "fixed_loader" : ""} ${
      absolute ? "absolute_loader" : ""
    }`}
  >
    <BarLoader width={"100%"} color={"#ff6347"} loading={true} />
  </div>
);

export const LoaderPuff = ({ fixed = false, absolute = false }) => (
  <div
    className={`${fixed ? "fixed_loader_puff" : ""} ${
      absolute ? "absolute_loader_puff" : ""
    }`}
  >
    <PuffLoader color={"#ff6347"} loading={true} />
  </div>
);

type BlockPageLoaderProps = {
  text: string;
};
export const BlockPageLoader: React.FC<BlockPageLoaderProps> = ({ text }) => (
  <div className={`block_page_loader`}>
    <PuffLoader color={"#ff6347"} loading={true} />
    {text ? <p>{text}</p> : ""}
  </div>
);
