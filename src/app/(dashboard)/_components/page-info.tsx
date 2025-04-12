"use client";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";

export function PageInfo() {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink>Dashboard</BreadcrumbLink>
        </BreadcrumbList>
      </Breadcrumb>
      <h2 className="text-xl md:text-4xl font-semibold">Dashboard</h2>
      <div className="flex items-center">
        <div className="block size-8 md:size-10 border-2 border-white dark:border-gray-700 bg-[#cddbfe] rounded-full" />
        <div className="block size-8 md:size-10 border-2 border-white dark:border-gray-700 bg-[#e4ccff] rounded-full -ml-3" />
        <div className="block size-8 md:size-10 border-2 border-white dark:border-gray-700 bg-[#ffe1cc] rounded-full -ml-3" />
        <div className="block size-8 md:size-10 border-2 border-white dark:border-gray-700 bg-[#d2ecc6] rounded-full -ml-3" />
      </div>
    </div>
  );
}
