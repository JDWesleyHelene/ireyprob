import { redirect } from "next/navigation";

// This folder exists for component organisation only.
// The actual homepage is rendered at / via src/app/page.tsx
export default function HomePageRoute() {
  redirect("/");
}
