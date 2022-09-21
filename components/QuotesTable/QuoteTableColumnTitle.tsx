import { MouseEvent } from 'react';
import { OrderType, QuotesTableColumn } from '../../types/quotes';

type Props = {
  title: QuotesTableColumn;
  filterOrder: OrderType;
  showOrderIcon: boolean;
  onClick: (criteria: QuotesTableColumn, order: OrderType) => void;
};

export const QuoteTableColumnTitle = ({
  title,
  filterOrder,
  showOrderIcon,
  onClick,
}: Props) => {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    onClick(
      title,
      filterOrder === OrderType.ASC ? OrderType.DESC : OrderType.ASC
    );
  };

  return (
    <th onClick={handleClick} role="button">
      <div>
        <span>{title}</span>
        <span className="order-icon">
          {showOrderIcon ? (filterOrder === OrderType.ASC ? '🔼' : '🔽') : null}
        </span>
      </div>

      <style jsx>{`
        th {
          padding: 8px 16px;
          text-align: right;
          cursor: pointer;
        }

        div {
          display: flex;
          justify-content: flex-end;
          align-items: top;
        }

        th:first-child {
          text-align: left;
        }

        th:first-child div {
          justify-content: flex-start;
        }

        span {
          display: inline-block;
        }

        .order-icon {
          width: 24px;
          height: 24px;
          margin-left: 8px;
        }
      `}</style>
    </th>
  );
};
