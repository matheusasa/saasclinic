import { supabase } from "@/lib/supabase";
import { AgendamentoForm } from "./components/agendamento-form";

interface AgendamentosPageProps {
  params: {
    agendamentoId: string;
  };
}

const AgendamentosPage = async ({ params }: AgendamentosPageProps) => {
  const { agendamentoId } = params;

  // Buscar todos os dados necessários (pacientes, profissionais, salas)
  const { data: todosPacientes, error: pacientesError } = await supabase
    .from("pacientes")
    .select("*");

  const { data: todosProfissionais, error: profissionaisError } = await supabase
    .from("profissionais")
    .select("*");

  const { data: todosSalas, error: salasError } = await supabase
    .from("salas")
    .select("*");

  if (pacientesError || profissionaisError || salasError) {
    throw new Error("Erro na integração com as tabelas relacionadas.");
  }

  // Caso seja um novo agendamento (agendamentoId == "new")
  if (agendamentoId === "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <AgendamentoForm
            initialData={{
              id: "", // ou null se for um novo agendamento
              cpf_paciente: "",
              cpf_profissional: "",
              horario_entrada: "00:00", // hora padrão
              horario_saida: "00:00", // hora padrão
              dia: new Date(), // data de hoje
              id_sala: "",
              status: false, // valor padrão
            }}
            pacientes={todosPacientes}
            profissionais={todosProfissionais}
            salas={todosSalas}
          />
        </div>
      </div>
    );
  }

  // Buscar o agendamento específico pelo agendamentoId
  const { data: agendamentoData, error: agendamentoError } = await supabase
    .from("agendamentos")
    .select("*")
    .eq("id", agendamentoId)
    .single();

  if (agendamentoError || !agendamentoData) {
    return (
      <div className="p-8 pt-6">
        <h1 className="text-red-500">
          Erro: Agendamento não encontrado ou ocorreu um problema.
        </h1>
      </div>
    );
  }

  // Exibir o formulário com os dados do agendamento encontrado
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AgendamentoForm
          initialData={agendamentoData}
          pacientes={todosPacientes}
          profissionais={todosProfissionais}
          salas={todosSalas}
        />
      </div>
    </div>
  );
};

export default AgendamentosPage;
