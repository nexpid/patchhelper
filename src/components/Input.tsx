import { useEffect, useRef } from "react";

export default function Input({
  onChange,
  disabled,
  error,
  value = "",
}: {
  onChange?: (text: string, previous: string) => void;
  disabled?: boolean;
  error?: string;
  value?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>();
  const prevInput = useRef("");

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = value;
  });

  return (
    <div className="flex flex-col mb-1">
      <input
        className={`bg-input-background-light dark:bg-input-background-dark text-text-normal-light dark:text-text-normal-dark text-[16px] rounded-[3px] w-full p-[10px] outline-disabled ${
          disabled && "select-none cursor-not-allowed opacity-50"
        }`}
        onChange={(e) => {
          if (!disabled) {
            const res = onChange?.(e.currentTarget.value, prevInput.current);
            if (typeof res === "string") e.currentTarget.value = res;
          }
          prevInput.current = e.currentTarget.value;
        }}
        disabled={disabled}
        type="text"
        ref={(x) => (inputRef.current = x)}
      />
      {error && (
        <h2 className="text-text-danger-light dark:text-text-danger-dark font-text-xs-normal">
          {error}
        </h2>
      )}
    </div>
  );
}
