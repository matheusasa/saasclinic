"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type PacientesColumn = {
  cpf: string;
  nome: string;
  email: string;
  profissional: string;
};

export const columns: ColumnDef<PacientesColumn>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "profissional.nome",
    header: "Profissional",
  },
  {
    id: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
