import { processSteps } from "@/data/site";

export function Process() {
  return (
    <section id="processo" className="section process" aria-labelledby="process-title">
      <div className="container">
        <div className="section-heading"><h2 id="process-title">Da ideia à experiência final</h2><p>Meu processo combina entendimento do problema, direção visual, arquitetura escalável e entrega refinada.</p></div>
        <ol className="process__steps">{processSteps.map((step) => <li key={step.number}><div className="process__marker"><span>{step.number}</span></div><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
      </div>
    </section>
  );
}
