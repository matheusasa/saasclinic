import { supabase } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { salaId: string } }
) {
  try {
    if (!params.salaId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const salaId = await await supabase
      .from("salas")
      .select("*")
      .eq("id_pacient", params.salaId);

    return NextResponse.json(salaId);
  } catch (error) {
    console.log("[sala_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { salaId: string } }
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

    if (!params.salaId) {
      return new NextResponse("salaId é necessario!", { status: 400 });
    }

    const { data, error } = await supabase
      .from("salas")
      .update({ nome, email, especialidade, telefone })
      .eq("id_sala", params.salaId)
      .select();

    return NextResponse.json(data);
  } catch (error) {
    console.log("[SALA_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { salaId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (!params.salaId) {
      return new NextResponse("salaId é necessario!", { status: 400 });
    }
    const { error } = await supabase
      .from("salas")
      .delete()
      .eq("id_sala", params.salaId);

    return NextResponse.json("Usuario deletado com sucesso!");
  } catch (error) {
    console.log("[SALA_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
