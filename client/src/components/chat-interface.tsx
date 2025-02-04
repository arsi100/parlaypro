import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";

type Message = {
  id: string;
  type: "user" | "assistant";
  content: string;
};

const initialMessages: Message[] = [
  {
    id: "1",
    type: "assistant",
    content: "Hello! I'm your ParlayPro assistant. How can I help you with your betting strategy today?",
  },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateResponse(input),
      };
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 1000);
  }

  function generateResponse(input: string): string {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("betting strategy")) {
      return "I recommend focusing on games where you have strong knowledge of the teams and their recent performance. Always consider factors like injuries, home/away records, and head-to-head history.";
    } else if (lowerInput.includes("parlay")) {
      return "For parlays, I suggest keeping the number of legs between 2-4 for optimal risk/reward ratio. This gives you a better chance of winning while still maintaining good potential returns.";
    } else if (lowerInput.includes("odds")) {
      return "The best odds are typically found by comparing multiple sportsbooks. Look for odds discrepancies and try to get the best value for your bets.";
    }
    return "I can help you with betting strategies, parlay recommendations, and odds analysis. What specific aspect would you like to know more about?";
  }

  return (
    <div className="flex flex-col h-[400px]">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`p-3 max-w-[80%] ${
                message.type === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "mr-auto"
              }`}
            >
              {message.content}
            </Card>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about betting strategies..."
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
