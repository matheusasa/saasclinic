"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { supabase } from "@/lib/supabase";
import { urlsupa } from "@/lib/utils";
import axios from "axios";

export const PacienteClient = () => {
  const router = useRouter();

  // Estado para armazenar os pacientes e o erro
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar os dados dos pacientes e profissionais quando o componente for montado
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Inicia o carregamento

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
        const pacientes1 = responsepaciente.data; // Armazena os dados da API

        // Para cada paciente, buscar o profissional relacionado
        const pacientesComProfissional = await Promise.all(
          pacientes1.map(async (paciente: any) => {
            const { data: profissionalData, error: profissionalError } =
              await supabase
                .from("profissionais")
                .select("*")
                .eq("cpf", paciente.cpf_profissional)
                .single(); // Usamos single() porque esperamos um único profissional para cada paciente

            if (profissionalError) {
              paciente.profissional = null; // Em caso de erro, definimos o profissional como null
            } else {
              paciente.profissional = profissionalData; // Vinculamos o profissional ao paciente
            }

            return paciente;
          })
        );

        setPacientes(pacientesComProfissional); // Atualiza o estado com os pacientes e seus respectivos profissionais
      } catch (error: any) {
        setError(error.message || "Erro ao carregar dados.");
      } finally {
        setLoading(false); // Termina o carregamento
      }
    };

    fetchData(); // Chama a função para carregar os dados
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Pacientes (${pacientes.length})`}
          description="Gerencie os pacientes da sua clínica."
        />
        <Button onClick={() => router.push(`/pacientes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Novo
        </Button>
      </div>
      <Separator />

      {loading ? (
        <p>Carregando...</p> // Exibe um texto enquanto os dados estão sendo carregados
      ) : error ? (
        <p className="text-red-500">{error}</p> // Exibe o erro se houver
      ) : (
        <DataTable searchKey="nome" columns={columns} data={pacientes} />
      )}

      <Heading title="API" description="API para chamar o Paciente" />
      <Separator />
      <ApiList entityName="pacientes" entityIdName="pacienteId" />
    </>
  );
};
