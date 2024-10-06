import React from 'react';
import styles from '../styles/Home.module.css';
import { Card, CardContent, Typography } from '@mui/material';

const ExpertOpinion = ({ role, opinion }) => {
  return (
    <Card className={styles.opinionContainer}>
      <CardContent>
        <Typography variant="h6" className={styles.expertRole}>
          {role}
        </Typography>
        <Typography variant="body2" className={styles.expertOpinion}>
          {opinion}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ExpertOpinion;
