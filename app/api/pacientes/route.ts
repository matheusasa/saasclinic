import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, data_nascimento, cpf_profissional, cpf } = body;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Verificar se o usuário está autenticado
    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Verificar campos obrigatórios
    if (!nome || !email || !data_nascimento || !cpf_profissional || !cpf) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }

    // Inserir o paciente na tabela 'pacientes'
    const { data: pacienteData, error: pacienteError } = await supabase
      .from("pacientes")
      .insert([{ nome, email, data_nascimento, cpf_profissional, cpf }])
      .select();

    // Verificar se houve erro ao inserir o paciente
    if (pacienteError) {
      console.log(`[ERROR] Paciente Insert Error: ${pacienteError.message}`);
      return new NextResponse(
        `Erro ao inserir paciente: ${pacienteError.message}`,
        { status: 500 }
      );
    }

    // Fazer o upload do arquivo no Supabase Storage
    const { data, error } = await supabase.storage
      .from("clinica")
      .upload(
        `Pacientes/${nome}-${cpf}/placeholder.txt`,
        new Blob(["Paciente criado com sucesso"]),
        {
          cacheControl: "3600",
          upsert: false,
        }
      );

    // Verificar se houve erro no upload
    if (error) {
      console.log(`[ERROR] File Upload Error: ${error.message}`);
      return new NextResponse(
        `Erro ao fazer upload do arquivo: ${error.message}`,
        { status: 500 }
      );
    }

    // Retornar sucesso com os dados do paciente
    return NextResponse.json(pacienteData);
  } catch (error) {
    // Log de erro genérico
    console.log(`[PACIENTE_POST]`, error);
    return new NextResponse("Erro interno no servidor", { status: 500 });
  }
}
