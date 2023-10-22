export enum MessageType {
    RECEIVED = 'received',
    SENT = 'sent',
    STATUS = 'status',
    REQUEST = 'request'
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
        messageElement.classList.add(type);
        messageElement.innerHTML = messageText;
    
        // Append the message to the chat
        this.element.appendChild(messageElement);

        // Scroll to the bottom of the chat window
        this.element.scrollTop = this.element.scrollHeight;
    }
}