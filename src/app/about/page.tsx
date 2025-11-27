import Image from "next/image";
import HeaderSection from "../components/header/HeaderSection";
import { IoEyeOutline, IoLocateOutline } from "react-icons/io5";

const AboutPage = () => {
  return (
    <div>
      <HeaderSection title="About us" subTitle="Lorem ipsum dolor sitamet." />
      <div className="max-w-screen-2xl mx-auto py-20 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <Image
            src={`/hero2.jpg`}
            width={650}
            height={579}
            alt="About Image"
          />
          <div>
            <h1 className="text-5xl font-semibold text-gray-900 mb-4">
              Who we are
            </h1>
            <p className="text-gray-700 py-5">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alias
              natus expedita necessitatibus nemo quae, eius asperiores quasi
              illum. Amet, numquam.
            </p>
            <ul className="list-item space-y-6 pt-8">
              <li className="flex gap-5">
                <div className="flex-none mt-1">
                  <IoEyeOutline className="size-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Vision :</h4>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Temporibus placeat explicabo omnis excepturi cupiditate
                    quod.
                  </p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="flex-none mt-1">
                  <IoLocateOutline className="size-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Mission :</h4>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quia debitis quod laborum nisi cumque quas vitae qui,
                    quaerat ea cupiditate!
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutPage;
