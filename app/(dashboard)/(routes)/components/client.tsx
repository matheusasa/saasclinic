"use client";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

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

  const agendamentosComStatusFalse = agendamentosComNomes.filter(
    (agendamento) => agendamento.status === false
  );
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Agendamentos Abertos (${agendamentosComStatusFalse.length})`}
          description="Gerencie os agendamentos da sua clínica."
        />
      </div>
      <Separator />
      <DataTable
        searchKey="pacienteNome"
        columns={columns}
        data={agendamentosComStatusFalse} // Passando os dados com os nomes
      />
    </>
  );
};
