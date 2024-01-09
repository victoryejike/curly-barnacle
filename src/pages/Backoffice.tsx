import OrderForm from "@/components/OrderForm";

const Backoffice = () => {
  return (
    <section className="block lg:flex justify-start items-start py-8">
      <div className="w-full lg:w-9/12">
        <OrderForm />
        {/* <OrderPreview /> */}
      </div>
      {/* <OrrderSummary /> */}
    </section>
  );
};

export default Backoffice;
