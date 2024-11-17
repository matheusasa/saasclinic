import { supabase } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { agendamentoId: string } }
) {
  try {
    if (!params.agendamentoId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const agendamentoId = await await supabase
      .from("agendamentos")
      .select("*")
      .eq("id", params.agendamentoId);

    return NextResponse.json(agendamentoId);
  } catch (error) {
    console.log("[agendamento_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { agendamentoId: string } }
) {
  try {
    const body = await req.json();

    const {
      cpf_paciente,
      cpf_profissional,
      horario_entrada,
      horario_saida,
      id_sala,
      dia,
      status,
    } = body;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }
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

    if (!params.agendamentoId) {
      return new NextResponse("agendamentoId é necessario!", { status: 400 });
    }

    const { data, error } = await supabase
      .from("agendamentos")
      .update({
        cpf_paciente,
        cpf_profissional,
        horario_entrada,
        horario_saida,
        id_sala,
        dia,
        status,
      })
      .eq("id", params.agendamentoId)
      .select();

    return NextResponse.json(data);
  } catch (error) {
    console.log("[PROFISSIONAL_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { agendamentoId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (!params.agendamentoId) {
      return new NextResponse("agendamentoId é necessario!", { status: 400 });
    }
    const { error } = await supabase
      .from("agendamentos")
      .delete()
      .eq("id", params.agendamentoId);

    return NextResponse.json("Agendamento deletado com sucesso!");
  } catch (error) {
    console.log("[AGENDAMENTO_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
