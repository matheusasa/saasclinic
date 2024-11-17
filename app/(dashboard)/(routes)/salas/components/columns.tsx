"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type SalasColumn = {
  id_sala: string;
  nome: string;
  local: string;
  valor: number;
};

export const columns: ColumnDef<SalasColumn>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "local",
    header: "Local",
  },
  {
    accessorKey: "valor",
    header: "Valor",
  },
  {
    id: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
