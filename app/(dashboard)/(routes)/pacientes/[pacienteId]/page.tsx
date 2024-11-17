import { supabase } from "@/lib/supabase";
import { PacienteForm } from "./components/paciente-form";

interface PacientesPageProps {
  params: {
    pacienteId: string;
  };
}

const PacientesPage = async ({ params }: PacientesPageProps) => {
  const { pacienteId } = params;
  const { data: todosProfissionais, error: profissionaisError } = await supabase
    .from("profissionais")
    .select("*");

  if (profissionaisError) {
    throw new Error(profissionaisError.message);
  }

  // Caso de criação de um novo paciente
  if (pacienteId === "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <PacienteForm
            initialData={[]}
            profissionais={todosProfissionais}
            profissionaluser={null}
          />
        </div>
      </div>
    );
  }

  // Caso de visualização ou edição de paciente existente
  const { data, error } = await supabase
    .from("pacientes")
    .select("*")
    .eq("cpf", pacienteId)
    .single();
  // 2. Buscar dados do profissional associado ao paciente
  const { data: profissionalData, error: profissionalError } = await supabase
    .from("profissionais")
    .select("*")
    .eq("cpf", data.cpf_profissional)
    .single(); // Espera apenas um profissional

  if (error || !data) {
    return (
      <div className="p-8 pt-6">
        <h1 className="text-red-500">
          Erro: Paciente não encontrado ou ocorreu um problema.
        </h1>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PacienteForm
          initialData={data}
          profissionais={todosProfissionais}
          profissionaluser={profissionalData}
        />
      </div>
    </div>
  );
};

export default PacientesPage;
