import { useEffect, useState } from 'react';
import styles from './ordersList.module.scss';
import { SearchInput } from '../../../components/searchInput/searchInput';
import { getOrderViewOrderList } from '../../../api/orderView';

export const OrdersList = ({ setSelectOrder, selectOrder, startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getOrderViewOrderList(window.location.hostname, '', startDate, endDate).then((response) => {
      console.log(response);
      // const uniqueOrderNames = [...new Set(response.data.map((item) => item.orId))];
      setData(response.data);
    });
  }, [startDate, endDate]);

  return (
    <div className={styles.orders}>
      <h2>Orders ({data.length})</h2>
      <SearchInput
        className={styles.listInput}
        placeholder={'Search order number'}
        // disabled={disabled}
        handleClearList={() => setSearchText('')}
        handleChange={(e) => setSearchText(e)}
      />
      <div className={styles.orders__list}>
        {data.length > 0 &&
          data.map(
            (item, index) =>
              item.orId.toLowerCase().includes(searchText.toLowerCase()) && (
                <span
                  key={index}
                  className={`${styles.orders__item} ${
                    selectOrder === item.orId ? styles.select : ''
                  }`}
                  onClick={() => setSelectOrder(item.orId)}
                >
                  №{item.orId}
                </span>
              )
          )}
      </div>
    </div>
  );
};