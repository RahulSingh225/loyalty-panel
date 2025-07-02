

import { signIn } from "@/auth";
import SignIn from "@/components/sign-in";
import { redirect } from "next/navigation";

export default function LoginPage() {

  return (
    <SignIn/>
  );
}