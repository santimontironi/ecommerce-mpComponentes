import { useState, useRef, useEffect } from 'react';

function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // 👇 PEGA AQUÍ TU URL DEL WEBHOOK DE N8N
    const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();

            if (!input.trim()) return;

            const userMessage = { role: 'user', content: input };
            setMessages(prev => [...prev, userMessage]);
            setInput('');
            setIsLoading(true);

            try {
                const response = await fetch(N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chatInput: input,
                    })
                });

                // 👇 VERIFICAMOS SI HAY CONTENIDO ANTES DE PARSEAR
                const text = await response.text();
                console.log('Respuesta raw de n8n:', text);

                let data;
                try {
                    data = text ? JSON.parse(text) : {};
                } catch (parseError) {
                    console.error('Error parseando JSON:', parseError);
                    throw new Error('Respuesta inválida del servidor');
                }

                console.log('Respuesta parseada:', data);

                // 👇 AJUSTAMOS PARA OBTENER LA RESPUESTA CORRECTA
                const botMessage = {
                    role: 'assistant',
                    content: data.output || data.response || data.text || data.message || JSON.stringify(data) || 'Sin respuesta'
                };
                setMessages(prev => [...prev, botMessage]);

            } catch (error) {
                console.error('Error completo:', error);
                const errorMessage = {
                    role: 'assistant',
                    content: `Error: ${error.message}. Por favor, verifica la configuración del webhook.`
                };
                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="flex flex-col h-[600px] max-w-4xl mx-auto my-8 border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                    <h3 className="text-white text-xl font-semibold text-center">
                        Asistente Virtual
                    </h3>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
                    {messages.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400 text-center">
                                ¡Hola! ¿En qué puedo ayudarte hoy?
                            </p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] px-4 py-3 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm'
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {msg.content}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Container */}
                <form
                    onSubmit={sendMessage}
                    className="flex gap-3 p-4 bg-white border-t border-gray-200"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Enviar'
                        )}
                    </button>
                </form>
            </div>
        );
    }

    export default ChatBot;