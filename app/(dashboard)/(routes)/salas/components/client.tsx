"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
interface SalaClientProps {
  data: Sala[] | [];
}
export const SalaClient: React.FC<SalaClientProps> = ({ data }) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Salas (${data.length})`}
          description="Gerencie os Salas da sua clínica."
        />
        <Button onClick={() => router.push(`/salas/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Novo
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="nome" columns={columns} data={data} />
      <Heading title="API" description="API para chamar o Sala" />
      <Separator />
      <ApiList entityName="salas" entityIdName="SalaId" />
    </>
  );
};
