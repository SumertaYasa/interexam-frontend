import Categories from "~/components/landing/Categories/Categories";
import Hero from "~/components/landing/Hero/Hero";
import Navbar from "~/components/landing/Navbar/Navbar";

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
    </>
  );
}
