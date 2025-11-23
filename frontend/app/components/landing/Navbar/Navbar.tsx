import { NavLink } from "react-router";

const menuLists = [
  { id: 1, link: "/", name: "beranda", end: true },
  { id: 2, link: "/tes", name: "tes" },
  { id: 3, link: "/paket", name: "paket" },
  { id: 4, link: "/tentang-kami", name: "tentang kami" },
];
function Navbar() {
  return (
    <nav
      id="main-navbar"
      className="capitalize cursor-pointer font-sora w-full z-50 fixed top-0 left-0"
    >
      <div className="mx-[100px] my-[30px] flex justify-between items-center">
        <div className="flex justify-center items-center gap-2.5">
          <img
            className="w-[40px] h-full"
            src="/interexam-logo.svg"
            alt="interexam logo"
          />
          <h1 className=" text-body-m-semibold">
            Inter<span className="text-secondary">E</span>xam
          </h1>
        </div>
        <ul className="flex gap-[30px] ">
          {menuLists.map((item) => (
            <li key={item.id} className="relative">
              <NavLink
                key={item.id}
                to={item.link}
                end={item.end}
                className={({ isActive }) =>
                  `
                text-body-m-semibold before:content-[""] before:absolute before:h-[10px] before:rounded-[var(--radius-full)] before:bg-secondary before:left-[-10px] before:z-[-10] before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:duration-300 before:ease-in-out 
                ${
                  isActive
                    ? `before:opacity-100 before:w-[10px]`
                    : `before:opacity-0 hover:before:opacity-100 hover:before:w-[10px]`
                }             
              `
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex gap-[20px]">
          <span className="text-body-m-bold text-primary hover:text-primary/80">
            <NavLink to="/coba-gratis">coba gratis</NavLink>
          </span>
          <NavLink className="text-body-m-semibold" to="/login">
            masuk
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
