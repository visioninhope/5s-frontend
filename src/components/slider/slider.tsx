import React, { useEffect, useState } from 'react';
import styles from './slider.module.scss';
import { ArrowLeft, ArrowRight, SliderArrow } from '../../assets/svg/SVGcomponent';
interface ImageSliderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = () => {
    const nextSlide = (currentSlide + 1) % images.length;
    setCurrentSlide(nextSlide);
  };

  const goToPreviousSlide = () => {
    const prevSlide = (currentSlide - 1 + images.length) % images.length;
    setCurrentSlide(prevSlide);
  };

  useEffect(() => {
    setCurrentSlide(0);
  }, [images]);

  console.log(currentSlide);
  return (
    <div className={styles.container}>
      {!!currentSlide && <SliderArrow onClick={goToPreviousSlide} className={styles.buttonLeft} />}
      <span className={styles.counter}>{`${currentSlide + 1}/${images.length}`}</span>
      <div className={styles.slider}>
        {images.map((photo, index) => (
          <img
            key={index}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            src={
              process.env.REACT_APP_ENV === 'proxy'
                ? `${process.env.REACT_APP_NGROK + photo.image}`
                : process.env.REACT_APP_ENV === 'wify'
                ? `${process.env.REACT_APP_IP_SERVER}${photo.image}`
                : `http://${window.location.hostname}/${photo.image}`
            }
            alt={`Slide ${index + 1}`}
            className={styles.slides}
          />
        ))}
      </div>
      {currentSlide !== images.length - 1 && (
        <SliderArrow onClick={goToNextSlide} className={styles.buttonRight} />
      )}
    </div>
  );
};

export default ImageSlider;
