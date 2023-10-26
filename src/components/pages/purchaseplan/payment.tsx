import React, { useEffect, MouseEvent, useContext } from "react";
import * as Sentry from "@sentry/react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

import { PlanType } from "../../../models/plans";
import { PageSettingItem } from "../../../models/pageSettings";
import { IconJumbotron } from "../../common/icons";
import { useMutation } from "@apollo/client";
import { PAYMUTATION } from "./queries";
import {
  AnalyticsContext,
  EcommerceData,
} from "../../../context/analytics-context";
import { LoaderBar } from "../../../middleware/loaders";

type PaymentProps = {
  selectedPlan: PlanType;
  paypal_setting?: PageSettingItem;
  handlePageView: (ev: MouseEvent<HTMLButtonElement>) => void;
};

type PaypalSettingsType = {
  active: boolean;
  mode: "sandbox" | "production";
  sandbox_client_id: string;
  production_client_id: string;
};

type Paypal = {
  color?: "gold" | "blue" | "silver" | "white" | "black";
  height?: number;
  label?:
    | "paypal"
    | "checkout"
    | "buynow"
    | "pay"
    | "installment"
    | "subscribe"
    | "donate";
  layout?: "vertical" | "horizontal";
  shape?: "rect" | "pill";
  tagline?: boolean;
};

const currency = "USD";
const style: Paypal = { layout: "vertical", label: "pay" };

const Payment: React.FC<PaymentProps> = ({
  selectedPlan,
  paypal_setting,
  handlePageView,
}) => {
  const paypal_settings = JSON.parse(
    paypal_setting?.description || "[]"
  ) as PaypalSettingsType[];
  const paypal = paypal_settings[0];
  return (
    <>
      <div className="col-md-6">
        {paypal_setting ? (
          <PayPalScriptProvider
            options={{
              "client-id":
                paypal.mode === "sandbox"
                  ? paypal.sandbox_client_id
                  : paypal.production_client_id,
              components: "buttons",
              currency,
            }}
          >
            <ButtonWrapper
              currency={currency}
              showSpinner={false}
              selectedPlan={selectedPlan}
            />
          </PayPalScriptProvider>
        ) : (
          <IconJumbotron
            icon="fa-solid fa-bug-slash"
            txt="Something went wrong"
            help_text="please refresh and try again"
          />
        )}
      </div>
      <div className="col-md-4">
        <div className="card round">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center pb-3">
              <h6>Order Details</h6>{" "}
              <button
                onClick={handlePageView}
                data-view="plans"
                className="btn text-primary text-underlined btn_sm"
              >
                Change Plan
              </button>
            </div>
            <table className="table">
              <tbody>
                <tr>
                  <td>Plan</td>
                  <td className="text-right">{selectedPlan.name}</td>
                </tr>
                {selectedPlan.regular_price ? (
                  <tr>
                    <td>Regular Price</td>
                    <td className="text-right">
                      <del>${selectedPlan.regular_price}</del>
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td>Total </td>
                  <td className="text-right">
                    <h4>
                      <b>${selectedPlan.price_amount}</b>
                    </h4>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-3 p-2">
          <h5>Prefer to pay by purchase order?</h5>
          <p>
            {" "}
            You can purchase or renew your membership at Teacher's Discovery®.
            Multi-year and district discounts are available by calling us at
            <br /> 1-800-TEACHER. <br />
            <a
              href="https://www.teachersdiscovery.com/product/flangoo-spanish-digital-readers-subscription/spanish"
              className="btn btn-danger mt-3 mb-4 btn-block text-white"
            >
              Shop at Teacher's Discovery
            </a>
            <br />
            Your Flangoo account does not auto-renew.
          </p>
        </div>
      </div>
    </>
  );
};

type ButtonWrapperProps = {
  currency: string;
  showSpinner: boolean;
  selectedPlan: PlanType;
};
const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  currency,
  showSpinner,
  selectedPlan,
}) => {
  const analyticsContext = useContext(AnalyticsContext);
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const [makePayment, { data, error: payment_error, called }] =
    useMutation(PAYMUTATION);
  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, showSpinner]);

  useEffect(() => {
    if (payment_error) {
      console.log("payment.tsx:213 | error", payment_error);
      Sentry.captureMessage(
        "Payment Mutation Error Hook",
        Sentry.Severity.Fatal
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment_error]);

  useEffect(() => {
    if (data && data.paymentSuccess) {
      ///save event to google analytics
      const event = {
        category: "User",
        action: "Subscription",
        label: `${selectedPlan.name}`,
        value: selectedPlan.price_amount,
      };
      analyticsContext.event(event);
      window.location.href = "/youraccount";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      {showSpinner || isPending ? <LoaderBar /> : null}
      {called ? (
        payment_error ? (
          <IconJumbotron
            icon="far fa-exclamation-circle text-danger"
            classes="my-3 py-3"
            txt="Oh oh!"
            help_text="Something went wrong. Please contact customer support."
            cta={{
              txt: "Contact Support",
              link: "/help",
              classes: "btn btn-danger text-white",
            }}
          />
        ) : (
          <IconJumbotron
            icon="far fa-check-circle text-success"
            classes="my-3 py-3"
            txt="Payment Successful"
            help_text="Please don't close or refresh the page. Your subcriptions is beeing updated."
          />
        )
      ) : (
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[selectedPlan.price_amount, currency, style]}
          fundingSource={undefined}
          createOrder={async (_, actions) => {
            const orderId = await actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: selectedPlan.price_amount.toLocaleString(),
                  },
                },
              ],
              application_context: {
                shipping_preference: "NO_SHIPPING",
              },
            });
            return orderId;
          }}
          onError={(err) => {
            console.log("payment.tsx:201 | err", err);
            Sentry.captureMessage(
              "Paypal Payment Error",
              Sentry.Severity.Fatal
            );
          }}
          onApprove={async (data, actions) => {
            try {
              const details = await actions!.order!.capture();
              console.log("payment.tsx:205 | actions", actions);
              console.log("payment.tsx:206 | details", details);
              try {
                makePayment({
                  variables: {
                    pay_id: details.id,
                    plan_id: selectedPlan.id,
                    method: "paypal",
                  },
                });
                const ecommerce_data: EcommerceData = {
                  id: details.id,
                  sku: selectedPlan.sku,
                  subscription: selectedPlan.name,
                  category: "Subscriptions",
                  name: "addSubscription",
                  revenue: selectedPlan.price_amount.toLocaleString(),
                };
                analyticsContext.ecommerce(ecommerce_data);
              } catch (error) {
                ////log error to sentry
                console.log("payment.tsx:232 | error", error);
                Sentry.captureMessage(
                  "Payment Mutation Error",
                  Sentry.Severity.Fatal
                );
                return;
              }
            } catch (error) {
              ////log error to sentry
              console.log("payment.tsx:241 | error", error);
              Sentry.captureMessage(
                "Paypal Payment Error",
                Sentry.Severity.Fatal
              );
              return;
            }
          }}
        />
      )}
    </>
  );
};

export default Payment;
