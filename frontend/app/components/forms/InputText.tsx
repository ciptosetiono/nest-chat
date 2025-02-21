export interface InputFieldProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
  }
  

export const InputText: React.FC<InputFieldProps> = ({ type, placeholder, value, onChange, icon }) => (
    <div>
      <label className="input input-bordered flex items-center gap-2">
        {icon}
        <input type={type} className="grow" placeholder={placeholder} value={value} onChange={onChange} required />
      </label>
    </div>
  );
  