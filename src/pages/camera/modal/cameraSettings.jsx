import { useEffect, useState } from 'react';
import { patchCamera } from '../../../api/cameraRequest';
import { Close } from '../../../assets/svg/SVGcomponent';
import { AlgorithmSelect } from './components/algorithmSelect';
import {
  getOperationID,
  getProcess,
  postAlgorithnDependences,
} from '../../../api/algorithmRequest';

export const CameraSettings = ({ cameraSelect, token, setIsCameraSettings }) => {
  const [cameraName, setCameraName] = useState(cameraSelect.name);
  const [algorithmsActiveObject, setAlgorithmsActiveObject] = useState(false);
  const [processLocal, setProcess] = useState([]);
  const [informationToSend, setInformationToSend] = useState({});
  const [isEnabled, setIsEnabled] = useState(true);
  const [operationID, setOperationID] = useState('');
  const [currentOperation, setCurrentOperation] = useState({});

  const applySettings = async () => {
    const response = {
      camera: {
        ip: cameraSelect.id,
        name: cameraName.length > 0 ? cameraName : cameraSelect.id,
        username: cameraSelect.username,
        password: cameraSelect.password,
      },
      algorithms: [],
    };
    for (const algorithm of informationToSend) {
      if (algorithm === 'operation_control') {
        response.algorithms = [
          ...response.algorithms,
          {
            name: algorithm,
            config: {
              operation_control_id: operationID,
            },
          },
        ];
      } else {
        response.algorithms = [...response.algorithms, { name: algorithm }];
      }

      await postAlgorithnDependences(window.location.hostname, token, response).then((res) => {
        console.log(res);
      });
    }
    setIsEnabled(false);
    console.log(response);

    await setIsCameraSettings(false);
  };

  useEffect(() => {
    getProcess(window.location.hostname, token).then((response) => {
      let bufObject = response.data?.map((item) => {
        return {
          [item.algorithm.name]: item.camera.id,
        };
      });
      bufObject = bufObject.reduce((acc, obj) => {
        const key = obj[Object.keys(obj)[0]];
        const curGroup = acc[key] ?? [];
        return { ...acc, [key]: [...curGroup, Object.keys(obj)[0]] };
      }, {});
      setProcess(response.data);
      setAlgorithmsActiveObject(bufObject);
      // console.log(bufObject);
      getOperationID(window.location.hostname, token).then((response) => {
        if (
          response.data &&
          response.data.results &&
          response.data.results.length > 0 &&
          bufObject[cameraSelect.id] &&
          bufObject[cameraSelect.id].includes('operation_control')
        ) {
          // console.log(response.data.results);
          const currentOper = response.data.results.filter(
            (item) => item.camera === cameraSelect.id
          );
          if (currentOper.length > 0) {
            setOperationID(currentOper[currentOper.length - 1].type_operation || '');
          } else {
            setOperationID('');
          }
        } else {
          setOperationID('');
        }
      });
    });
  }, []);

  return (
    <>
      {algorithmsActiveObject && (
        <>
          <section className="cameras__settings">
            <div className="cameras__settings_modal">
              <div className="cameras__settings_header">
                <h1>Camera Settings</h1>
                <Close onClick={() => setIsCameraSettings(false)} className="pointer" />
              </div>
              <p className="cameras__settings_desc">
                Successfully connected. Give camera a name that will be used in 5S Control system
                and select algorithms that will be used on it.
              </p>
              <div className="cameras__settings_container">
                <div className="cameras__settings_left">
                  <div className="cameras__settings_camera">
                    <div className="cameras__settings_inputs">
                      <div>
                        <label htmlFor="cameraName">Camera Name</label>
                        <input
                          type="text"
                          value={cameraName}
                          onChange={(e) => setCameraName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="cameraName">Controlled workplace</label>
                        <input type="text" />
                      </div>
                    </div>
                    <label>
                      <input type="checkbox" name="isRecording" value={true} />
                      &nbsp; Save recordings from this camera.
                    </label>
                  </div>
                  <AlgorithmSelect
                    token={token}
                    algorithmsActive={
                      algorithmsActiveObject[cameraSelect.id]
                        ? algorithmsActiveObject[cameraSelect.id]
                        : []
                    }
                    process={processLocal}
                    IPCamera={cameraSelect.id}
                    setInformationToSend={(e) => setInformationToSend(e)}
                    operationID={operationID}
                    setOperationID={(id) => setOperationID(id)}
                  />
                </div>
                <div className="cameras__settings_right">
                  <img
                    src={
                      process.env.REACT_APP_ENV === 'proxy'
                        ? `${process.env.REACT_APP_NGROK}/images/${cameraSelect.id}/snapshot.jpg`
                        : process.env.REACT_APP_ENV === 'wify'
                        ? `${process.env.REACT_APP_IP_SERVER}images/${cameraSelect.id}/snapshot.jpg`
                        : `http://${window.location.hostname}/images/${cameraSelect.id}/snapshot.jpg`
                    }
                    alt="Camera"
                    className="cameras__settings_img"
                  />
                </div>
              </div>
              <button disabled={!isEnabled} className="cameras__button" onClick={applySettings}>
                Done
              </button>
            </div>
          </section>
        </>
      )}
    </>
  );
};
