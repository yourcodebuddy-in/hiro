import { Logo } from "@/components/logo";
import Script from "next/script";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="flex items-center justify-center min-h-dvh -my-5">
        <div className="flex w-full max-w-sm flex-col gap-6 items-center">
          <Logo />
          {children}
        </div>
      </div>
    </main>
  );
}
