import { useContext } from 'react';
import { ChallengesContext } from '../hooks/ChallengesContext';
import styles from '../styles/components/ExperienceBar.module.css';

export function ExperienceBar() {
  const { currentExperience, experienceToNextLevel } = useContext(ChallengesContext);

  const percentToNextLevel = Math.round(currentExperience * 100) / experienceToNextLevel;

  return (
    <header className={styles.experienceBar}>
      <span> 0xp</span>
      <div>

        <div style={{ width: `${percentToNextLevel > 0 ? percentToNextLevel : 0}%` }}/>

        {currentExperience > 0 && (
          <span className={styles.currentExperience} style={{ left: `${percentToNextLevel}%` }}>
            {currentExperience}xp
          </span>
        )}

      </div>
      <span>{experienceToNextLevel}xp</span>
    </header>
  );
}
