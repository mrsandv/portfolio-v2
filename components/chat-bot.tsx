"use client";

import { useChat } from "@ai-sdk/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Turnstile from "react-turnstile";
import { Bot, MessageCircle, Send, X } from "lucide-react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
      body: { turnstileToken },
    });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && isVerified && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isVerified]);

  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token);
    setIsVerified(true);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border bg-secondary/50 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Mrsan Bot</p>
              <p className="text-xs text-muted-foreground">
                {isVerified ? "En línea" : "Verificando..."}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4">
            {!isVerified ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Verifica que eres humano
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Para proteger este chat de bots
                  </p>
                </div>
                <Turnstile
                  sitekey={TURNSTILE_SITE_KEY}
                  onVerify={handleTurnstileVerify}
                  theme="dark"
                />
              </div>
            ) : (
              <>
                {messages.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Hola! Soy el asistente de Marco
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Pregunta sobre su experiencia, proyectos o pide una cotización
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                      {[
                        "¿Qué tecnologías domina?",
                        "¿Está disponible para freelance?",
                        "Quiero una cotización",
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            const fakeEvent = {
                              target: { value: suggestion },
                            } as React.ChangeEvent<HTMLInputElement>;
                            handleInputChange(fakeEvent);
                            setTimeout(() => {
                              const form = document.getElementById("chat-form");
                              form?.dispatchEvent(
                                new Event("submit", { bubbles: true, cancelable: true })
                              );
                            }, 50);
                          }}
                          className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-secondary"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-3 flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md bg-secondary text-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="mb-3 flex justify-start">
                    <div className="rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-3 rounded-lg bg-destructive/10 p-3 text-xs text-destructive-foreground">
                    Error: No se pudo enviar el mensaje. Intenta de nuevo.
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          {isVerified && (
            <form
              id="chat-form"
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Escribe tu mensaje..."
                className="flex-1 rounded-xl border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                aria-label="Enviar mensaje"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
