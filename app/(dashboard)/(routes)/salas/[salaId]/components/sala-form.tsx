"use client";

import { ChangeEvent, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Trash } from "lucide-react";
import axios from "axios";

const formSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório."),
  local: z.string().min(1, "O local é obrigatório."),
  fotos: z.array(z.string()).min(1, "Pelo menos uma foto é necessária."),
  valor: z.number().min(1, "O valor deve ser positivo."),
});

type SalaFormValues = z.infer<typeof formSchema>;

interface SalaFormProps {
  initialData: Sala[];
}

export const SalaForm: React.FC<SalaFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]); // URLs das imagens para pré-visualização
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]); // Armazenar URLs das fotos enviadas
  const imageInputRef = useRef<HTMLInputElement>(null);

  const title =
    initialData && initialData.length > 0 ? "Editar sala" : "Criar sala";
  const description =
    initialData && initialData.length > 0
      ? "Editar uma sala."
      : "Adicionar uma sala";
  const toastMessage =
    initialData && initialData.length > 0 ? "Sala atualizada." : "Sala criada.";
  const action =
    initialData && initialData.length > 0 ? "Salvar mudanças" : "Criar";

  const form = useForm<SalaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      initialData && initialData.length > 0
        ? {
            nome: initialData[0].nome,
            local: initialData[0].local,
            fotos: initialData[0].fotos,
            valor: initialData[0].valor,
          }
        : {
            nome: "",
            local: "",
            fotos: [],
            valor: 0,
          },
  });

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setLoading(true);
      try {
        const files = Array.from(event.target.files);
        const uploadedUrls: string[] = [];

        // Para cada arquivo, faz o upload e armazena a URL
        for (const file of files) {
          const { data, error } = await supabase.storage
            .from("clinica")
            .upload(`Sala/${Date.now()}_${file.name}`, file);

          if (error) {
            console.error("Erro ao fazer upload:", error.message);
            toast.error("Erro ao fazer upload da imagem.");
            continue;
          }

          if (data) {
            const url = supabase.storage.from("clinica").getPublicUrl(data.path)
              .data.publicUrl;
            uploadedUrls.push(url); // Adiciona a URL ao array
          }
        }

        setUploadedPhotos(uploadedUrls); // Atualiza as fotos enviadas
        form.setValue("fotos", uploadedUrls); // Atualiza o campo 'fotos' do formulário
        toast.success("Imagens carregadas com sucesso!");
      } catch (error) {
        console.error(error);
        toast.error("Erro inesperado ao fazer upload das imagens.");
      } finally {
        setLoading(false); // Desativa o estado de carregamento
      }
    }
  };

  const onSubmit = async (data: SalaFormValues) => {
    try {
      setLoading(true);
      if (initialData && initialData.length > 0) {
        await axios.patch(`/api/salas/${params.salaId}`, data);
      } else {
        await axios.post(`/api/salas`, data);
      }
      router.push(`/salas`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Algo deu errado.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/salas/${params.salaId}`);
      router.refresh();
      router.push(`/salas`);
      toast.success("Sala deletada.");
    } catch (error: any) {
      toast.error("Certifique-se de remover todas as categorias dessa sala.");
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
                  placeholder="Nome da sala"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="local"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Local da sala</FormLabel>
                <Input
                  disabled={loading}
                  placeholder="Identificação da sala"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="valor"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Valor da sala"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="fotos"
            render={() => (
              <FormItem>
                <FormLabel>Fotos</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={loading}
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Exibe a pré-visualização das imagens selecionadas */}
          <div className="flex gap-4">
            {imageUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                width={150}
                height={150}
                alt={`img-preview-${index}`}
                className="rounded-md"
              />
            ))}
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
