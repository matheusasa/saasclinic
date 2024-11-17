import { supabase } from "@/lib/supabase";
import { SalaClient } from "./components/client";

const SalasPage = async () => {
  let { data: salas, error } = await supabase.from("salas").select("*");
  if (error) throw new Error(error.message);

  // Garante que 'salas' nunca seja null, apenas um array vazio se não houver dados.
  salas = salas ?? [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SalaClient data={salas} />
      </div>
    </div>
  );
};

export default SalasPage;
