// app/page.js
"use client";

import { useState } from 'react';
import styles from '@/app/styles/Home.module.css';
import ExpertOpinion from '@/app/styles/ExpertOpinion.module.css';

export default function Home() {
    const [businessIdea, setBusinessIdea] = useState('');
    const [expertOpinions, setExpertOpinions] = useState([]);
    const [loading, setLoading] = useState(false);
    const port = process.env.PORT || 5000;

    const submitIdea = async () => {
        if (!businessIdea) {
            alert("Veuillez entrer une idée d'entreprise.");
            return;
        }

        setLoading(true);
        setExpertOpinions([]);

        try {
            const response = await fetch(`${port}/api/getExpertOpinions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessIdea }),
            });

            const data = await response.json();

            if (data.success) {
                setExpertOpinions(data.data);
                console.log(data.data);
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
        <div className={styles.container}>
            <h1>Obtenez l'Avis de Trois Experts sur Votre Idée d'Entreprise</h1>


            <div className={styles.formGroup}>
                <label htmlFor="businessIdea">Entrez votre idée d'entreprise :</label><br/>
                <textarea
                    id="businessIdea"
                    placeholder="Décrivez votre idée ici..."
                    value={businessIdea}
                    onChange={(e) => setBusinessIdea(e.target.value)}
                    className={styles.textarea}
                /><br/>
                <button onClick={submitIdea} className={styles.button}>
                    Soumettre
                </button>
            </div>

            <div id="expertOpinions">
                {loading && <p>Chargement des avis des experts...</p>}
                {expertOpinions.map((expert, index) => (
                    <ExpertOpinion key={index} role={expert.role} opinion={expert.opinion}/>
                ))}
            </div>
        </div>
    );
}
