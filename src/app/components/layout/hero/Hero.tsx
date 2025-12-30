import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative h-screen text-white overflow-hidden">
      <div className="bg-black/40 absolute inset-0 z-10"></div>
      <div className="absolute inset-0">
        <Image
          src={`/hero4.jpg`}
          className="object-cover object-center"
          alt="hero image"
          fill
        />
      </div>
      <div className="relative flex flex-col justify-center items-center h-full text-center z-20">
        <h1 className="text-7xl font-extrabold leading-tight mb-3 capitalize ">
          Book your luxury room
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Get special offer just for you today{" "}
        </p>
        <div className="flex gap-5">
          <Link
            href={`/room`}
            className="bg-primary text-white hover:bg-primary-hover py-2 px-6 md:px-10 text-lg font-semibold hover:scale-105 hover:shadow-lg"
          >
            Book now
          </Link>
          <Link
            href={`/contact`}
            className="bg-transparent border border-primary text-white hover:bg-primary-hover py-2 px-6 md:px-10 text-lg font-semibold hover:scale-105 hover:shadow-lg"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
