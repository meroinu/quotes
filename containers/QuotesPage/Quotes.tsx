import Head from 'next/head';
import { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Button } from '../../components/common/Button';
import { QuotesTable } from './QuotesTable';
import { ThemeType } from '../../context/types';

export const Quotes = () => {
  const [limit, setLimit] = useState<number | undefined>(50);
  const { theme, setTheme } = useContext(ThemeContext);

  const handleChangeLimit = () => {
    /**
     * Currently only toggle between 50 or all (undefined)
     * For more values will be needed to pass an argument
    */
    setLimit((prev) => (prev ? undefined : 50));
  };

  return (
    <div>
      <Head>
        <title>Exchange Quotes</title>
        <meta name="description" content="Quotes" />
        <meta lang='en'/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Exchange Quotes</h1>
        
        <div className="control-buttons">
          <Button onClick={setTheme} className="control-button">
            {theme === ThemeType.Dark ? 'Switch to light' : 'Switch to dark'}
          </Button>
          <Button onClick={handleChangeLimit} className="control-button">
            {limit ? 'Show all' : 'Show 50'}
          </Button>
        </div>

        <QuotesTable limit={limit} />

        <style jsx>{`
          h1 {
            margin-bottom: 1.5em;
          }
          .control-buttons {
            margin-bottom: 24px;
          }
        `}</style>
      </main>
    </div>
  );
};
