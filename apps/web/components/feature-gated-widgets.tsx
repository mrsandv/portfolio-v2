"use client";

import { useFeatureFlags } from "@/hooks/use-feature-flags";
import { ChatBot } from "@/components/chat-bot";
import KoFiWidget from "@/components/tip-jar";

export function FeatureGatedWidgets() {
  const { flags, loading } = useFeatureFlags();
  if (loading) return null;

  return (
    <>
      {flags.kofi_widget && <KoFiWidget />}
      {flags.chatbot && <ChatBot />}
    </>
  );
}
