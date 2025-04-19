"use client";

import * as z from "zod";
import axios from "axios";
import { useState, useEffect, useCallback, SetStateAction } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithInput } from "@/components/date-picker-with-input";

const formSchema = z.object({
  cpf_paciente: z.string().min(1),
  cpf_profissional: z.string().min(1),
  horario_entrada: z.string(),
  horario_saida: z.string(),
  id_sala: z.string().min(1),
  dia: z.date().optional(), // Campo opcional para a data
});

type AgendamentoFormValues = z.infer<typeof formSchema>;

interface AgendamentoFormProps {
  initialData: Agendamento;
  profissionais: Profissional[];
  pacientes: Paciente[];
  salas: Sala[];
}

export const AgendamentoForm: React.FC<AgendamentoFormProps> = ({
  initialData,
  profissionais,
  pacientes,
  salas,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado para armazenar o profissional selecionado
  const [selectedProfissional, setSelectedProfissional] = useState<string>("");

  // Estado para armazenar os pacientes filtrados
  const [filteredPacientes, setFilteredPacientes] =
    useState<Paciente[]>(pacientes);

  // Função para filtrar os pacientes com base no profissional selecionado
  const filterPacientesByProfissional = useCallback(
    (profissionalCpf: string) => {
      const pacientesFiltrados = pacientes.filter(
        (paciente) => paciente.cpf_profissional === profissionalCpf
      );
      setFilteredPacientes(pacientesFiltrados);
    },
    [pacientes]
  );

  // Atualiza os pacientes filtrados sempre que o profissional selecionado mudar
  useEffect(() => {
    if (selectedProfissional) {
      filterPacientesByProfissional(selectedProfissional);
    } else {
      setFilteredPacientes(pacientes); // Se nenhum profissional for selecionado, exibe todos os pacientes
    }
  }, [selectedProfissional, filterPacientesByProfissional, pacientes]);

  // Definir título e mensagens com base nos dados passados
  const title =
    initialData && initialData.id ? "Editar agendamento" : "Criar agendamento";
  const description =
    initialData && initialData.id
      ? "Editar um agendamento."
      : "Adicionar um agendamento";
  const toastMessage =
    initialData && initialData.id
      ? "Agendamento atualizado."
      : "Agendamento criado.";
  const action = initialData && initialData.id ? "Salvar mudanças" : "Criar";

  const form = useForm<AgendamentoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      initialData && initialData.id
        ? {
            cpf_paciente: initialData.cpf_paciente,
            cpf_profissional: initialData.cpf_profissional,
            horario_entrada: initialData.horario_entrada,
            horario_saida: initialData.horario_saida,
            id_sala: initialData.id_sala,
            dia: initialData.dia,
          }
        : {
            cpf_paciente: "",
            cpf_profissional: "",
            horario_entrada: "00:00",
            horario_saida: "00:00",
            id_sala: "",
          },
  });

  const onSubmit = async (data: AgendamentoFormValues) => {
    // Adiciona o campo 'dia' com o valor da data atual
    const dataComDia = {
      ...data,
      status: false, // Adiciona o valor atual da data
    };

    try {
      if (initialData && initialData.id) {
        if (dataComDia.horario_saida !== "00:00") {
          dataComDia.status = true; // Define o status como true
        }
        await axios.patch(
          `/api/agendamentos/${params.agendamentoId}`,
          dataComDia
        );
      } else {
        await axios.post(`/api/agendamentos`, dataComDia);
      }
      toast.success("Agendamento realizado com sucesso!");
      router.push("/agendamentos");
    } catch (error: any) {
      console.log("Erro ao enviar agendamento: ", error);
      toast.error("Erro ao processar o agendamento.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/agendamentos/${params.agendamentoId}`);
      router.refresh();
      router.push(`/agendamentos`);
      toast.success("Agendamento deletado.");
    } catch (error: any) {
      toast.error(
        "Certifique-se de remover todas as categorias desse agendamento."
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
        {initialData && initialData.id && (
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
          onSubmit={form.handleSubmit(onSubmit)} // Usando o handleSubmit para enviar os dados
          className="space-y-8 w-[800px]"
        >
          <div className="flex space-x-[100px] w-[800px]">
            <FormField
              control={form.control}
              name="cpf_profissional"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Profissional</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value: SetStateAction<string>) => {
                      setSelectedProfissional(value); // Atualiza o profissional selecionado
                      field.onChange(value); // Atualiza o valor no formulário
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selecione o profissional"
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf_paciente"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Paciente</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selecione o paciente"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredPacientes.map((paciente) => (
                        <SelectItem key={paciente.cpf} value={paciente.cpf}>
                          {paciente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-[100px] w-[800px]">
            <FormField
              control={form.control}
              name="dia"
              render={({ field }) => (
                <FormItem className="flex flex-col w-1/3">
                  <FormLabel>Data da agenda</FormLabel>
                  <DatePickerWithInput field={field} {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="id_sala"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Sala alocada</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={(value) => {
                    field.onChange(value); // Atualiza o valor no formulário
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Selecione a sala"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {salas.map((sala) => (
                      <SelectItem key={sala.id_sala} value={sala.id_sala}>
                        {sala.nome} - {sala.local}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-[70px] w-[800px]">
            <FormField
              control={form.control}
              name="horario_entrada"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Horário de Entrada</FormLabel>
                  <Input
                    type="time"
                    {...field}
                    value={field.value} // Valor da hora como string
                    onChange={(e) => field.onChange(e.target.value)} // A hora precisa ser uma string no formato 'HH:mm'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="horario_saida"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Horário de Saida</FormLabel>
                  <Input
                    type="time"
                    {...field}
                    value={field.value} // Valor da hora como string
                    onChange={(e) => field.onChange(e.target.value)} // A hora precisa ser uma string no formato 'HH:mm'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
