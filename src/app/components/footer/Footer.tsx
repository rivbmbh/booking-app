import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-4 w-full py-10 md:py-16">
        <div className="grid md:grid-cols-3 gap-7 ">
          <div>
            <Link href="/" className="mb-10 block">
              <Image src="/logo.png" width={128} height={49} alt="logo" />
            </Link>
            <p className="text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              nesciunt harum facilis eos quasi porro explicabo autem animi aut
              numquam!
            </p>
          </div>
          <div>
            <div className="flex gap-20">
              <div className="flex-1 md:flex-none">
                <h4 className="mb-8 text-xl font-semibold text-white">Links</h4>
                <ul className="list-item space-y-4 text-gray-400">
                  <li>
                    <Link href="/" className="hover:text-white hover:underline">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-white hover:underline"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/rooms"
                      className="hover:text-white hover:underline"
                    >
                      Rooms
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-white hover:underline"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex-1 md:flex-none">
                <h4 className="mb-8 text-xl font-semibold text-white">Legal</h4>
                <ul className="list-item space-y-4 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white hover:underline">
                      Legal
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white hover:underline">
                      Term & Condition
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white hover:underline">
                      Payment Method
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h4 className="mb-8 text-xl font-semibold text-white">
              Newsletter
            </h4>
            <p className="text-gray-400">
              Lorem ipsum dolor sit amet consectetur.
            </p>
            <form action="" className="mt-5">
              <div className="mb-5">
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="w-full p-3 rounded-sm bg-white text-slate-800"
                  placeholder="jhondoe@example.com"
                />
                <button className="bg-orange-400 p-3 mt-3 font-bold text-white w-full text-center rounded-sm hover:bg-orange-500">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 border-t border-gray-500 py-8 text-center text-base text-gray-500 ">
        &copy; Copyright 2025 | Sangiara Digital | All Right Reserved
      </div>
    </footer>
  );
};

export default Footer;
