import Logo from "../assets/bukkahut.svg";

const Header = () => {
  return (
    <div className="shadow-md">
      <div className="max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto lg:mx-[156px] py-5 flex justify-start items-center">
        <img src={Logo} alt="bukkahut logo" />
        <p className="font-semibold text-xl leading-8 text-gray-900 pl-2">
          Bukka Hut
        </p>
      </div>
    </div>
  );
};

export default Header;
