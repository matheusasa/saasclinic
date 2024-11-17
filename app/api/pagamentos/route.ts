import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, value } = body;

        if (!userId) {
            return new NextResponse("Não autorizado", { status: 401 })

        }
        // Verificar se o usuário tem permissão para criar um novo nome
        if (!name) {
            return new NextResponse('Campo obrigatório não preenchido', { status: 400 })
        }
        if (!value) {
            return new NextResponse('Valor não preenchido', { status: 400 })
        }
        if (!params.storeId) {
            return new NextResponse('StoreId não preenchido', { status: 400 })
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse('Você não possui esse negócio', { status: 400 })
        }



        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }

        });

        return NextResponse.json(color);
    } catch (error) {
        console.log(`[COLOR_POST]`, error);
        return new NextResponse("Erro interno", { status: 500 });
    }

}
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse('StoreId não preenchido', { status: 400 })
        }


        const colors = await prismadb.color.findMany({
            where: {
                storeId: params.storeId
            }

        });

        return NextResponse.json(colors);
    } catch (error) {
        console.log(`[COLOR_GET ]`, error);
        return new NextResponse("Erro interno", { status: 500 });
    }

}