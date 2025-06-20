"use client";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import SuccessContent from "../../../components/SuccessContent";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center min-h-[40vh] gap-4">
          <Loader className="w-10 h-10 animate-spin text-[var(--cake-pink)]" />
          <span className="text-[var(--cake-brown)]">
            Looking up your order…
          </span>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
