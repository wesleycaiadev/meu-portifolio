"use client";

import { useState } from "react";

// Temporary playground demo, not a portfolio action or a general button API.
export function ButtonSample() {
  const [active, setActive] = useState(false);

  return (
    <div>
      <button className="button" type="button" aria-pressed={active} onClick={() => setActive(!active)}>
        Testar feedback
      </button>
      <p className="label text-secondary" role="status">
        {active ? "Feedback ativo. Acione novamente para desativar." : "Demonstração local. Nenhum dado é enviado."}
      </p>
    </div>
  );
}
