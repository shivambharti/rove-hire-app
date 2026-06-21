import { redirect } from "next/navigation";

export default function RootPage() {
  // Production middleware logic route standard fallback redirection
  redirect("/dashboard");
}