export type ChatFormProps = {
    value: string;
    onChange: (e: React.FormEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function ChatForm ({value, onChange, onSubmit}: ChatFormProps) {
    return (
        <div className="flex">
        <input
          type="text"
          className="flex-1 input input-bordered input-primary"
          placeholder="Type a message..."
          value={value}
          onChange={onChange}
        />
        <button
          onClick={onSubmit}
          className="btn btn-primary"
        >
          Send
        </button>
      </div>
    )
}