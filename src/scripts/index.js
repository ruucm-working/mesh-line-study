
import Engine from '../utils/engine'
import HandleCameraOrbit from '../decorators/HandleCameraOrbit';
import FullScreenInBackground from '../decorators/FullScreenInBackground';
import { TimelineLite } from 'gsap';

import AnimatedText3D from '../objects/AnimatedText3D'
import app from '../app';


@FullScreenInBackground
@HandleCameraOrbit({ x: 2, y: 3 }, 0.05)
class CustomEngine extends Engine {}

const engine = new CustomEngine()

const text = new AnimatedText3D('ruucm is watching TV.', { color: '#005dfa', size: 0.8 })
text.position.x -= text.basePosition * 0.5
// text.position.y -= 0.5;
engine.add(text)

engine.start()
const tlShow = new TimelineLite({ delay: 0.2, onStart: () => {
  // lineGenerator.start();
}});
tlShow.to('.overlay', 2, { opacity: 0 });
tlShow.to('.background', 2, { y: -300 }, 0);
tlShow.fromTo(engine.lookAt, 2, { y: -8 }, { y: 0 }, 0);
tlShow.add(text.show, '-=1');

// Hide
app.onHide((onComplete) => {
  const tlHide = new TimelineLite();
  tlHide.to(engine.lookAt, 2, { y: -6, ease: Power3.easeInOut });
  tlHide.add(text.hide, 0);
  tlHide.add(lineGenerator.stop);
  tlHide.to('.overlay', 0.5, { autoAlpha: 1, onComplete }, '-=1.5');
});
