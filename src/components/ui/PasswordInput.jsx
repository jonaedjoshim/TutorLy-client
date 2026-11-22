import { useState } from 'react';
import Input from './Input';

export default function PasswordInput(props) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="rounded-md px-2 py-1.5 text-xs font-semibold text-muted transition hover:bg-sand hover:text-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      }
    />
  );
}
