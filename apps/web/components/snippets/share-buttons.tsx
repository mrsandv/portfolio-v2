"use client";

import { Link2, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ShareButtons({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/snippets/${slug}`
      : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      "_blank"
    );
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Share:</span>
      <Button variant="outline" size="icon-sm" onClick={copyLink} aria-label="Copy link">
        <Link2 className={`size-4 ${copied ? "text-green-400" : ""}`} />
      </Button>
      <Button variant="outline" size="icon-sm" onClick={shareTwitter} aria-label="Share on X">
        <Twitter className="size-4" />
      </Button>
      <Button variant="outline" size="icon-sm" onClick={shareLinkedIn} aria-label="Share on LinkedIn">
        <Linkedin className="size-4" />
      </Button>
    </div>
  );
}
