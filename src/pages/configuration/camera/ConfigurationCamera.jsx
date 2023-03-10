import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { IoSettingsSharp } from 'react-icons/io5';

import { getAveilableAlgorithms, getProcess } from '../../../api/algorithmRequest';

import { getSelectedCameras } from '../../../api/cameraRequest';
import { Back } from '../../../assets/svg/SVGcomponent';

import { parsingAlgorithmName } from '../../../functions/parsingAlgorithmName';

import { Preloader } from '../../../components/preloader';
import { CameraSettings } from '../../../components/camera/modal/cameraSettings';

import './camera-config.scss';

export const ConfigurationCamera = () => {
  const [camera, setCamera] = useState({});
  const [algorithm, setAlgorithm] = useState({});
  // const [algorithmList, setAlgorithmList] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [cookie] = useCookies(['token']);
  const navigate = useNavigate();
  const location = useParams();

  useEffect(() => {
    // getAveilableAlgorithms(window.location.hostname, cookie.token).then((res) => {
    //   let allAlgorithm = Object.keys(res.data).filter((key) => res.data[key]);
    //   setAlgorithmList(allAlgorithm);
    // });
    getSelectedCameras(window.location.hostname, cookie.token).then((res) => {
      const cameraResponse = res.data.filter((camera) => camera.id === location.camera)[0];
      setCamera(cameraResponse);
      getProcess(window.location.hostname, cookie.token).then((res) => {
        console.log(res);
        setAlgorithm(res.data.filter((process) => process.camera.id === cameraResponse.id));
      });
    });
  }, [isShowModal]);

  return (
    <>
      {Object.keys(camera).length > 0 ? (
        <section className="camera-config">
          <Back onClick={() => navigate(-1)} className="pointer" />
          <div className="camera-config__title">
            <h1>{camera.name}</h1>
            <button className="camera-config__button" onClick={() => setIsShowModal(true)}>
              <IoSettingsSharp /> Settings
            </button>
          </div>
          <h2>Algorithms</h2>
          <div className="camera-config__algorithms">
            {Object.keys(algorithm).length > 0 &&
              algorithm.map((algorithm) => (
                <div key={algorithm.process_id} className="camera-config__algorithms_item">
                  {parsingAlgorithmName(algorithm.algorithm.name)}
                </div>
              ))}
          </div>
          <div className="camera-config__recordings">
            <h2>Recordings</h2>
          </div>
        </section>
      ) : (
        <Preloader loading={true} />
      )}
      {isShowModal && (
        <CameraSettings
          IPCamera={camera.id}
          nameCamera={camera.name}
          token={cookie.token}
          setIsCameraSettings={(e) => setIsShowModal(e)}
        />
      )}
    </>
  );
};
