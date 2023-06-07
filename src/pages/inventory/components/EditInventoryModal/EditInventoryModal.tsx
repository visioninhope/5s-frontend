/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Modal } from '../../../../components/modal';

import { Input } from '../../../../components/input';
import { SelectBase } from '../../../../components/selectBase';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { editItem, selectEditInventoryModal } from './editInventoryModalSlice';
import { selectInventory } from '../../inventorySlice';
import { Coordinat } from '../../types';
import { Coordinates } from './Coordiantes';
import { Preloader } from '../../../../components/preloader';
import { Tooltip } from '../../../../assets/svg/SVGcomponent';
import tooltipImage from '../../../../assets/png/tooltipInventory.png';
import { Notification } from '../../../../components/notification/notification';

import styles from '../InventoryModal.module.scss';
import { getSuppliers } from '../../../../api/companyRequest';
import { ContactInfoType } from '../../../company/types';

type PropsType = {
  isOpen: boolean;
  handleClose: () => void;
  setIsNotification: () => void;
};

export const EditInventoryModal: React.FC<PropsType> = ({
  isOpen,
  handleClose,
  setIsNotification,
}) => {
  const dispatch = useAppDispatch();
  const { currentEditItem } = useAppSelector(selectEditInventoryModal);
  const { camerasData } = useAppSelector(selectInventory);
  const [cookies] = useCookies(['token']);
  const [currentSelect, setCurrentSelect] = useState('');
  const [coords, setCoords] = useState<Coordinat[]>([]);
  const [isClose, setIsClose] = useState<any>(false);
  const [itemName, setItemName] = useState<string | undefined>('');
  const [itemCount, setItemCount] = useState<number | undefined>(0);
  const [isTooltipClicked, setIsTooltipClicked] = useState(false);
  const [isTooltipSupplies, setIsTooltipSupplies] = useState(false);
  const [orderAmount, setOrderAmount] = useState<number | null>(0);
  const [selectedSupplierID, setSelectedSupplierID] = useState<number | null>(null);
  const [suppliersData, setSuppliersData] = useState<Array<{ id: number | string; text: string }>>(
    []
  );
  const [isAutomaticallyOrder, setIsAutomaticallyOrder] = useState(false);

  const submitHandler = () => {
    const dataForm = {
      name: itemName,
      low_stock_level: itemCount,
      camera: currentSelect,
      coords: coords.map((element: Coordinat) => {
        const { id, ...rest } = element; // Используйте деструктуризацию объекта и оператор rest
        return rest;
      }),
      id: currentEditItem?.id,
      order_quantity: orderAmount as number | null,
      suppliers: selectedSupplierID as number | null,
    };
    if (!isAutomaticallyOrder) {
      dataForm.order_quantity = null;
      dataForm.suppliers = null;
    }
    const coordNegativeArray = coords.filter(
      (coord) => coord.x1 < 0 || coord.x2 < 0 || coord.y1 < 0 || coord.y2 < 0
    );
    setIsClose({ loading: true });

    if (coords.length > 0 && coordNegativeArray.length === 0 && itemName && itemName.length > 0) {
      dispatch(
        editItem({
          token: cookies.token,
          hostname: window.location.hostname,
          body: { ...dataForm },
        })
      )
        .then((response: any) => {
          setIsClose({ status: !!response.payload?.id, loading: false });
          if (response.payload && response.payload.id) {
            handleClose();
            setIsNotification();
          } else {
            setTimeout(() => {
              setIsClose(false);
            }, 2000);
          }
        })
        .catch(() => {
          setIsClose({ status: false });
          setTimeout(() => {
            setIsClose(false);
          }, 2000);
        });
    } else {
      setIsClose({ status: false });
      setTimeout(() => {
        setIsClose(false);
      }, 2000);
    }
  };

  const handleAutoOrderToggle = () => {
    setIsAutomaticallyOrder((prevState) => !prevState);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsClose(false);
      setCurrentSelect('');
    } else {
      setItemName(currentEditItem?.name);
      setItemCount(currentEditItem?.low_stock_level);
      currentEditItem?.order_quantity && setOrderAmount(currentEditItem.order_quantity);
      currentEditItem?.suppliers && setSelectedSupplierID(currentEditItem.suppliers);
      currentEditItem?.suppliers && setIsAutomaticallyOrder(true);
    }
  }, [isOpen]);

  useEffect(() => {
    getSuppliers(window.location.hostname, cookies.token)
      .then((response) => {
        const dataForSelect = response.data.map((item: ContactInfoType) => {
          return { id: item.id, text: item.name_company };
        });
        setSuppliersData(dataForSelect);
      })
      .catch((err) => {
        console.log('setCompanyInfoError', err);
      });
  }, []);

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} className={styles.modal} disableClickBg={true}>
      <div className={styles.form}>
        <div className={styles.header}>
          <h3 className={styles.title}>Item settings</h3>
        </div>

        <div className={styles.content}>
          <div className={styles.algorithm}>
            <h2>
              Algorithm <Tooltip onClick={() => setIsTooltipClicked(true)} />
              {isTooltipClicked && (
                <>
                  <div
                    className={styles.algorithm__container}
                    onClick={() => setIsTooltipClicked(false)}
                  ></div>
                  <img src={tooltipImage} className={styles.algorithm__image} alt={'tooltip'} />
                </>
              )}
            </h2>
            <div className={styles.algorithm__toggle}>
              {currentEditItem?.multi_row ? <span>Multi row</span> : <span>Single row</span>}
            </div>
          </div>
          <form>
            <div className={styles.input}>
              <Input
                id="name"
                name="name"
                type="text"
                label="Item name"
                value={itemName}
                onChange={(e: any) => setItemName(e.target.value)}
              />
            </div>
            <div className={styles.input}>
              <Input
                id="low_stock_level"
                name="low_stock_level"
                type="text"
                label="Low stock level"
                value={String(itemCount)}
                onChange={(e: any) => setItemCount(e.target.value.replace(/[^\d.]/g, ''))}
              />
            </div>
            {camerasData && currentEditItem && (
              <div className={styles.input}>
                <SelectBase
                  id="camera_type"
                  name="camera_type"
                  label="Select a camera"
                  listOfData={camerasData}
                  activeSelect={
                    camerasData.findIndex(
                      (item: { text: string; id: string }) => item.id === currentEditItem?.camera
                    ) > -1
                      ? camerasData.findIndex(
                          (item: { text: string; id: string }) =>
                            item.id === currentEditItem?.camera
                        )
                      : 0
                  }
                  setCurrentSelect={(select) => setCurrentSelect(select)}
                  camerasData={camerasData}
                />
              </div>
            )}
          </form>
        </div>

        <div className={styles.content}>
          <div className={styles.algorithm}>
            <h2 className={styles.tooltipTitle}>
              Supplies <Tooltip onClick={() => setIsTooltipSupplies(true)} />
              {isTooltipSupplies && (
                <>
                  <div
                    className={styles.algorithm__container}
                    onClick={() => setIsTooltipSupplies(false)}
                  ></div>
                  <div className={styles.supplies_tooltip}>
                    <h6>Supplies</h6>
                    <p>
                      Upon reaching low stock level the email will be send to the supplier ordering
                      the item. Company info will be used for order details.
                    </p>
                  </div>
                </>
              )}
            </h2>

            <div className={styles.algorithm__toggle}>
              <span>Automatically order</span>
              <div
                className={`toggle ${isAutomaticallyOrder ? 'toggle--on' : 'toggle--off'}`}
                onClick={handleAutoOrderToggle}
              >
                <div className="toggle__button"></div>
              </div>
            </div>
          </div>

          {isAutomaticallyOrder && (
            <form className={styles.supplies_form}>
              {suppliersData && suppliersData.length && (
                <div className={styles.input}>
                  <SelectBase
                    id="supplier"
                    name="supplier"
                    label="Select a supplier"
                    activeSelect={selectedSupplierID}
                    listOfData={suppliersData}
                    setDefaultSelect={(select) => setSelectedSupplierID(select)}
                  />
                </div>
              )}

              <div className={styles.input}>
                <Input
                  id="orderAmount"
                  name="orderAmount"
                  type="number"
                  min={0}
                  label="Amount to order"
                  value={orderAmount?.toString() || '0'}
                  onChange={(e) => setOrderAmount(e.target.value)}
                />
              </div>
            </form>
          )}
        </div>
      </div>
      <Coordinates
        submitHandler={submitHandler}
        itemName={itemName}
        setCoords={(coords: any) => setCoords(coords)}
        coordinates={currentEditItem?.coords}
        currentSelect={currentSelect}
        handleClose={handleClose}
      />
      {isClose && (
        <>
          {isClose.loading ? (
            <div className={styles.response}>
              <section>
                <Preloader />
              </section>
            </div>
          ) : (
            !isClose.status && <Notification status={false} message={'Could not safe the item'} />
          )}
        </>
      )}
    </Modal>
  );
};
