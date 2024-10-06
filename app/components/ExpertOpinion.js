import styles from '../styles/ExpertOpinion.module.css';
export default function ExpertOpinion({ role, opinion }) {
    return (
        <div className={styles.opinionContainer}>
            <p className={styles.expertRole}>{role}</p>
            <p>{opinion}</p>
        </div>
    );
}   