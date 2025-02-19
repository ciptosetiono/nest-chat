export type ChatFormProps = {
    value: string;
    onChange: (e: React.FormEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function ChatForm ({value, onChange, onSubmit}: ChatFormProps) {
    return (
        <div className="flex mt-4">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-lg"
          placeholder="Type a message..."
          value={value}
          onChange={onChange}
        />
        <button
          onClick={onSubmit}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    )
}