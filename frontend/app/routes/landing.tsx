import type { Route } from "./+types/home";
import Landing from "../landing/landing";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "InterExam" },
    { name: "description", content: "Welcome to InterExam" },
  ];
}

export default function Home() {
  return <Landing />;
}
