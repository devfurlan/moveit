import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengeContextData {
  level: number;
  currentExperience: number;
  challengesComplete: number;
  experienceToNextLevel: number;
  activeChallenge: Challenge;
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
  closeLevelUpModal: () => void;
}

interface ChallengesProviderProps {
  children: ReactNode;
  cookieLevel: number;
  cookieCurrentExperience: number;
  cookieChallengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengeContextData);

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {
  const [level, setLevel] = useState(rest.cookieLevel ?? 1);
  const [currentExperience, setCurrentExperience] = useState(rest.cookieCurrentExperience ?? 0);
  const [challengesCompleted, setChallengesCompleted] = useState(rest.cookieChallengesCompleted ?? 0);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isLevelOpenModalOpen, setIsLevelOpenModalOpen] = useState(false);

  const experienceToNextLevel = Math.pow(((level + 1) * 4), 2);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    Cookies.set('moveit_level', String(level));
    Cookies.set('moveit_current_experience', String(currentExperience));
    Cookies.set('moveit_challenges_completed', String(challengesCompleted));
  }, [level, currentExperience, challengesCompleted]);

  const startNewChallenge = useCallback(() => {
    const randomChallengesIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengesIndex];

    setActiveChallenge(challenge as Challenge);

    new Audio('/notification.mp3').play();

    if (Notification.permission === 'granted') {
      new Notification('Novo desafio!', {
        body: `Valendo ${challenge.amount}xp!`,
      });
    }
  }, [challenges, setActiveChallenge]);

  const levelUp = useCallback(() => {
    setLevel(level + 1);
    setIsLevelOpenModalOpen(true);
  }, [setLevel, level, setIsLevelOpenModalOpen]);

  const closeLevelUpModal = useCallback(() => {
    setIsLevelOpenModalOpen(false);
  }, [setIsLevelOpenModalOpen]);

  const completeChallenge = useCallback(() => {
    if (!activeChallenge) {
      return;
    }

    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if (finalExperience >= experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel;
      levelUp();
    }

    setChallengesCompleted(challengesCompleted + 1);
    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
  }, [
    activeChallenge,
    currentExperience,
    experienceToNextLevel,
    levelUp,
    setChallengesCompleted,
    setCurrentExperience,
    setActiveChallenge,
  ]);

  const resetChallenge = useCallback(() => {
    setActiveChallenge(null);
  }, [setActiveChallenge]);

  return (
    <ChallengesContext.Provider
      value={{
        level,
        currentExperience,
        challengesComplete: challengesCompleted,
        activeChallenge,
        experienceToNextLevel,
        levelUp,
        startNewChallenge,
        resetChallenge,
        completeChallenge,
        closeLevelUpModal,
      }}>
      {children}

      {isLevelOpenModalOpen && <LevelUpModal/>}
    </ChallengesContext.Provider>
  );
}
