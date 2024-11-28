import { urlsupa } from "@/lib/utils";
import { SalaClient } from "./components/client";
import axios from "axios";

const SalasPage = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${urlsupa.url}/rest/v1/salas?select=*`,
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
  };

  try {
    const response = await axios.request(config); // Espera pela resposta da API
    const salas = response.data; // Armazena os dados da API
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SalaClient data={salas} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erro ao carregar as salas:", error);
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <p>Erro ao carregar as salas. Por favor, tente novamente.</p>
        </div>
      </div>
    );
  }
};

export default SalasPage;
