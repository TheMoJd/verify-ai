// page.js
"use client";

import { useState, useEffect } from 'react';
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
        expert4: false,
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

        const experts = [];
        if (selectedExperts.expert1) experts.push("Expert technique informatique avec 30 ans d'expérience");
        if (selectedExperts.expert2) experts.push("Entrepreneur à succès ayant créé plusieurs entreprises");
        if (selectedExperts.expert3) experts.push("Analyste business avec plus de 30 ans d'expérience");
        if (selectedExperts.expert4) experts.push("Ingénieur en IA spécialisé en traitement du langage naturel");

        const existingExperts = expertOpinions.map(opinion => opinion.role);

        // Vérifier si les avis des experts sélectionnés ont déjà été obtenus
        const newExperts = experts.filter(expert => !existingExperts.includes(expert));

        // Si tous les avis ont déjà été obtenus, ne pas envoyer de requête 
        if(newExperts.length === 0) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/getExpertOpinions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessIdea,
                    selectedExperts: newExperts,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des avis des experts.');
            }

            const data = await response.json();

            if (data.success) {
                // Ajouter les nouveaux avis aux avis existants
                setExpertOpinions([...expertOpinions, ...data.data]);
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

    // Mettre à jour les avis affichés lorsqu'un expert est désélectionné
    useEffect(() => {
        const experts = [];
        if (selectedExperts.expert1) experts.push("Expert technique informatique avec 30 ans d'expérience");
        if (selectedExperts.expert2) experts.push("Entrepreneur à succès ayant créé plusieurs entreprises");
        if (selectedExperts.expert3) experts.push("Analyste business avec plus de 30 ans d'expérience");
        if (selectedExperts.expert4) experts.push("Ingénieur en IA spécialisé en traitement du langage naturel");

        // Filtrer les avis pour ne garder que ceux des experts sélectionnés
        const updatedOpinions = expertOpinions.filter(opinion => experts.includes(opinion.role));
        setExpertOpinions(updatedOpinions);
    }, [selectedExperts]);

    // Réinitialiser les avis des experts lorsque l'idée d'entreprise change
    useEffect(() => {
        setExpertOpinions([]);
    }, [businessIdea]);

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
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedExperts.expert4}
                                        onChange={handleExpertChange}
                                        name="expert4"
                                    />
                                }
                                label="Ingénieur en IA spécialisé en traitement du langage naturel"
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
