import React from "react";
import ReactGA from "react-ga";
ReactGA.initialize("UA-41196061-19");

const production = process.env.REACT_APP_PROD === "true";

export type EcommerceData = {
  name: string;
  id: string;
  revenue: string;
  subscription: string;
  sku: string;
  category: string;
};

export const AnalyticsContext = React.createContext({
  event: (data: {
    category: string;
    action: string;
    label: string;
    value: number;
  }) => {},
  view: (location: string) => {},
  ecommerce: (data: EcommerceData) => {},
});

const AnalyticsContextProvider: React.FC = ({ children }) => {
  const event = (data: {
    category: string;
    action: string;
    label: string;
    value: number;
  }) => {
    if (!production) {
      console.log(`analytics-context.tsx:35 | No event sent on !production`, {
        category: data.category,
        action: data.action,
        label: data.label,
        value: data.value,
      });
      return false;
    }
    ReactGA.event({
      category: data.category,
      action: data.action,
      label: data.label,
      value: data.value,
    });
  };

  const pageview = (location: string) => {
    if (!production || !location) return false;
    ReactGA.pageview(location);
  };

  const ecommerce = (data: EcommerceData) => {
    if (!production) return false;
    ReactGA.plugin.require("ecommerce");

    if (!data) return false;
    ReactGA.plugin.execute("ecommerce", "addTransaction", {
      id: data.id,
      revenue: data.revenue,
      name: data.subscription, // Product name. Required.
      sku: data.sku, // SKU/code.
      category: data.category, // Category or variation
    });
    //@ts-ignore
    ReactGA.plugin.execute("ecommerce", "send");
    //@ts-ignore
    ReactGA.plugin.execute("ecommerce", "clear");
  };

  return (
    <AnalyticsContext.Provider
      value={{
        event: event,
        view: pageview,
        ecommerce,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsContextProvider;
