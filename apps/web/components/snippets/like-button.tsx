"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { likeSnippet } from "@/lib/api/snippets";

export function LikeButton({
  slug,
  initialLikes,
}: {
  slug: string;
  initialLikes: number;
}) {
  const t = useTranslations("actions");
  const [likes, setLikes] = useState(initialLikes || 0);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  const toggle = async () => {
    if (pending) return;
    setPending(true);

    const prevLiked = liked;
    const prevLikes = likes;
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);

    try {
      const res = await likeSnippet(slug);
      setLiked(res.liked);
      setLikes(res.likes);
    } catch {
      setLiked(prevLiked);
      setLikes(prevLikes);
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="gap-1.5"
      aria-label={liked ? t("unlike") : t("like")}
    >
      <Heart
        className={`size-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
      />
      <span className="text-sm text-muted-foreground">{likes}</span>
    </Button>
  );
}
