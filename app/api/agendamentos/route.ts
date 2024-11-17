import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      cpf_paciente,
      cpf_profissional,
      horario_entrada,
      horario_saida,
      id_sala,
      dia,
    } = body;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Verificar se o usuário está autenticado
    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Verificar campos obrigatórios
    if (
      !cpf_paciente ||
      !cpf_profissional ||
      !horario_entrada ||
      !horario_saida ||
      !id_sala ||
      !dia
    ) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }

    // Inserir agendamento na tabela 'agendamentos'
    const { data: agendamentoData, error: agendamentoError } = await supabase
      .from("agendamentos")
      .insert([
        {
          cpf_paciente,
          cpf_profissional,
          horario_entrada,
          horario_saida,
          id_sala,
          dia,
        },
      ])
      .select();

    // Verificar se houve erro ao inserir o agendamento
    if (agendamentoError) {
      console.log(
        `[ERROR] Profissional Insert Error: ${agendamentoError.message}`
      );
      return new NextResponse(
        `Erro ao inserir agendamento: ${agendamentoError.message}`,
        { status: 500 }
      );
    }

    // Resposta de sucesso com os dados do agendamento
    return NextResponse.json(agendamentoData);
  } catch (error) {
    // Log de erro genérico
    console.log(`[PROFISSIONAL_POST]`, error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}
