import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, local, valor, fotos } = body; // fotos é um array de URLs de imagens
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Verificar se todos os campos obrigatórios foram preenchidos
    if (!nome || !local || !valor || !fotos || fotos.length === 0) {
      return new NextResponse("Campo obrigatório não preenchido", {
        status: 400,
      });
    }

    // Criar uma pasta para a sala no Supabase Storage
    const salaFolder = `Salas/${nome}-${local}`;

    // Array para armazenar as URLs das imagens
    const uploadedImageUrls: string[] = [];

    // Fazer o upload das imagens para a pasta da sala
    for (let i = 0; i < fotos.length; i++) {
      const photoUrl = fotos[i];
      const response = await fetch(photoUrl);
      const imageBlob = await response.blob();

      const { data, error } = await supabase.storage
        .from("clinica")
        .upload(`${salaFolder}/${nome}-${local}_${i}.jpg`, imageBlob, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Erro ao fazer upload:", error.message);
        return new NextResponse("Erro ao fazer upload da imagem.", {
          status: 500,
        });
      }

      // Obter o URL público da imagem
      if (data) {
        const publicUrl = supabase.storage
          .from("clinica")
          .getPublicUrl(data.path).data.publicUrl;
        uploadedImageUrls.push(publicUrl);
      }
    }

    // Criar a entrada no banco de dados
    const { data: salaData, error: salaError } = await supabase
      .from("salas")
      .insert([{ nome, local, valor, fotos: uploadedImageUrls }])
      .select();

    if (salaError) {
      return new NextResponse("Erro ao criar sala", { status: 500 });
    }

    return NextResponse.json(salaData);
  } catch (error) {
    console.log(`[SALA_POST]`, error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
