"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import CategoryBar from "@/components/layout/CategoryBar";
import CartSidepanel from "@/components/CartSidepanel";
import WishlistSidepanel from "@/components/WishlistSidepanel";
import PopupBanner from "@/components/PopupBanner";
import MobileNavBar from "@/components/MobileNavBar";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isCategoriesPage = pathname === '/categories';

  return (
    <>
      {!isAdminRoute && !isCategoriesPage && (
        <>
          <Navbar />
          <CategoryBar />
        </>
      )}
      <main className={`${!isAdminRoute ? "min-h-screen pb-16 md:pb-0 md:pt-10" : ""}`}>
        {children}
      </main>
      {!isAdminRoute && (
        <>
          <CartSidepanel />
          <WishlistSidepanel />
          <PopupBanner />
          <MobileNavBar />
        </>
      )}
    </>
  );
}
