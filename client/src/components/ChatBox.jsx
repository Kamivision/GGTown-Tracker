import { useState } from 'react';
import { chatWithGemini } from '../utilities';

export default function ChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi, ask me about available townies, quest types, or your tracked quests.',
        },
    ]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading) {
            return;
        }

        const userMessage = {
            role: 'user',
            content: trimmedInput,
        };

        const nextMessages = [...messages, userMessage];
        setMessages(nextMessages);
        setInput('');
        setIsLoading(true);

        const history = nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
        }));

        const reply = await chatWithGemini(trimmedInput, history);

        setMessages((currentMessages) => [
            ...currentMessages,
            {
                role: 'assistant',
                content: reply,
            },
        ]);
        setIsLoading(false);
    };

    return (
        <>
            <button
                className="fixed bottom-4 right-4 z-50 inline-flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-black p-0 text-sm font-medium text-white shadow-lg hover:bg-gray-700"
                type="button"
                onClick={() => setIsOpen((currentValue) => !currentValue)}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                aria-label="Toggle Gemini chat"
            >
                {/* Replace this text with an icon or image later if you want. */}
                Chat
            </button>

            {isOpen && (
                <div
                    className="fixed bottom-[calc(4rem+1.5rem)] right-0 z-50 mr-4 h-[634px] w-[440px] rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-lg"
                    style={{ boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                >
                    <div className="flex flex-col space-y-1.5 pb-6">
                        <h2 className="text-lg font-semibold tracking-tight">Chatbot</h2>
                        <p className="text-sm leading-3 text-[#6b7280]">Powered by Gemini</p>
                    </div>

                    <div
                        className="h-[474px] overflow-y-auto pr-4"
                        style={{ minWidth: '100%' }}
                    >
                        {messages.map((message, index) => {
                            const isAssistant = message.role === 'assistant';

                            return (
                                <div key={index} className="my-4 flex gap-3 text-sm text-gray-600">
                                    <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gray-100 text-xs font-semibold">
                                            {/* Replace this label with an image or icon later if needed. */}
                                            {isAssistant ? 'AI' : 'You'}
                                        </div>
                                    </span>

                                    <p className="leading-relaxed">
                                        <span className="block font-bold text-gray-700">
                                            {isAssistant ? 'AI' : 'You'}
                                        </span>
                                        {message.content}
                                    </p>
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div className="my-4 flex gap-3 text-sm text-gray-600">
                                <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gray-100 text-xs font-semibold">
                                        {/* Replace this label with an image or icon later if needed. */}
                                        AI
                                    </div>
                                </span>
                                <p className="leading-relaxed">
                                    <span className="block font-bold text-gray-700">AI</span>
                                    Thinking...
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center pt-0">
                        <form onSubmit={handleSubmit} className="flex w-full items-center justify-center space-x-2">
                            <input
                                className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm text-[#030712] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Type your message"
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-[#f9fafb] hover:bg-[#111827E6] disabled:pointer-events-none disabled:opacity-50"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}