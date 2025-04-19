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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"; // Certifique-se de importar a função format
import { DatePickerWithInput } from "@/components/date-picker-with-input";

const formSchema = z.object({
  nome: z.string().min(1),
  data_nascimento: z.date().min(new Date("1900-01-01"), { message: "Too old" }),
  email: z.string().email(),
  cpf_profissional: z.string().min(1, { message: "Selecione um profissional" }),
  cpf: z.string().min(9), // Novo campo para o profissional
  telefone: z.string().min(11),
});

type PacienteFormValues = z.infer<typeof formSchema>;

interface PacienteFormProps {
  initialData: Paciente[]; // Lista de pacientes (pode ser vazia inicialmente)
  profissionais: Profissional[];
  profissionaluser: Profissional | null; // Lista de profissionais para o select
}

export const PacienteForm: React.FC<PacienteFormProps> = ({
  initialData,
  profissionais,
  profissionaluser,
}) => {
  const params = useParams();
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Definir título e mensagens com base nos dados passados
  const title =
    initialData && initialData.length > 0
      ? "Editar paciente"
      : "Criar paciente";
  const description =
    initialData && initialData.length > 0
      ? "Editar um paciente."
      : "Adicionar um paciente";
  const toastMessage =
    initialData && initialData.length > 0
      ? "Paciente atualizado."
      : "Paciente criado.";
  const action =
    initialData && initialData.length > 0 ? "Salvar mudanças" : "Criar";

  const form = useForm<PacienteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      initialData && initialData.length > 0
        ? {
            nome: initialData[0].nome,
            email: initialData[0].email,
            data_nascimento: new Date(initialData[0].data_nascimento),
            cpf_profissional: profissionaluser?.cpf || "",
            cpf: initialData[0].cpf, // Vincular profissional se existir
          }
        : {
            nome: "",
            email: "",
            data_nascimento: new Date("1900-01-01"),
            cpf_profissional: "",
            cpf: "", // Novo campo para vincular o profissional
          },
  });

  const onSubmit = async (data: PacienteFormValues) => {
    try {
      setLoading(true);
      if (initialData && initialData.length > 0) {
        await axios.patch(`/api/pacientes/${params.pacienteId}`, data);
      } else {
        await axios.post(`/api/pacientes`, data);
      }
      router.push(`/pacientes`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error: any) {
      // Verificação mais detalhada dos erros
      if (axios.isAxiosError(error)) {
        // Erro proveniente do axios
        const axiosError = error.response?.data || error.message;

        // Verificar se o erro é relacionado à chave primária (CPF duplicado)
        if (axiosError && axiosError.includes("pacientes_pkey")) {
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
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/pacientes/${params.pacienteId}`);
      router.refresh();
      router.push(`/pacientes`);
      toast.success("Paciente deletado.");
    } catch (error: any) {
      toast.error(
        "Certifique-se de remover todas as categorias desse paciente."
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
            name="data_nascimento"
            render={({ field }) => (
              <FormItem className="flex flex-col w-1/3">
                <FormLabel>Data de nascimento</FormLabel>
                <DatePickerWithInput field={field} {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf_profissional"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Profissional</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a profissional"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {profissionais.map((profissional) => (
                          <SelectItem
                            key={profissional.cpf}
                            value={profissional.cpf}
                          >
                            {profissional.nome} - {profissional.especialidade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nome do paciente"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="CPF do paciente"
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
                      placeholder="Email do paciente"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone com DDD</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="11912345678"
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
