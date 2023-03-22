import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Camera } from '../../components/camera/Camera';
import { Cover } from '../../components/cover';
import { WrapperPage } from '../../components/wrapper/wrapperPage';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { ConnectToDbModal } from './components/ConnectToDbModal';
import {
  selectConnectToDbModal,
  setIsOpenConnectToDbModal,
} from './components/ConnectToDbModal/connectToDbModalSlice';
import { DisconnectDbModal } from './components/DisconnectDbModal';
import {
  selectDisconnectDBModal,
  setIsOpenDisconnectModal,
} from './components/DisconnectDbModal/disconnectDbModalSlice';
import styles from './configuration.module.scss';
import { getConnectionsToDB, selectConnectionPage } from './connectionSlice';

export const Configuration: React.FC = () => {
  const [cookies] = useCookies(['token']);
  const { isOpenConnectToDbModal } = useAppSelector(selectConnectToDbModal);
  const { databases, isLoadingGetConnectionsToDB } = useAppSelector(selectConnectionPage);
  const { isOpenDisconnectModal } = useAppSelector(selectDisconnectDBModal);
  const dispatch = useAppDispatch();

  const handleCloseConnectModal = () => {
    dispatch(setIsOpenConnectToDbModal(false));
  };

  const handleCloseDisconnectModal = () => {
    dispatch(setIsOpenDisconnectModal(false));
  };

  const handleOpenModalConnect = () => {
    dispatch(setIsOpenConnectToDbModal(true));
  };

  const handleOpenModalDisconnect = () => {
    dispatch(setIsOpenDisconnectModal(true));
  };

  const handleConfirmDisconnectModal = () => {
    console.log('You are decconect!');
  };

  useEffect(() => {
    dispatch(
      getConnectionsToDB({
        token: cookies.token,
        hostname: window.location.hostname,
      })
    );
  }, []);

  return (
    <>
      <ConnectToDbModal isOpen={isOpenConnectToDbModal} handleClose={handleCloseConnectModal} />

      <DisconnectDbModal
        isOpen={isOpenDisconnectModal}
        dbName={
          isLoadingGetConnectionsToDB
            ? 'null'
            : databases && databases?.count > 0
            ? databases?.results[0]?.database
            : 'null'
        }
        handleClose={handleCloseDisconnectModal}
        handleConfirm={handleConfirmDisconnectModal}
      />

      <WrapperPage>
        <h2 className={styles.title}>Configuration</h2>

        <Cover className={styles.license}>
          <div>
            <p className={styles.license_title}>License</p>

            <h3 className={styles.license_count}>
              {'0/5'}&nbsp;
              <span className={styles.license_span}>algorithms used</span>
            </h3>
          </div>

          <button className={styles.button}>Upgrade Plan</button>
        </Cover>

        <div className={styles.database}>
          <div className={styles.database_header}>
            <h3 className={styles.database_header_title}>Orders View database</h3>

            {databases && databases?.count > 0 ? (
              <button
                onClick={handleOpenModalDisconnect}
                disabled={isLoadingGetConnectionsToDB}
                className={styles.button_contained}
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={handleOpenModalConnect}
                disabled={isLoadingGetConnectionsToDB}
                className={styles.button}
              >
                Connect to Database
              </button>
            )}
          </div>

          <div className={styles.database_container}>
            <p className={styles.database_desc}>
              Connect to database with your orders to view them in Orders View tab.
            </p>
            <div className={styles.database_desc}>
              <span className={styles.database_desc_title}> Status: </span>
              <span>
                {isLoadingGetConnectionsToDB
                  ? '...Loading'
                  : databases && databases?.count > 0
                  ? 'Connected'
                  : 'Not connected'}
              </span>
            </div>
            {databases && databases?.count > 0 && (
              <>
                <div>
                  <span className={styles.database_desc_title}>Database type: </span>
                  <span className={styles.database_desc}>{databases.results[0].database_type}</span>
                </div>
                <div>
                  <span className={styles.database_desc_title}>Database name: </span>
                  <span className={styles.database_desc}>{databases.results[0].database}</span>
                </div>
              </>
            )}
          </div>
        </div>
        <Camera />
      </WrapperPage>
    </>
  );
};
