import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import DataContextProvider from "./context/data-context";
import { UserItem } from "./models/user";
import AnalyticsContextProvider from "./context/analytics-context";

const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");

const initialScope = user.id
  ? {
      user: {
        id: user.id,
        email: user.email || undefined,
        is_teacher: user.is_teacher,
      },
    }
  : undefined;
if (process.env.REACT_APP_PROD === "true") {
  Sentry.init({
    dsn: "https://e704ca9f805c4f76808df5ebce7eed0f@o464570.ingest.sentry.io/5474310",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.2,
    environment: process.env.REACT_APP_PROD === "true" ? "live" : "local",
    initialScope,
    beforeSend: (event) => {
      if (event.level !== "fatal") {
        return null;
      }
      return event;
    },
  });
}

ReactDOM.render(
  <React.StrictMode>
    <DataContextProvider>
      <AnalyticsContextProvider>
        <App />
      </AnalyticsContextProvider>
    </DataContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
