import { gsap } from "gsap";

export const setNavbarWhite = () => {
  const navbar = document.querySelector("#main-navbar");
  const navbarText = document.querySelectorAll(
    "#main-navbar a, #main-navbar h1, #main-navbar span"
  );
  const navbarLogo = document.querySelector("#main-navbar img");

  gsap.to(navbarText, { color: "#ffffff", duration: 0.3 });
  gsap.to(navbarLogo, { filter: "brightness(0) invert(1)", duration: 0.3 });
};

export const setNavbarOriginal = () => {
  const navbar = document.querySelector("#main-navbar");
  const navbarText = document.querySelectorAll(
    "#main-navbar a, #main-navbar h1, #main-navbar span"
  );
  const navbarLogo = document.querySelector("#main-navbar img");

  gsap.to(navbarText, { clearProps: "color", duration: 0.3 });
  gsap.to(navbarLogo, { clearProps: "filter", duration: 0.3 });
};
