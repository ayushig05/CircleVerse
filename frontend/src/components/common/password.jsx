import React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Password = ({
  name,
  label,
  placeholder = "Enter Password",
  value,
  onChange,
  inputClassName = "",
  labelClassName = "",
  iconClassName = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {label && (
        <label className={`font-semibold mb-2 block text-foreground dark:text-foreground ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          className={`px-4 py-3 rounded-lg w-full block outline-none bg-muted dark:bg-muted text-foreground dark:text-foreground border border-border focus:ring-2 focus:ring-ring ${inputClassName}`}
        />
        <button
          type="button"
          onClick={toggle}
          className={`absolute outline-none right-3 top-3 p-0 text-foreground dark:text-foreground ${iconClassName}`}
        >
          {showPassword ? (
            <Eye className="h-5 w-5 cursor-pointer" />
          ) : (
            <EyeOff className="h-5 w-5 cursor-pointer" />
          )}
        </button>
      </div>
    </>
  );
};

export default Password;
