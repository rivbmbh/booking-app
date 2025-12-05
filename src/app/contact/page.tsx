import { Metadata } from "next";
import HeaderSection from "../components/layout/header/HeaderSection";
import {
  IoCallOutline,
  IoLocationOutline,
  IoMailOutline,
} from "react-icons/io5";
import ContactForm from "../components/ui/common/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
};

const Contact = () => {
  return (
    <div>
      <HeaderSection
        title="Contact Us"
        subTitle="Lorem ipsum dolor sit amet."
      />
      <div className="max-w-screen-2xl mx-auto py-20 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-lg text-gray-500 mb-3">Contact us</h1>
            <h1 className="text-5xl font-semibold text-gray-900 mb-4">
              Get in touch today
            </h1>
            <p className="text-gray-700 py-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
              amet maiores reprehenderit sapiente quo.
            </p>
            <ul className="list-item">
              <li className="flex gap-5">
                <div className="flex-none bg-gray-300 p-3 shadow-sm rounded-sm">
                  <IoMailOutline className="size-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Email :</h4>
                  <p>email-us@example.com</p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="flex-none bg-gray-300 p-3 shadow-sm rounded-sm">
                  <IoCallOutline className="size-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Phone Number :</h4>
                  <p>+ 67432 7899 8090, +6288 8732 0989</p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="flex-none bg-gray-300 p-3 shadow-sm rounded-sm">
                  <IoLocationOutline className="size-7" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">Address :</h4>
                  <p>Error street road 2025, RAB, INDONESIA</p>
                </div>
              </li>
            </ul>
          </div>
          {/* contact form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
