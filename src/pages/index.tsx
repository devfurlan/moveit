import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { CountdownProvider } from '../hooks/CountdownContext';
import { ExperienceBar } from '../components/ExperienceBar';
import { Profile } from '../components/Profile';
import { CompleteChallenges } from '../components/CompleteChallenges';
import { Countdown } from '../components/Countdown';
import { ChallengeBox } from '../components/ChallengeBox';
import { ChallengesProvider } from '../hooks/ChallengesContext';

import styles from '../styles/pages/Home.module.css';

interface HomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export default function Home(props: HomeProps) {
  return (
    <ChallengesProvider
      cookieLevel={props.level}
      cookieCurrentExperience={props.currentExperience}
      cookieChallengesCompleted={props.challengesCompleted}
    >
      <div className={styles.container}>

        <Head>
          <title>move.it</title>
        </Head>

        <ExperienceBar/>

        <CountdownProvider>
          <section>
            <div>
              <Profile/>
              <CompleteChallenges/>
              <Countdown/>
            </div>
            <div>
              <ChallengeBox/>
            </div>
          </section>
        </CountdownProvider>
      </div>
    </ChallengesProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { moveit_level, moveit_current_experience, moveit_challenges_completed } = req.cookies;

  return {
    props: {
      level: Number(moveit_level),
      currentExperience: Number(moveit_current_experience),
      challengesCompleted: Number(moveit_challenges_completed),
    },
  };
};
