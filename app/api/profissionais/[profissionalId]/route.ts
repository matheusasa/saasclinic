import { supabase } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { profissionalId: string } }
) {
  try {
    if (!params.profissionalId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const profissionalId = await await supabase
      .from("profissionais")
      .select("*")
      .eq("cpf", params.profissionalId);

    return NextResponse.json(profissionalId);
  } catch (error) {
    console.log("[profissional_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { profissionalId: string } }
) {
  try {
    const body = await req.json();

    const { nome, email, especialidade, telefone, cpf } = body;
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
    if (!especialidade) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }
    if (!telefone) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }
    if (!cpf) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }

    if (!params.profissionalId) {
      return new NextResponse("profissionalId é necessario!", { status: 400 });
    }

    const { data, error } = await supabase
      .from("profissionais")
      .update({ nome, email, especialidade, telefone })
      .eq("cpf", params.profissionalId)
      .select();

    return NextResponse.json(data);
  } catch (error) {
    console.log("[PROFISSIONAL_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { profissionalId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (!params.profissionalId) {
      return new NextResponse("profissionalId é necessario!", { status: 400 });
    }
    const { error } = await supabase
      .from("profissionais")
      .delete()
      .eq("cpf", params.profissionalId);

    return NextResponse.json("Usuario deletado com sucesso!");
  } catch (error) {
    console.log("[PROFISSIONAL_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
