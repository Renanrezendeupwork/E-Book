import React, { useEffect, useState, MouseEvent } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { GET_PLANS } from "./queries";
import { PlanType } from "../../../models/plans";
import { LoaderBar } from "../../../middleware/loaders";
import Plans from "./plans";
import Payment from "./payment";
import { PageSettingItem } from "../../../models/pageSettings";
import { LoaderDots } from "../../../middleware/main_loader";

type Views = "plans" | "payment";

const PurchasePlan: React.FC = () => {
  const { data, loading } = useQuery<{
    plans: PlanType[];
    pageSettings: PageSettingItem[];
  }>(GET_PLANS, { fetchPolicy: "no-cache" });
  const [selectedPlan, setPlan] = useState<PlanType | undefined>(undefined);
  const [view, setView] = useState<Views>("plans");
  useEffect(() => {
    const document_body = document.getElementsByTagName("body")[0];
    if (document_body) {
      document_body.classList.add("white_bg");
    }
    return () => {
      document_body.classList.remove("white_bg");
    };
  }, []);

  const handlePlanSelect = (ev: MouseEvent<HTMLButtonElement>) => {
    const plan_id = ev.currentTarget.getAttribute("data-plan-id");
    if (!plan_id) return;
    const plan = data?.plans.find((p) => p.id === plan_id);
    if (!plan) return;
    setPlan(plan);
  };

  const handlePageView = (ev: MouseEvent<HTMLButtonElement>) => {
    const set_view = ev.currentTarget.getAttribute("data-view") as Views;
    if (!set_view) return;
    setView(set_view);
  };

  if (loading) {
    return (
      <main className="first-container bg-light py-5 text-center ">
        <LoaderBar fixed={true} />
        <LoaderDots size={20} />
        <p className="mt-3 text-muted">Getting Plans</p>
      </main>
    );
  }
  return (
    <main className="first-container bg-light py-5">
      <div className="container">
        <h3 className="black_text">Purchase and/or Renew Your Membership</h3>
        <hr />
        <div className="row justify-content-between">
          {view === "plans" && data?.plans ? (
            <Plans
              plans={data.plans}
              selectedPlan={selectedPlan}
              handlePlanSelect={handlePlanSelect}
            />
          ) : null}
          {view === "payment" && selectedPlan ? (
            <Payment
              selectedPlan={selectedPlan}
              paypal_setting={data?.pageSettings[0]}
              handlePageView={handlePageView}
            />
          ) : null}
          <div className="col-md-10 d-flex justify-content-between align-items-center">
            <Link to="/youraccount" className="btn btn-dark text-white green_contain_gray">
              <i className="fas fa-angle-left"></i> Go Back
            </Link>
            {view === "plans" ? (
              <button
                onClick={handlePageView}
                data-view="payment"
                className="btn btn-outline-danger  btn_lg green_contain_green"
                disabled={selectedPlan ? false : true}
              >
                <i className="fab fa-paypal"></i> Pay Now
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PurchasePlan;
