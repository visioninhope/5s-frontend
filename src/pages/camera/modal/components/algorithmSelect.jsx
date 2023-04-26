import { useEffect, useState } from 'react';
import { getAveilableAlgorithms } from '../../../../api/algorithmRequest';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName';
import { Input } from '../../../../components/input';

export const AlgorithmSelect = ({
  token,
  algorithmsActive,
  process,
  IPCamera,
  setInformationToSend,
  operationID,
  setOperationID,
}) => {
  const [algorithmList, setAlgorithmList] = useState(false);
  const [checkboxAlgo, setCheckboxAlgo] = useState(
    algorithmsActive ? Object.assign([], algorithmsActive) : []
  );

  useEffect(() => {
    getAveilableAlgorithms(window.location.hostname, token).then((res) => {
      let allAlgorithm = Object.keys(res.data).filter((key) => res.data[key]);
      setAlgorithmList(allAlgorithm);
    });
  }, []);

  useEffect(() => {
    let willDelete = algorithmsActive
      ? algorithmsActive.filter((el) => !checkboxAlgo.includes(el))
      : [];
    let willAdd = checkboxAlgo.filter((el) => !algorithmsActive.includes(el));
    let sendDelete = process.filter((element) => {
      return element.camera.id === IPCamera && willDelete.includes(element.algorithm.name);
    });
    // console.log(sendDelete);
    const changedAfterSelect = {
      delete: sendDelete, // .map((el) => el.process_id),
      add: willAdd,
    };
    setInformationToSend(changedAfterSelect);
  }, [checkboxAlgo]);

  const checkboxHandler = (state) => {
    if (checkboxAlgo.includes(state)) {
      setCheckboxAlgo(checkboxAlgo.filter((item) => item !== state));
    } else {
      setCheckboxAlgo([...checkboxAlgo, state]);
    }
  };

  return (
    <div className="cameras__settings_algorithms">
      <h1 className="cameras__settings_algorithms_title">
        {algorithmsActive ? algorithmsActive.length : 0}/{algorithmList ? algorithmList.length : 0}{' '}
        <span>algorithms used</span>
      </h1>
      <div className="cameras__settings_algorithms_list">
        {algorithmList &&
          algorithmList.length > 0 &&
          algorithmList.map((algorithm, index) => (
            <div className="cameras__settings_algorithms_container" key={index}>
              <label className="cameras__settings_algorithms_list_item">
                {parsingAlgorithmName(algorithm)}
                <input
                  type="checkbox"
                  defaultChecked={algorithmsActive && algorithmsActive.includes(algorithm)}
                  onChange={() => checkboxHandler(algorithm)}
                  className={'checkbox'}
                />
              </label>
              {parsingAlgorithmName(algorithm) === 'Operation control' && (
                <>
                  <h2>Controlled operation</h2>
                  <Input
                    className={'cameras__settings_algorithms_container_input'}
                    placeholder={'Enter ID'}
                    value={operationID}
                    onChange={(e) => setOperationID(e.target.value.replace(/[^\d]/g, ''))}
                  />
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};