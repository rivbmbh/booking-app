import Hero from "./components/layout/hero/Hero";
import Main from "./components/Main";

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="mt-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold uppercase">Room & Rates</h1>
          <p className="py-3">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium
            beatae deserunt magnam nam sit corporis eaque harum,
          </p>
        </div>
        <Main />
      </div>
    </div>
  );
}
