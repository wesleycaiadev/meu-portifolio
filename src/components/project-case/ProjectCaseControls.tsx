import styles from "./ProjectCase.module.scss";

type Props = {
  threeReady: boolean;
  available: boolean;
  status: string;
  replay: () => void;
  reset: () => void;
};

export function ProjectCaseControls(props: Props) {
  return <details className={styles.development}>
    <summary>Controles da prévia</summary>
    <div className={styles.devActions}>
      <button type="button" disabled={!props.threeReady} onClick={props.replay}>Repetir entrada</button>
      <button type="button" disabled={!props.available} onClick={props.reset}>Resetar exploração</button>
    </div>
    <p role="status">{props.status}</p>
    <p>Prévia de desenvolvimento. Mobile usa a apresentação estática rolável.</p>
  </details>;
}
