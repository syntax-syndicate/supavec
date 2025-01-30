"use client";

import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";
import { CornerRightUp } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostHog } from "posthog-js/react";

export const Chat = ({ fileId }: { fileId: string }) => {
  const [showResult, setShowResult] = useState(false);
  const posthog = usePostHog();

  const { messages, isLoading, handleSubmit, input, setInput } = useChat({
    body: {
      fileId,
    },
    api: "/api/examples/chat-with-pdf",
    initialMessages: [],
    onResponse() {
      setShowResult(true);
    },
  });

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowResult(false);
    posthog.capture("Chatting with PDF example", {}, { send_instantly: true });

    console.log("submitted");
    handleSubmit();
  };

  return (
    <div>
      <form className="relative" onSubmit={submitForm}>
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 z-0" />
          <Input
            className="relative mx-auto h-[52px] flex border border-input px-3 shadow-sm focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed md:text-sm max-w-xl bg-muted w-full rounded-2xl sm:rounded-3xl pl-10 sm:pl-12 pr-12 sm:pr-16 placeholder:text-foreground/70 border-none dark:ring-white/30 text-black dark:text-white text-wrap py-3 sm:py-4 text-sm sm:text-base max-h-[200px] overflow-y-auto leading-[1.2] min-h-[52px] z-10"
            placeholder="What do you want to ask?"
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 rounded-xl bg-black/5 dark:bg-white/5 py-1 px-1 z-10"
          >
            <CornerRightUp className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </form>
      <div className="mt-4">
        {isLoading && !showResult ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <p>{messages.at(-1)?.content}</p>
        )}
      </div>
    </div>
  );
};
