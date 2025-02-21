
export type ChatItemProps = {
    username:string;
    time?:string;
    message:string;
}

export default function ChatItem({username,  time, message}: ChatItemProps) {
    return (
        <div className="chat chat-start">
            <div className="chat-header">
                {username}
                <time className="text-xs opacity-50"> {time}</time>
            </div>
            <div className="chat-bubble">{message}</div>
        </div>
    )

}