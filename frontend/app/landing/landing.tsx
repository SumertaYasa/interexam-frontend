import Categories from "~/components/landing/Categories/Categories";
import Hero from "~/components/landing/Hero/Hero";
import Navbar from "~/components/landing/Navbar/Navbar";
import Philosophy from "~/components/landing/Philosophy/Philosophy";
import Preview from "~/components/landing/Preview/Preview";

export default function Landing() {
  return (
    <div className="font-noto-sans">
      <Navbar />
      <Hero />
      <Categories />
      <Philosophy />
      <Preview />
    </div>
  );
}
