import { MouseEventHandler, useContext } from 'react';
import { themes, ThemeContext } from '../../context/ThemeContext';

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export const Button = ({ children, onClick, className }: Props) => {
  const { theme } = useContext(ThemeContext);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    onClick();
  };

  return (
    <>
      <button role="button" onClick={handleClick} className={className}>
        {children}
      </button>

      <style jsx>{`
        button {
          display: inline-block;
          padding: 8px 16px;
          border: none;
          background: ${themes[theme].colors.button.background};
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          font-size: 16px;
          color: ${themes[theme].colors.background};
          cursor: pointer;
          text-transform: capitalize;
        }

        button:hover {
          filter: brightness(120%);
        }

        .control-button {
          margin-right: 16px;
        }

        .control-button:last-child {
          margin-right: 0;
        }
      `}</style>
    </>
  );
};
