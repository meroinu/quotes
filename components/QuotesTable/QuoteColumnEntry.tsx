import { memo, useContext } from 'react';
import { themes, ThemeContext } from '../../context/ThemeContext';
import { QuoteEntryUpdateType } from '../../types/quotes';

type Props = {
  value: string | null;
  updateType?: QuoteEntryUpdateType;
};

export const TickerColumnEntry = ({
  value,
  updateType,
}: Props): JSX.Element => {
  const { theme } = useContext(ThemeContext);

  return (
    <td>
      {value || '—'}
      
      <style jsx>
        {`
          td {
            padding: 8px 16px;
            width: 16%;
            text-align: right;
            ${typeof updateType !== 'undefined'
              ? `background: ${
                  updateType === QuoteEntryUpdateType.Up
                    ? themes[theme].colors.table.updateUp
                    : themes[theme].colors.table.updateDown
                };`
              : null}
          }

          td:first-child {
            width: 20%;
            text-align: left;
          }
        `}
      </style>
    </td>
  )
};
