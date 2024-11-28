import { supabase } from "@/lib/supabase";
import { ProfissionalClient } from "./components/client";
import { urlsupa } from "@/lib/utils";
import axios from "axios";

const ProfissionalsPage = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${urlsupa.url}/rest/v1/profissionais?select=*`,
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
  };
  const response = await axios.request(config); // Espera pela resposta da API
  const profissionais = response.data; // Armazena os dados da API
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProfissionalClient data={profissionais} />
      </div>
    </div>
  );
};

export default ProfissionalsPage;
