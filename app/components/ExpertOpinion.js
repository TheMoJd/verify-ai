export default function ExpertOpinion() {
    return (
        <div className={styles.opinionContainer}>
            <p className={styles.expertRole}>{role}</p>
            <p>{opinion}</p>
        </div>
    );
}