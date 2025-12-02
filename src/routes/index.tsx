import { createFileRoute } from "@tanstack/react-router";
import { Login } from "~/components/Auth/Login";

export const Route = createFileRoute("/")({
  component: Login,
});
