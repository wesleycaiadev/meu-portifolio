import styles from "./ProjectCase.module.scss";

type Props = {
  reduced: boolean;
  previewMotion: boolean;
  threeReady: boolean;
  available: boolean;
  status: string;
  toggleMotion: () => void;
  replay: () => void;
  reset: () => void;
};

export function ProjectCaseControls(props: Props) {
  return <details className={styles.development} open={props.reduced}>
    <summary>Controles da prévia</summary>
    <div className={styles.devActions}>
      {props.reduced && <button type="button" aria-pressed={props.previewMotion} onClick={props.toggleMotion}>
        {props.previewMotion ? "Respeitar movimento reduzido" : "Ativar abertura 3D nesta prévia"}
      </button>}
      <button type="button" disabled={!props.threeReady} onClick={props.replay}>Repetir entrada</button>
      <button type="button" disabled={!props.available} onClick={props.reset}>Resetar exploração</button>
    </div>
    <p role="status">{props.status}</p>
    <p>Protótipo isolado de desenvolvimento. A ativação opcional não altera a preferência do sistema. Mobile usa a apresentação estática rolável.</p>
  </details>;
}
