import { supabase } from "@/lib/supabase";
import { AgendamentoClient } from "./components/client";

const AgendamentosPage = async () => {
  // Consulta para buscar os agendamentos
  let { data: agendamentos, error: agendamentosError } = await supabase
    .from("agendamentos")
    .select("*");

  if (agendamentosError) throw new Error(agendamentosError.message);

  // Consulta para buscar os pacientes
  let { data: pacientes, error: pacientesError } = await supabase
    .from("pacientes")
    .select("*");

  if (pacientesError) throw new Error(pacientesError.message);

  // Consulta para buscar os profissionais
  let { data: profissionais, error: profissionaisError } = await supabase
    .from("profissionais")
    .select("*");

  if (profissionaisError) throw new Error(profissionaisError.message);

  // Garantir que as variáveis de dados nunca sejam null
  agendamentos = agendamentos ?? [];
  pacientes = pacientes ?? [];
  profissionais = profissionais ?? [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AgendamentoClient
          data={agendamentos}
          pacientes={pacientes}
          profissionais={profissionais}
        />
      </div>
    </div>
  );
};

export default AgendamentosPage;
