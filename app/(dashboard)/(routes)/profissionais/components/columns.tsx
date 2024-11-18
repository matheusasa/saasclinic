"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ProfissionalsColumn = {
  cpf: string;
  nome: string;
  email: string;
  especialidade: string;
  telefone: string;
};

export const columns: ColumnDef<ProfissionalsColumn>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "especialidade",
    header: "Especialidade",
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
  },
  {
    id: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
