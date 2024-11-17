"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface AgendamentoClientProps {
  data: Agendamento[] | [];
  pacientes: Paciente[];
  profissionais: Profissional[];
}

export const AgendamentoClient: React.FC<AgendamentoClientProps> = ({
  data,
  pacientes,
  profissionais,
}) => {
  const router = useRouter();

  // Função para pegar o nome do paciente com base no CPF
  const getPacienteNome = (cpfPaciente: string) => {
    const paciente = pacientes.find((p) => p.cpf === cpfPaciente);
    return paciente ? paciente.nome : "Desconhecido";
  };

  // Função para pegar o nome do profissional com base no CPF
  const getProfissionalNome = (cpfProfissional: string) => {
    const profissional = profissionais.find((p) => p.cpf === cpfProfissional);
    return profissional ? profissional.nome : "Desconhecido";
  };

  // Modificando os dados de agendamento para incluir os nomes e o id
  const agendamentosComNomes = data.map((agendamento) => ({
    ...agendamento,
    pacienteNome: getPacienteNome(agendamento.cpf_paciente),
    profissionalNome: getProfissionalNome(agendamento.cpf_profissional),
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Agendamentos (${agendamentosComNomes.length})`}
          description="Gerencie os agendamentos da sua clínica."
        />
        <Button onClick={() => router.push(`/agendamentos/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Novo
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="nome"
        columns={columns}
        data={agendamentosComNomes} // Passando os dados com os nomes
      />
      <Heading title="API" description="API para chamar o Agendamento" />
      <Separator />
      <ApiList entityName="agendamentos" entityIdName="profissionalId" />
    </>
  );
};
