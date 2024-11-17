"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type AgendamentosColumn = {
  id: string;
  pacienteNome: string;
  profissionalNome: string;
  status: boolean;
  horario_entrada: string;
  horario_saida: string;
  dia: Date;
};

export const columns: ColumnDef<AgendamentosColumn>[] = [
  {
    accessorKey: "pacienteNome",
    header: "Paciente",
  },
  {
    accessorKey: "profissionalNome",
    header: "Profissional",
  },
  {
    accessorKey: "horario_entrada",
    header: "Horario entrada",
  },
  {
    accessorKey: "horario_saida",
    header: "Horario saida",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
