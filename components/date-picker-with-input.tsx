"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithInputProps {
  field: {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
  };
  className?: string;
}

export function DatePickerWithInput({
  field,
  className,
}: DatePickerWithInputProps) {
  const [inputValue, setInputValue] = React.useState<string>(
    field.value ? format(field.value, "dd/MM/yyyy") : ""
  );
  const [open, setOpen] = React.useState(false);

  // Atualiza o input quando a data muda pelo calendário
  React.useEffect(() => {
    if (field.value) {
      setInputValue(format(field.value, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [field.value]);

  // Processa a entrada manual de data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Tenta converter a string para uma data válida
    if (value.length === 10) {
      // Formato completo dd/MM/yyyy
      const parsedDate = parse(value, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate)) {
        field.onChange(parsedDate);
      }
    } else if (value === "") {
      field.onChange(undefined);
    }
  };

  // Formata a entrada para adicionar as barras automaticamente
  const formatInput = (value: string) => {
    // Remove caracteres não numéricos
    const numbers = value.replace(/\D/g, "");

    // Adiciona as barras conforme o usuário digita
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
        4,
        8
      )}`;
    }
  };

  // Manipula a entrada do usuário formatando automaticamente
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputValue.length === 10) {
        const parsedDate = parse(inputValue, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          field.onChange(parsedDate);
          setOpen(false);
        }
      }
    }
  };

  // Formata automaticamente ao colar
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const formattedText = formatInput(pastedText);
    setInputValue(formattedText);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value ? (
              format(field.value, "PPP", { locale: ptBR })
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={(newDate) => {
              field.onChange(newDate);
              if (newDate) {
                setInputValue(format(newDate, "dd/MM/yyyy"));
              }
              setOpen(false);
            }}
            locale={ptBR}
            initialFocus
          />
          <div className="p-3 border-t">
            <Input
              placeholder="DD/MM/AAAA"
              value={inputValue}
              onChange={(e) => {
                const formatted = formatInput(e.target.value);
                setInputValue(formatted);
                handleInputChange({
                  ...e,
                  target: { ...e.target, value: formatted },
                });
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              className="w-full"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
