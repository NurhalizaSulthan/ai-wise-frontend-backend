import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignUp Page",
  description: "This is Next.js SignUp Page",
  
};

export default function SignUp() {
  return <SignUpForm />;
}
