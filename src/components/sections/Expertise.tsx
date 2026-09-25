import { expertise } from "@/data/site";

export function Expertise() {
  return (
    <section id="expertise" className="section expertise" aria-labelledby="expertise-title">
      <div className="container">
        <div className="section-heading"><h2 id="expertise-title">Expertise</h2><p>Competências transversais construídas sobre engenharia sólida, sensibilidade de design e foco em produto.</p></div>
        <div className="expertise__list">
          {expertise.map((group) => <div className="expertise__row" key={group.category}><h3>{group.category}</h3><ul>{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></div>)}
        </div>
      </div>
    </section>
  );
}
