import OrderForm from "@/components/OrderForm";
// import OrderPreview from "@/components/OrderPreview";
import OrderSummary from "@/components/OrderSummary";
import Banner from "../assets/bukkahut-banner.png";
import { Stepper } from "react-form-stepper";
import { useSnapshot } from "valtio";
import { state } from "@/state";

const Backoffice = () => {
  const { formStep } = useSnapshot(state);
  return (
    <section className="font-primary">
      <Stepper
        className="text-orange-400 text-medium justify-start"
        steps={[{ label: "Customer order" }, { label: "Order summary" }]}
        activeStep={formStep}
      />

      <div className="block lg:flex justify-start items-start py-8">
        <div className="w-full mr-6 bg-white">
          <img src={Banner} alt="bukkahut banner" />
          <OrderForm />
          {/* <OrderPreview /> */}
          <OrderSummary />
        </div>
        {/* <div className="w-full lg:w-4/12">
          <OrderSummary />
        </div> */}
      </div>
    </section>
  );
};

export default Backoffice;
