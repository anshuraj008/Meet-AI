"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { MessageCircleIcon, SendIcon, XIcon, MinusIcon } from "lucide-react";
import { useState } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export const OpenAIChatbox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    const trpc = useTRPC();

    const { mutate: sendMessage, isPending } = useMutation({
        ...trpc.meetings.chatWithOpenAI.mutationOptions(),
        onSuccess: (response) => {
            setMessages((prev) => [...prev, { role: "assistant", content: response.message }]);
        },
    });

    const handleSend = () => {
        if (!input.trim() || isPending) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);

        sendMessage({
            messages: [...messages, userMessage],
        });

        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50"
                size="icon"
            >
                <MessageCircleIcon className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <Card className={`fixed ${isMinimized ? 'bottom-6' : 'bottom-6'} right-6 w-96 shadow-2xl z-50 flex flex-col transition-all duration-200 ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
                <div className="flex items-center gap-2">
                    <MessageCircleIcon className="h-5 w-5" />
                    <h3 className="font-semibold">Chat with OpenAI</h3>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        <MinusIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                        onClick={() => {
                            setIsOpen(false);
                            setIsMinimized(false);
                        }}
                    >
                        <XIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                <MessageCircleIcon className="h-12 w-12 mb-2 opacity-20" />
                                <p className="text-sm">Start chatting with OpenAI</p>
                                <p className="text-xs mt-1">Ask questions during your meeting</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                                message.role === "user"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                            }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {isPending && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted rounded-lg px-4 py-2">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 border-t">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                disabled={isPending}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isPending}
                                size="icon"
                            >
                                <SendIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Card>
    );
};
