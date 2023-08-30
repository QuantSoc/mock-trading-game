import { createContext, useState } from 'react';
import { Notification } from '../components';

export const AlertContext = createContext({
  title: null,
  text: null,
  error: () => {},
  warning: () => {},
  info: () => {},
  notify: () => {},
  success: () => {},
});
export default function AlertProvider({ children }) {
  const [title, setTitle] = useState(null);
  const [text, setText] = useState(null);
  const [open, setOpen] = useState(false);
  const setClose = () => {
    return setOpen(false);
  };

  const success = (text) => {
    setTitle('Success');
    setText(text);
    setOpen(true);
  };

  const error = (text) => {
    setTitle('Error');
    setText(text);
    setOpen(true);
  };
  const info = (text) => {
    setTitle('Info');
    setText(text);
    setOpen(true);
  };
  const notify = (data) => {
    setTitle('Info');
    setText(text);
    setOpen(true);
  };
  const warning = (text) => {
    setTitle('Warning');
    setText(text);
    setOpen(true);
  };

  const clear = () => {
    setTitle(null);
    setText(null);
  };

  return (
    <AlertContext.Provider
      value={{ title, text, error, warning, info, notify, success, clear }}
    >
      <Notification
        type={title?.toLowerCase()}
        message={text}
        open={open}
        setClose={setClose}
      />
      {children}
    </AlertContext.Provider>
  );
}
