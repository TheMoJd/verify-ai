"use client";

import { useState } from 'react';
import ExpertOpinion from './components/ExpertOpinion';
import styles from './styles/Home.module.css';
import { Button, TextField, Typography, Container, CircularProgress, Card, CardContent, Box } from '@mui/material';

export default function Home() {
    const [businessIdea, setBusinessIdea] = useState('');
    const [expertOpinions, setExpertOpinions] = useState([]);
    const [loading, setLoading] = useState(false);

    const submitIdea = async () => {
        if (!businessIdea) {
            alert("Veuillez entrer une idée d'entreprise.");
            return;
        }

        setLoading(true);
        setExpertOpinions([]);

        try {
            const response = await fetch(`http://localhost:5000/api/getExpertOpinions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessIdea }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des avis des experts.');
            }

            const data = await response.json();

            if (data.success) {
                setExpertOpinions(data.data);
            } else {
                alert("Erreur lors de la récupération des avis des experts.");
            }
        } catch (error) {
            console.error(error);
            alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" className={styles.container}>
            <Typography variant="h4" align="center" gutterBottom>
                Obtenez l'Avis de Trois Experts sur Votre Idée d'Entreprise
            </Typography>
            <Card className={styles.inputCard}>
                <CardContent>
                    <Box className={styles.inputGroup}>
                        <TextField
                            label="Entrez votre idée d'entreprise"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            value={businessIdea}
                            onChange={(e) => setBusinessIdea(e.target.value)}
                            margin="normal"
                            className={styles.textField}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={submitIdea}
                            fullWidth
                            disabled={loading}
                            className={styles.button}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Soumettre'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
            <div id="expertOpinions" className={styles.expertOpinionsContainer}>
                {expertOpinions.map((expert, index) => (
                    <ExpertOpinion key={index} role={expert.role} opinion={expert.opinion} />
                ))}
            </div>
        </Container>
    );
}
