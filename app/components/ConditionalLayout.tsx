"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Footer from "./Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isPasswordPage = pathname === "/access-password";

  return (
    <>
      {!isAdmin && !isPasswordPage && <Navigation />}
      {children}
      {!isAdmin && !isPasswordPage && <Footer />}
    </>
  );
}
