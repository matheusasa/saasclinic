"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { logout } from "@/app/login/actions";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/`,
      label: "Atalhos",
      active: pathname === `/`,
    },
    {
      href: `/agendamentos`,
      label: "Agendamentos",
      active: pathname === `/agendamentos`,
    },
    {
      href: `/pacientes`,
      label: "Pacientes",
      active: pathname === `/pacientes`,
    },

    {
      href: `/profissionais`,
      label: "Profissionais",
      active: pathname === `/profissional`,
    },
    {
      href: `/pagamentos`,
      label: "Pagamentos",
      active: pathname === `/pagamentos`,
    },
    {
      href: `/salas`,
      label: "Salas",
      active: pathname === `/salas`,
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
      <Button onClick={async () => await logout()} variant="destructive">
        Sair
      </Button>
    </nav>
  );
}
