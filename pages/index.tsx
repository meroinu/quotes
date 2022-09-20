import type { NextPage } from 'next';
import { useState } from 'react';
import { Quotes } from '../containers/QuotesPage/Quotes';
import { ThemeContext, themes } from '../context/ThemeContext';
import { ThemeType } from '../context/types';

const Home: NextPage = () => {
  const [theme, setTheme] = useState<ThemeType>(ThemeType.Light);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === ThemeType.Light ? ThemeType.Dark : ThemeType.Light
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
      <Quotes />
      <style jsx global>
        {`
          html,
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          html {
            padding: 0;
          }

          body {
            padding: 20px;
            background: ${themes[theme].colors.background};
            color: ${themes[theme].colors.foreground};
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          * {
            box-sizing: border-box;
          }

          .mono-font {
            font-family: SFMono-Regular, Menlo, Monaco, Consolas,
              'Liberation Mono', 'Courier New', monospace;
          }
        `}
      </style>
    </ThemeContext.Provider>
  );
};

export default Home;
