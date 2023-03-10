import React, { useEffect } from 'react';
import { Select } from '../../components/select/select';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import styles from './previewOrders.module.scss';
import { OrderItem } from '../../storage/orderView';
import { OrderCard } from './components/OrderCard';
import { OrderList } from './components/OrdersList';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectActiveOrder } from './components/OrdersList/ordersListSlice';
import { Cover } from '../../components/cover';
import { defenitionAsync, selectOrders, getOrdersIdAsync } from './previewOrdersSlice';
import { useCookies } from 'react-cookie';
import { Preloader } from '../../components/preloader';

export const PreviewOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeOrder } = useAppSelector(selectActiveOrder);
  const [cookies] = useCookies(['token']);
  const { orderData, previewOrdersList, isLoadingPreviewList } = useAppSelector(selectOrders);

  const listOfDate = [
    { id: 1, text: 'Last month, 2023 Jan 16 - Feb 16' },
    { id: 2, text: 'Last month, 2023 Feb 17 - Mar 16' },
    { id: 3, text: 'Last month, 2023 Mar 17 - Apr 16' },
    { id: 4, text: 'Last month, 2023 Apr 17 - May 16' },
  ];

  const listOfstatus = [
    { id: 1, text: 'Started' },
    { id: 2, text: 'Completed' },
  ];

  useEffect(() => {
    dispatch(getOrdersIdAsync({ token: cookies.token, hostname: window.location.hostname }));
  }, []);

  useEffect(() => {
    console.log(activeOrder);
    activeOrder &&
      dispatch(
        defenitionAsync({
          token: cookies.token,
          hostname: window.location.hostname,
          currentOrder: activeOrder,
        })
      );
  }, [activeOrder]);

  return (
    <WrapperPage>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Orders View</h2>

          {/* <div className={styles.selectContainer}>
            <Select listOfData={listOfstatus} />
            <Select className={styles.listOfDate} listOfData={listOfDate} />
          </div> */}
        </div>

        {!isLoadingPreviewList && previewOrdersList ? (
          <div className={styles.body}>
            <OrderList data={previewOrdersList} />

            {activeOrder && orderData ? (
              <OrderCard data={orderData} />
            ) : (
              <Cover className={styles.noOrder}>
                <h4 className={styles.title}>No order</h4>
                <p className={styles.subtitle}>Select an order from the list on the left</p>
              </Cover>
            )}
          </div>
        ) : (
          <Preloader loading={isLoadingPreviewList} />
        )}
      </div>
    </WrapperPage>
  );
};
