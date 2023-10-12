import { Carousel } from 'react-bootstrap';
import '../styles/components/Hero.css'
import heroImg1 from '../images/heroImg1.jpg';
import heroImg2 from '../images/heroImg2.jpg';
import heroImg3 from '../images/heroImg3.jpg';
import heroImg4 from '../images/heroImg4.jpg';

function Hero() {
  return (
<>
<div className="caption">
  <p className="hero-title">You have arrived to <em>Sneakicks</em>.</p>
  <p className="subtitle">The Place where you can get your dream shoes!</p>
</div>
<Carousel>
    <Carousel.Item interval={2000}>
      <img src={heroImg1} className="d-block w-100 hero-section" alt="carousel-img" />
    </Carousel.Item>

    <Carousel.Item interval={2000}>
      <img src={heroImg2} className="d-block w-100 hero-section" alt="carousel-img" />
    </Carousel.Item>

    <Carousel.Item interval={2000}>
      <img src={heroImg3} className="d-block w-100 hero-section" alt="carousel-img" />
    </Carousel.Item>

    <Carousel.Item interval={2000}>
      <img src={heroImg4} className="d-block w-100 hero-section" alt="carousel-img" />
    </Carousel.Item>

</Carousel>
</>
  );
}

export default Hero;

