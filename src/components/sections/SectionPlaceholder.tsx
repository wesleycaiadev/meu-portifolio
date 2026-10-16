type SectionPlaceholderProps = {
  id: string;
  title: string;
  description: string;
  headingLevel: 1 | 2;
};

export function SectionPlaceholder({ id, title, description, headingLevel }: SectionPlaceholderProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <section id={id} className="foundation-section editorial-grid" aria-labelledby={`${id}-titulo`} tabIndex={-1}>
      <Heading id={`${id}-titulo`}>{title}</Heading>
      <p>{description}</p>
    </section>
  );
}
