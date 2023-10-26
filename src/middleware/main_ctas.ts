import { PlanItem } from "../models/user";

function getMainCtas() {
  const plans_data: PlanItem[] = JSON.parse(
    localStorage.getItem("plans_data") || "{}"
  );
  const trial = plans_data.find((plan) => plan.id === "2");
  const default_days = 7;
  const ret = {
    main: `Try It Free for ${trial ? trial.days : default_days} Days`,
    sub: "No Credit Card or Student Info Needed",
    tial: `${trial ? trial.days : default_days}-Day Free Trial!"`,
  };
  return ret;
}

export default getMainCtas;
