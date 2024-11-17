import { supabase } from "@/lib/supabase";
import { ProfissionalClient } from "./components/client";

const ProfissionalsPage = async () => {
  let { data: profissionais, error } = await supabase
    .from("profissionais")
    .select("*");
  if (error) throw new Error(error.message);

  // Garante que 'profissionais' nunca seja null, apenas um array vazio se não houver dados.
  profissionais = profissionais ?? [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProfissionalClient data={profissionais} />
      </div>
    </div>
  );
};

export default ProfissionalsPage;
