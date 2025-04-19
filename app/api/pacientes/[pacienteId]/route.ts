import { supabase } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { pacienteId: string } }
) {
  try {
    if (!params.pacienteId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const pacienteId = await await supabase
      .from("pacientes")
      .select("cpf")
      .eq("cpf", params.pacienteId);

    return NextResponse.json(pacienteId);
  } catch (error) {
    console.log("[PACIENTE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { pacienteId: string } }
) {
  try {
    const body = await req.json();

    const { nome, email, data_nascimento, cpf_profissional, cpf, telefone } =
      body;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }
    if (!nome) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }
    if (!email) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }
    if (!data_nascimento) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }
    if (!cpf_profissional) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }
    if (!cpf) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }
    if (!telefone) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }

    if (!params.pacienteId) {
      return new NextResponse("PacienteId é necessario!", { status: 400 });
    }

    const { data, error } = await supabase
      .from("pacientes")
      .update({ nome, email, data_nascimento, cpf_profissional, cpf, telefone })
      .eq("cpf", params.pacienteId)
      .select();

    return NextResponse.json(data);
  } catch (error) {
    console.log("[PACIENTE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { pacienteId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (!params.pacienteId) {
      return new NextResponse("PacienteId é necessario!", { status: 400 });
    }
    const { error } = await supabase
      .from("pacientes")
      .delete()
      .eq("cpf", params.pacienteId);

    return NextResponse.json("Usuario deletado com sucesso!");
  } catch (error) {
    console.log("[PACIENTE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
