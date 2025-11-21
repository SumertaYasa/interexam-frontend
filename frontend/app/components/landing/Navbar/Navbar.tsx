import { link } from "fs";
import { NavLink } from "react-router";

const menuLists = [
  { id: 1, link: "/", name: "beranda", end: true },
  { id: 2, link: "/tes", name: "tes" },
  { id: 3, link: "/paket", name: "paket" },
  { id: 4, link: "/tentang-kami", name: "tentang kami" },
];
function Navbar() {
  return (
    <nav className="capitalize font-sora ">
      <div className="mx-[100px] my-[30px] flex justify-between">
        <div>
          <h1>InterExam</h1>
        </div>
        <ul className="flex gap-[20px]">
          {menuLists.map((item) => (
            <NavLink key={item.id} to={item.link} end={item.end}>
              {item.name}
            </NavLink>
          ))}
        </ul>
        <div className="flex gap-[20px]">
          <NavLink to="/coba-gratis">coba gratis</NavLink>
          <NavLink to="/login">masuk</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
