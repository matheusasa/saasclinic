interface Paciente {
  nome: string;
  email: string;
  data_nascimento: string;
  historico: string;
  cpf_profissional: string;
  cpf: string;
}

interface Profissional {
  nome: string;
  especialidade: string;
  email: string;
  telefone: string;
  cpf: string;
}

interface Sala {
  id_sala: string;
  nome: string;
  local: string;
  fotos: string[]; // Especifica que 'fotos' é um array de strings (por exemplo, URLs das fotos)
  valor: number;
}

interface Agendamento {
  id: string;
  cpf_paciente: string;
  cpf_profissional: string;
  horario_entrada: string;
  horario_saida: string;
  dia: Date;
  id_sala: string;
  status: boolean;
}
