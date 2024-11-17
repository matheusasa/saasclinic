import { supabase } from "@/lib/supabase";
import { SalaForm } from "./components/sala-form";

interface SalasPageProps {
  params: {
    salaId: string;
  };
}

const SalasPage = async ({ params }: SalasPageProps) => {
  const { salaId } = params;
  const { data: todosProfissionais, error: salasError } = await supabase
    .from("salas")
    .select("*");

  if (salasError) {
    throw new Error(salasError.message);
  }

  // Caso de criação de um novo sala
  if (salaId === "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SalaForm initialData={[]} />
        </div>
      </div>
    );
  }

  // Caso de visualização ou edição de sala existente
  const { data, error } = await supabase
    .from("salas")
    .select("*")
    .eq("id", salaId)
    .single();

  if (error || !data) {
    return (
      <div className="p-8 pt-6">
        <h1 className="text-red-500">
          Erro: Sala não encontrado ou ocorreu um problema.
        </h1>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SalaForm initialData={data} />
      </div>
    </div>
  );
};

export default SalasPage;
