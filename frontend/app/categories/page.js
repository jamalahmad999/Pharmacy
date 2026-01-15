"use client";

import CategoryBar from "@/components/layout/CategoryBar";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <CategoryBar isMobile={true} isPage={true} />
    </div>
  );
}