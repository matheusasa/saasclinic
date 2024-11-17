import { supabase } from "@/lib/supabase";
import { ProfissionalForm } from "./components/profissional-form";

interface ProfissionalsPageProps {
  params: {
    profissionalId: string;
  };
}

const ProfissionalsPage = async ({ params }: ProfissionalsPageProps) => {
  const { profissionalId } = params;
  const { data: todosProfissionais, error: profissionaisError } = await supabase
    .from("profissionais")
    .select("*");

  if (profissionaisError) {
    throw new Error(profissionaisError.message);
  }

  // Caso de criação de um novo profissional
  if (profissionalId === "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ProfissionalForm
            initialData={[]}
            profissionais={todosProfissionais}
            profissionaluser={null}
          />
        </div>
      </div>
    );
  }

  // Caso de visualização ou edição de profissional existente
  const { data, error } = await supabase
    .from("profissionals")
    .select("*")
    .eq("id", profissionalId)
    .single();
  // 2. Buscar dados do profissional associado ao profissional
  const { data: profissionalData, error: profissionalError } = await supabase
    .from("profissionais")
    .select("*")
    .eq("id_profissional", data.id_profissional)
    .single(); // Espera apenas um profissional

  if (error || !data) {
    return (
      <div className="p-8 pt-6">
        <h1 className="text-red-500">
          Erro: Profissional não encontrado ou ocorreu um problema.
        </h1>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProfissionalForm
          initialData={data}
          profissionais={todosProfissionais}
          profissionaluser={profissionalData}
        />
      </div>
    </div>
  );
};

export default ProfissionalsPage;
