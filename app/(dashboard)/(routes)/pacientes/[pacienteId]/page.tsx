import { supabase } from "@/lib/supabase";
import { PacienteForm } from "./components/paciente-form";
import axios from "axios";
import { urlsupa } from "@/lib/utils";

interface PacientesPageProps {
  params: {
    pacienteId: string;
  };
}

const PacientesPage = async ({ params }: PacientesPageProps) => {
  const { pacienteId } = params;

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

  // Caso de criação de um novo paciente
  if (pacienteId === "new") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <PacienteForm
            initialData={[]}
            profissionais={profissionais}
            profissionaluser={null}
          />
        </div>
      </div>
    );
  }
  let configpaci = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${urlsupa.url}/rest/v1/pacientes?select=*&cpf=eq.${pacienteId}`,
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
  };
  const responsepacient = await axios.request(configpaci); // Espera pela resposta da API
  const paciente = responsepacient.data; // Armazena os dados da API
  let configprofi = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${urlsupa.url}/rest/v1/profissionais?select=*&cpf=eq.${paciente.cpf_profissional}`,
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
  };
  const responseprofi = await axios.request(configprofi); // Espera pela resposta da API
  const profissionaiss = responseprofi.data; // Armazena os dados da API
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PacienteForm
          initialData={paciente}
          profissionais={profissionais}
          profissionaluser={profissionaiss}
        />
      </div>
    </div>
  );
};

export default PacientesPage;
