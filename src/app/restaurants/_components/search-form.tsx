"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SearchFormProps {
  defaultValue?: string;
}

export function SearchForm({ defaultValue = "" }: SearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState<string>(defaultValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // When cleared, auto navigate to all restaurants after a short debounce
  useEffect(() => {
    if (value.trim() !== "") return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      router.push("/restaurants");
    }, 200);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, router]);

  return (
    <form action="/restaurants" className="mx-auto flex max-w-xl gap-2">
      <input
        type="text"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for pizza, milk tea, burgers..."
        className="w-full rounded-md border px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="bg-primary rounded-md px-4 py-2 text-white"
      >
        Search
      </button>
    </form>
  );
}
