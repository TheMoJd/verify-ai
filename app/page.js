// page.js
"use client";

import { useState } from 'react';
import ExpertOpinion from './components/ExpertOpinion';
import styles from './styles/Home.module.css';
import {
    Button,
    TextField,
    Typography,
    Container,
    CircularProgress,
    Card,
    CardContent,
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup
} from '@mui/material';

export default function Home() {
    const [businessIdea, setBusinessIdea] = useState('');
    const [expertOpinions, setExpertOpinions] = useState([]);
    const [loading, setLoading] = useState(false);

    // États pour la sélection des experts
    const [selectedExperts, setSelectedExperts] = useState({
        expert1: false,
        expert2: false,
        expert3: false,
    });

    // Gestion des changements de sélection des experts
    const handleExpertChange = (event) => {
        setSelectedExperts({
            ...selectedExperts,
            [event.target.name]: event.target.checked,
        });
    };

    const submitIdea = async () => {
        if (!businessIdea) {
            alert("Veuillez entrer une idée d'entreprise.");
            return;
        }

        // Vérifier qu'au moins un expert est sélectionné
        if (!Object.values(selectedExperts).some((value) => value)) {
            alert("Veuillez sélectionner au moins un expert.");
            return;
        }

        setLoading(true);
        setExpertOpinions([]);

        // Préparer les données des experts sélectionnés
        const experts = [];
        if (selectedExperts.expert1) experts.push("Expert technique informatique avec 30 ans d'expérience");
        if (selectedExperts.expert2) experts.push("Entrepreneur à succès ayant créé plusieurs entreprises");
        if (selectedExperts.expert3) experts.push("Analyste business avec plus de 30 ans d'expérience");

        try {
            const response = await fetch(`http://localhost:5000/api/getExpertOpinions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessIdea,
                    selectedExperts: experts,
                }),
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
                Obtenez l'Avis d'Experts sur Votre Idée d'Entreprise
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

                        {/* Sélection des experts */}
                        <Typography variant="h6" gutterBottom>
                            Sélectionnez les experts :
                        </Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedExperts.expert1}
                                        onChange={handleExpertChange}
                                        name="expert1"
                                    />
                                }
                                label="Expert technique informatique avec 30 ans d'expérience"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedExperts.expert2}
                                        onChange={handleExpertChange}
                                        name="expert2"
                                    />
                                }
                                label="Entrepreneur à succès ayant créé plusieurs entreprises"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedExperts.expert3}
                                        onChange={handleExpertChange}
                                        name="expert3"
                                    />
                                }
                                label="Analyste business avec plus de 30 ans d'expérience"
                            />
                        </FormGroup>

                        

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
