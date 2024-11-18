"use client";

import * as z from "zod";
import axios from "axios";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { CalendarIcon, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";

const formSchema = z.object({
  nome: z.string().min(1),
  especialidade: z.string().min(1),
  email: z.string().email(),
  telefone: z.string().min(9),
  cpf: z.string().min(11), // Novo campo para o profissional
});

type ProfissionalFormValues = z.infer<typeof formSchema>;

interface ProfissionalFormProps {
  initialData: Profissional[];
  profissionais: any[];
  profissionaluser: any;
}

export const ProfissionalForm: React.FC<ProfissionalFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Definir título e mensagens com base nos dados passados
  const title =
    initialData && initialData.length > 0
      ? "Editar profissional"
      : "Criar profissional";
  const description =
    initialData && initialData.length > 0
      ? "Editar um profissional."
      : "Adicionar um profissional";
  const toastMessage =
    initialData && initialData.length > 0
      ? "Profissional atualizado."
      : "Profissional criado.";
  const action =
    initialData && initialData.length > 0 ? "Salvar mudanças" : "Criar";

  const form = useForm<ProfissionalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      initialData && initialData.length > 0
        ? {
            nome: initialData[0].nome,
            email: initialData[0].email,
            especialidade: initialData[0].especialidade,
            telefone: initialData[0].telefone,
            cpf: initialData[0].cpf, // Vincular profissional se existir
          }
        : {
            nome: "",
            email: "",
            especialidade: "",
            telefone: "",
            cpf: "", // Novo campo para vincular o profissional
          },
  });

  const onSubmit = async (data: ProfissionalFormValues) => {
    try {
      setLoading(true);

      // Verificar se é um PATCH ou um POST
      if (initialData && initialData.length > 0) {
        await axios.patch(`/api/profissionais/${params.profissionalId}`, data);
      } else {
        await axios.post(`/api/profissionais`, data);
      }

      // Sucesso, redirecionar e mostrar toast
      router.push(`/profissionais`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error: any) {
      // Verificação mais detalhada dos erros
      if (axios.isAxiosError(error)) {
        // Erro proveniente do axios
        const axiosError = error.response?.data || error.message;

        // Verificar se o erro é relacionado à chave primária (CPF duplicado)
        if (axiosError && axiosError.includes("profissionais_pkey")) {
          toast.error("Esse CPF já está cadastrado.");
        } else {
          // Caso o erro tenha outra causa, gerar uma mensagem mais genérica
          toast.error(
            "Erro ao processar a solicitação. Tente novamente mais tarde."
          );
        }
      } else {
        // Caso o erro não seja do Axios
        toast.error("Erro interno. Contatar suporte!");
      }
    } finally {
      setLoading(false); // Finaliza o estado de loading
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/profissionais/${params.profissionalId}`);
      router.refresh();
      router.push(`/profissionais`);
      toast.success("Profissional deletado.");
    } catch (error: any) {
      toast.error(
        "Certifique-se de remover todas as categorias desse profissional."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && initialData.length > 0 && (
          <Button
            disabled={loading}
            variant="destructive"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Nome</FormLabel>
                <Input
                  disabled={loading}
                  placeholder="Nome do profissional"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>CPF</FormLabel>
                <Input
                  disabled={loading}
                  placeholder="CPF do profissional"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Telefone do profissional"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="especialidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidade</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Especialidade do profissional"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Email do profissional"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
