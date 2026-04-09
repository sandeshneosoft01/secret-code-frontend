import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Secret Message",
  description: "Sign in to your Secret Message account to manage and share secure messages.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
