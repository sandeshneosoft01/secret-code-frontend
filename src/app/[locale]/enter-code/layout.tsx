import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retrieve Message | Secret Message",
  description: "Enter your 6-digit code to retrieve your secure, encrypted message.",
};

export default function EnterCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
