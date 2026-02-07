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
                headers: {}
            },
            target: '#n8n-chat',
            mode: 'window',
            chatInputKey: 'chatInput',
            chatSessionKey: 'sessionId',
            loadPreviousSession: true,
            metadata: {},
            showWelcomeScreen: false,
            defaultLanguage: 'es',
            initialMessages: [
                '👋 Hola, soy el asistente de mpcomponentes.',
                'Consultá por productos, precios o compatibilidad.'
            ],
            i18n: {
                es: {
                    title: '👋 Bienvenido a mpcomponentes',
                    subtitle: 'Consultá por productos, precios, stock o compatibilidad.',
                    footer: '',
                    getStarted: 'Iniciar conversación',
                    inputPlaceholder: 'Escribí tu consulta...',
                },
            },
        })
    }, [])

    return <div id="n8n-chat" />
}

export default Chatbot
