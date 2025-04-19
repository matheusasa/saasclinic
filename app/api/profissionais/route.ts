import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, especialidade, telefone, cpf } = body;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Verificar se o usuário está autenticado
    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Verificar campos obrigatórios
    if (!nome || !email || !especialidade || !telefone || !cpf) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }

    // Inserir profissional na tabela 'profissionais'
    const { data: profissionalData, error: profissionalError } = await supabase
      .from("profissionais")
      .insert([{ nome, email, especialidade, telefone, cpf }])
      .select();

    // Verificar se houve erro ao inserir o profissional
    if (profissionalError) {
      console.log(
        `[ERROR] Profissional Insert Error: ${profissionalError.message}`
      );
      return new NextResponse(
        `Erro ao inserir profissional: ${profissionalError.message}`,
        { status: 500 }
      );
    }

    // Resposta de sucesso com os dados do profissional
    return NextResponse.json(profissionalData);
  } catch (error) {
    // Log de erro genérico
    console.log(`[PROFISSIONAL_POST]`, error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}
