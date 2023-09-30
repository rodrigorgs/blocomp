export enum MessageType {
    RECEIVED,
    SENT,
}
export class ChatManager {
    element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    clear() {
        this.element.innerHTML = "";
    }

    addMessage(messageText: string, type: MessageType) {
        console.log('addMessage', type);
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(type == MessageType.SENT ? 'received' : 'sent');
        messageElement.textContent = messageText;
    
        // Append the message to the chat
        this.element.appendChild(messageElement);
    }
}