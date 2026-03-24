"use client";

import { useEffect, useState } from "react";

export interface FeatureFlags {
  chatbot: boolean;
  kofi_widget: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  chatbot: true,
  kofi_widget: true,
};

export function useFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/flags")
      .then((res) => res.json())
      .then((data) => setFlags({ ...DEFAULT_FLAGS, ...data }))
      .catch(() => setFlags(DEFAULT_FLAGS))
      .finally(() => setLoading(false));
  }, []);

  return { flags, loading };
}
