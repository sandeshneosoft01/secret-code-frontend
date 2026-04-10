import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Secret Message",
  description: "Join Secret Message to start sharing secure, encrypted, and self-destructing messages.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
