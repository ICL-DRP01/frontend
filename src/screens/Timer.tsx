import React from 'react';
import { Text } from 'react-native';
import styles from './Styles';

const Timer : React.FC = ({ remainingTime }) => {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  return (
    <Text style={styles.timerText}>
      Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </Text>
  );
};

export default Timer;
