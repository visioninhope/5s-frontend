import React, { ChangeEvent, useState } from 'react';
import { SelectArrow } from '../../assets/svg/SVGcomponent';
import styles from './selectBase.module.scss';

type PropsType = {
  listOfData: Array<{ id: number; text: string }>;
  id: string;
  name: string;
  label?: string;
  className?: string;
};

export const SelectBase: React.FC<PropsType> = ({ listOfData, id, label, name, className }) => {
  const [dataSelect, setDataSelect] = useState<string>(listOfData[0].text);

  const handleOnChangeSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    setDataSelect(e.target.value);
  };

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.block}>
        <select
          name={name}
          id={id}
          value={dataSelect}
          onChange={handleOnChangeSelection}
          className={`${styles.block__select} ${className}`}
        >
          {listOfData.map((item) => (
            <option key={item.id} value={item.text} className={styles.block__option}>
              {item.text}
            </option>
          ))}
        </select>

        <SelectArrow className={styles.block__arrow} />
      </div>
    </div>
  );
};
