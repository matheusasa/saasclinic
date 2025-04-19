// app/actions/auth.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type AuthResponse = {
  error?: {
    message: string;
    code?: string;
  };
  success?: boolean;
};

export async function login(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      error: {
        message: error.message,
        code: error.status?.toString(),
      },
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
  // O redirect vai impedir que o código chegue aqui, mas precisamos retornar algo
  return { success: true };
}

export async function signup(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return {
      error: {
        message: error.message,
        code: error.status?.toString(),
      },
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
  return { success: true };
}
export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error"); // Redireciona em caso de erro
  }

  // Revalida a página ou rota específica se necessário
  revalidatePath("/");

  // Redireciona o usuário para a página de login ou outra página apropriada
  redirect("/login");
}
