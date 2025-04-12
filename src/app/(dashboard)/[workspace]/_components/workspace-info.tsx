"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IconSlash } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

interface Props {
  name: string;
}

export function WorkspaceInfo({ name }: Props) {
  const pathname = usePathname();
  const page = pathname.split("/").pop();

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>Workspace</BreadcrumbItem>
          <BreadcrumbSeparator>
            <IconSlash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>{name}</BreadcrumbItem>
          <BreadcrumbSeparator>
            <IconSlash />
          </BreadcrumbSeparator>
          <BreadcrumbLink className="capitalize">{page}</BreadcrumbLink>
        </BreadcrumbList>
      </Breadcrumb>
      <h2 className="text-xl md:text-4xl font-semibold">{name}</h2>
      <div className="flex items-center">
        <div className="block size-8 md:size-10 border-2 border-white dark:border-gray-700 bg-[#cddbfe] rounded-full" />
        <div className="block size-8 md:size-10 border-2 border-white dark:border-gray-700 bg-[#e4ccff] rounded-full -ml-3" />
        <div className="block size-8 md:size-10 border-2 border-white dark:border-gray-700 bg-[#ffe1cc] rounded-full -ml-3" />
        <div className="block size-8 md:size-10 border-2 border-white dark:border-gray-700 bg-[#d2ecc6] rounded-full -ml-3" />
      </div>
    </div>
  );
}
