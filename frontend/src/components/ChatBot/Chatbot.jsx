import { useEffect, useRef } from 'react'
import '@n8n/chat/style.css'
import { createChat } from '@n8n/chat'

const Chatbot = () => {
    const chatInitialized = useRef(false)

    useEffect(() => {
        if (chatInitialized.current) return
        chatInitialized.current = true

        createChat({
            webhookUrl: import.meta.env.VITE_CHATBOT_WEBHOOK_URL,
            webhookConfig: {
                method: 'POST',
                headers: {},
            },
            target: '#n8n-chat',
            mode: 'window',
            chatInputKey: 'chatInput',
            chatSessionKey: 'sessionId',
            loadPreviousSession: true,
            showWelcomeScreen: false,
            defaultLanguage: 'en',
            initialMessages: [
                'Hi there!',
                'My name is Nathan. How can I assist you today?',
            ],
        })
    }, [])

    return <div id="n8n-chat" />
}

export default Chatbot
