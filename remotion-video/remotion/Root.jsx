import {Composition} from 'remotion';
import {
  PortfolioIntro,
  LorawanShowcase,
  AndroidShowcase,
  Cyber03Showcase,
  CyberShowcase,
} from './Scenes';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="PortfolioIntro"
        component={PortfolioIntro}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LorawanShowcase"
        component={LorawanShowcase}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AndroidShowcase"
        component={AndroidShowcase}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Cyber03Showcase"
        component={Cyber03Showcase}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CyberShowcase"
        component={CyberShowcase}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
