import OrderForm from "@/components/OrderForm";
import OrderPreview from "@/components/OrderPreview";
import OrderSummary from "@/components/OrderSummary";
import Banner from "../assets/bukkahut-banner.png";

const Backoffice = () => {
  return (
    <section className="block lg:flex justify-start items-start py-8">
      <div className="w-full lg:w-8/12 mr-6 bg-white">
        <img src={Banner} alt="bukkahut banner" />
        <OrderForm />
        <OrderPreview />
      </div>
      <div className="w-full lg:w-4/12">
        <OrderSummary />
      </div>
    </section>
  );
};

export default Backoffice;
