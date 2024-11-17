"use client";

import {
  Calendar,
  CreditCard,
  DollarSign,
  Package,
  Plus,
  User,
  Workflow,
} from "lucide-react";
import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formatter } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";

const ActionsAtalhos = () => {
  const router = useRouter();
  return (
    <div className="grid gap-4 grid-cols-3 pt-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold">
            Criar agendamento rapido
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push(`/agendamentos/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Novo
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold">
            Criar paciente rapido
          </CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push(`/pacientes/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Novo
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-3xl font-bold">
            Criar profissional rapido
          </CardTitle>
          <Workflow className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push(`/profissionais/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Novo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionsAtalhos;
