import { useEffect, useState } from 'react';
import { calculateTime } from '../../../../functions/calculateTimeDuration';
import moment from 'moment';
import { useAppDispatch } from '../../../../store/hooks';
import { addCurrentReport } from '../../../../store/dataSlice';

import './timeline.scss';
import { parsingAlgorithmName } from '../../../../functions/parsingAlgorithmName';

export const Timeline = ({ data, startDate, algorithm, startTime, endTime }) => {
  const [timeLine, setTimeLine] = useState([]);
  const dispatch = useAppDispatch();

  const duration = (start, end) => {
    return (moment(end).diff(moment(start), 'seconds') / calculateTime(startTime, endTime)) * 100;
  };

  useEffect(() => {
    if (data && data.length > 0) {
      let bufdata = data.reverse().map((dat) => {
        return {
          id: dat.id,
          start: moment(dat.start_tracking).isSame(moment(new Date(startDate)), 'day')
            ? moment(dat.start_tracking).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')
            : moment(startDate).format(`YYYY-MM-DD ${startTime}`),
          stop: moment(dat.stop_tracking).isSame(moment(new Date(startDate)), 'day')
            ? moment(dat.stop_tracking).add(3, 'hours').format('YYYY-MM-DD HH:mm:ss')
            : moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          violation_found: dat.violation_found ? 'red' : 'green',
        };
      });

      bufdata.unshift({
        id: 0,
        start: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
        stop: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
        violation_found: 'grey',
      });

      if (moment(startDate).isSame(moment(new Date()), 'day')) {
        if (new Date(`${startDate + ' ' + endTime}`) > new Date()) {
          bufdata.push({
            id: 0,
            start: moment().format('YYYY-MM-DD HH:mm:ss'),
            stop: moment().format('YYYY-MM-DD HH:mm:ss'),
            violation_found: 'yellow',
          });
        } else {
          bufdata.push({
            id: 0,
            start: moment().format(`YYYY-MM-DD ${endTime}`),
            stop: moment().format(`YYYY-MM-DD ${endTime}`),
            violation_found: 'yellow',
          });
        }
      } else {
        bufdata.push({
          id: 0,
          start: moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          stop: moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          violation_found: 'yellow',
        });
      }
      setTimeLine(bufdata);
    } else {
      setTimeLine([
        {
          id: 0,
          start: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
          stop: moment(startDate).format(`YYYY-MM-DD ${startTime}`),
          violation_found: 'grey',
        },
        {
          id: 0,
          start: moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          stop: moment(startDate).format(`YYYY-MM-DD ${endTime}`),
          violation_found: 'yellow',
        },
      ]);
    }
  }, [data]);

  console.log(timeLine);
  return (
    <>
      {timeLine.length > 1 && (
        <section className="report-page_timeline">
          <div className="timeline-clickableNew">
            <span className="timeline-clickableNew__text"> {parsingAlgorithmName(algorithm)}</span>
            <div className="timeline-clickableNew__container">
              {timeLine.map((el, index, array) => (
                <span
                  key={index}
                  onClick={() =>
                    el.id !== 0
                      ? dispatch(addCurrentReport(data.filter((item) => item.id === el.id)[0]))
                      : undefined
                  }
                  className={`timeline-clickableNew_${el.violation_found} timeline-clickableNew_pointer`}
                  style={{
                    width: `${el.violation_found !== 'yellow' ? duration(el.start, el.stop) : 0}%`,
                    marginLeft: `${
                      index === 0 ? '0px' : duration(array[index - 1].stop, el.start)
                    }%`,
                  }}
                ></span>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
