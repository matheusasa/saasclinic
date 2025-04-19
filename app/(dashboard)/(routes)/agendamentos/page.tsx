import { supabase } from "@/lib/supabase";
import { AgendamentoClient } from "./components/client";
import { urlsupa } from "@/lib/utils";
import axios from "axios";

const AgendamentosPage = async () => {
  let configagenda = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${urlsupa.url}/rest/v1/agendamentos?select=*`,
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
  };
  const responseagenda = await axios.request(configagenda); // Espera pela resposta da API
  const agendamentos = responseagenda.data; // Armazena os dados da API

  let configpaciente = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${urlsupa.url}/rest/v1/pacientes?select=*`,
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
  };
  const responsepaciente = await axios.request(configpaciente); // Espera pela resposta da API
  const pacientes = responsepaciente.data; // Armazena os dados da API

  let configprof = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${urlsupa.url}/rest/v1/profissionais?select=*`,
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
  };
  const responseprof = await axios.request(configprof); // Espera pela resposta da API
  const profissionais = responseprof.data; // Armazena os dados da API

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
