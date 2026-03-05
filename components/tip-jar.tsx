"use client";
import { useEffect } from "react";

const KoFiWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
    script.async = true;

    script.onload = () => {
      const kofi = (window as any).kofiWidgetOverlay;

      if (kofi) {
        kofi.draw("mrsan", {
          type: "floating-chat",
          "floating-chat.donateButton.text": "Support me",
          "floating-chat.donateButton.background-color": "#794bc4",
          "floating-chat.donateButton.text-color": "#fff",
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      const widget = document.getElementById("kofi-widget-overlay");
      if (widget) widget.remove();
    };
  }, []);

  return null;
};

export default KoFiWidget;
