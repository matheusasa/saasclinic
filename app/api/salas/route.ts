import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, local, valor } = body; // fotos é um array de URLs de imagens
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Verificar se todos os campos obrigatórios foram preenchidos
    if (!nome || !local || !valor) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }

    // Criar a entrada no banco de dados
    const { data: salaData, error: salaError } = await supabase
      .from("salas")
      .insert([{ nome, local, valor }])
      .select();

    if (salaError) {
      return new NextResponse("Erro ao criar sala" + salaError, {
        status: 500,
      });
    }

    return NextResponse.json(salaData);
  } catch (error) {
    console.log(`[SALA_POST]`, error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
