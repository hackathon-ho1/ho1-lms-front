'use client';

import React, { useState, useEffect, Fragment } from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import dummy from '../../../sample.json';
import Gotgam1 from '../../../public/gotgam1.svg';
import Gotgam2 from '../../../public/gotgam2.svg';
import Gotgam3 from '../../../public/gotgam3.svg';

function MyActivityPage() {
  const today = dayjs();
  const [monthData, setMonthData] = useState({
    targetMonth: dayjs(),
    startDay: dayjs().startOf('month').day(),
    daysInMonth: dayjs().daysInMonth(),
  });
  const [myActivities, setMyActivities] = useState<GotgamList[]>(dummy);
  const [myActivity, setMyActivity] = useState<GotgamList>();

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    const todaysActivity = myActivities.find((activity) => dayjs(activity.date).format('YYYY-MM-DD') === today);
    setMyActivity(todaysActivity || ({} as GotgamList));
  }, [myActivities]);

  const weekdaysData = [
    { day: '일', color: 'text-red-500' },
    { day: '월' },
    { day: '화' },
    { day: '수' },
    { day: '목' },
    { day: '금' },
    { day: '토', color: 'text-blue-500' },
  ];

  const getGotgamSvg = (dailyStudy: GotgamList) => {
    if (dailyStudy.stage <= 3) return Gotgam1;
    if (dailyStudy.stage <= 6) return Gotgam2;
    return Gotgam3;
  };

  const handleClick = (value: GotgamList) => {
    setMyActivity(value);
  };

  return (
    <div className='w-full h-full flex flex-row justify-center items-center min-w-[800px] min-h-[800px]'>
      <div className='w-1/2 h-full flex flex-col gap-10 justify-center items-center'>
        <div className='flex flex-row justify-start items-center gap-3'>
          <button> 이전 달 </button>
          <p className='font-semibold text-2xl'>{monthData.targetMonth.month() + 1}월</p>
          <button> 다음 달 </button>
        </div>
        <div className='grid grid-cols-7 gap-4 min-w-[400px] min-h-[300px]'>
          {weekdaysData.map(({ day, color }) => (
            <div key={day} className={`w-10 h-10 text-center ${color || ''}`}>
              {day}
            </div>
          ))}
          {Array.from({ length: monthData.startDay }).map((_, index) => (
            <div key={`start-${index}`} className='w-10 h-10 bg-transparent' />
          ))}
          {Array.from({ length: monthData.daysInMonth }).map((value, index) => {
            const dayData = myActivities.find((d) => dayjs(d.date).date() === index + 1 && dayjs(d.date).month() === monthData.targetMonth.month());
            let SvgComponent;
            if (dayData && !dayjs(dayData.date).isAfter(today)) {
              SvgComponent = getGotgamSvg(dayData);
            }
            return (
              <button key={`day-${index}`} className={`w-10 h-10 rounded opacity-90`} onClick={() => handleClick(dayData as GotgamList)}>
                {SvgComponent && <Image src={SvgComponent} alt='Gotgam' />}
              </button>
            );
          })}
          {Array.from({ length: 6 - ((monthData.daysInMonth + monthData.startDay - 1) % 7) }).map((_, index) => (
            <div key={`end-${index}`} className='w-10 h-10 bg-gray-200' />
          ))}
        </div>
      </div>
      <div className='w-1/2 h-full flex justify-center items-center'>
        <div className='w-full h-2/3 min-w-[400px] min-h-[300px] p-5 flex flex-col'>
          <div className='font-bold text-xl block mb-8'>활동내역</div>
          <div className='w-full h-1/2 flex flex-col gap-1 overflow-y-auto'>
            <p className='mb-3 font-semibold'>학습한 강의 목록</p>
            {myActivity?.achievedLectureList.map((lecture) => (
              <Fragment>
                <p>{lecture.courseTitle}</p>
                <p>{lecture.chatperTitle}</p>
                <p>{lecture.lectureTitle}</p>
              </Fragment>
            ))}
          </div>
          <div className='w-full h-1/2 flex flex-col gap-1 overflow-y-auto'>
            <p className='mb-3 font-semibold'>내가 도와준 문제</p>
            {myActivity?.achievedHelpList.map((helpList) => (
              <Fragment>
                <p>{helpList.questionTitle}</p>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyActivityPage;
