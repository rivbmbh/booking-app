"use client";

import clsx from "clsx";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { IoClose, IoMenu } from "react-icons/io5";

const NavLink = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [openDropdown, setOpenDropdown] = useState(false);

  function handleOpenDropdown() {
    setOpenDropdown((prev) => !prev);
  }
  console.info(openDropdown);
  return (
    <>
      {session?.user ? (
        <div className="flex items-center justify-end md:order-2">
          <button
            onClick={handleOpenDropdown}
            className={`hidden text-sm bg-gray-50 border rounded-full md:me-0 md:block ${
              openDropdown ? "focus:ring focus:ring-zinc-900" : ""
            } `}
          >
            <Image
              src={session.user.image || `/user-profile.png`}
              width={36}
              height={36}
              alt="Photo"
              className="object-cover rounded-full"
            />
          </button>
          <div
            className={`${
              openDropdown
                ? "absolute -bottom-32 w-max h-max bg-white shadow-md pl-3 pr-8 py-5 hidden md:block"
                : "hidden"
            }`}
          >
            <ul className="list-item space-y-4">
              <li>
                <a
                  href="#"
                  className="md:block hidden px-6 w-44 text-gray-900 hover:font-semibold transition-all duration-200 ease-in-out"
                >
                  Account Settings
                </a>
              </li>
              <li>
                <button
                  onClick={() => signOut()}
                  className="md:block hidden py-2 px-6 text-gray-900 hover:text-red-500 hover:font-bold"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center p-2 justify-center text-sm text-gray-500 rounded-md md:hidden hover:bg-gray-100"
      >
        {!open ? <IoMenu className="size-8" /> : <IoClose className="size-8" />}
      </button>
      <div className={clsx("w-full md:block md:w-auto", { hidden: !open })}>
        <ul className="flex flex-col font-semibold text-sm uppercase p-4 mt-4 rounded-sm bg-gray-50 md:flex-row md:items-center md:space-x-10 md:p-0 md:mt-0 md:border-0 md:bg-white">
          <li>
            <Link
              href="/"
              className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0 hover:font-bold active:underline"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0 hover:font-bold active:underline"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/room"
              className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0 hover:font-bold active:underline"
            >
              Rooms
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0 hover:font-bold active:underline"
            >
              Contact
            </Link>
          </li>
          {session && (
            <>
              <li>
                <Link
                  href="/myreservation"
                  className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0 hover:font-bold active:underline"
                >
                  My Reservation
                </Link>
              </li>
              {session.user.role === "admin" && (
                <>
                  <li className="relative inline-block group">
                    <ul 
                      className="md:mt-6 w-max pl-0 md:pl-3 pr-4 md:pr-10 py-1.5 md:py-4 rounded-sm -space-y-1.5 md:space-y-3 bg-white shadow-2xl
                      opacity-0 scale-95 translate-y-2
                      transition-all duration-200 ease-in-out
                      transition-discrete
                      [&:popover-open]:opacity-100
                      [&:popover-open]:scale-100
                      [&:popover-open]:translate-y-0
                      [position-anchor:--manage-room-btn] top-[anchor(bottom)] left-[anchor(left)]"
                      id="manage-room" popover="auto" 
                      >
                      <li>
                        <Link
                          href="/admin/dashboard"
                          className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0 hover:font-bold active:underline"
                        >
                          Summary
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/room"
                          className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0 hover:font-bold active:underline"
                        >
                          Room
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/roomtype"
                          className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0 hover:font-bold active:underline"
                        >
                          Room Type
                        </Link>
                      </li>
                    </ul>
                    <button 
                      popoverTarget="manage-room" 
                      className="md:mx-auto py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0 hover:font-bold active:underline uppercase flex gap-2 items-center [anchor-name:--manage-room-btn]">
                        Manage Room            
                        <FaCaretUp
                        className="
                        transition-transform duration-200 ease-in-out
                        group-has-[ul:popover-open]:rotate-180
                        "
                        />
                    </button>
                  </li>
                </>
              )}
            </>
          )}

          {session ? (
            <li className="pt-2 md:pt-0">
              <button
                onClick={() => signOut()}
                className="md:hidden py-2 px-3 uppercase text-gray-900 hover:text-red-500 hover:font-bold active:text-red-500 active:font-bold"
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li className="pt-2 md:pt-0">
              <Link
                href="/signin"
                className="py-2.5 px-6 bg-primary text-white hover:bg-primary-hover rounded-sm"
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default NavLink;
