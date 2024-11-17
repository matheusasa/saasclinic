import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse("Não autorizado", { status: 401 })

        }
        // Verificar se o usuário tem permissão para criar um novo nome
        if (!name) {
            return new NextResponse('Campo obrigatório não preenchido', { status: 400 })
        }
        if (!billboardId) {
            return new NextResponse('billboardId não preenchido', { status: 400 })
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



        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }

        });

        return NextResponse.json(category);
    } catch (error) {
        console.log(`[CATEGORIES_POST]`, error);
        return new NextResponse("Erro interno", { status: 500 });
    }

}
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse('StoreId não preenchido', { status: 400 })
        }


        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }

        });

        return NextResponse.json(categories);
    } catch (error) {
        console.log(`[CATEGORIES_GET ]`, error);
        return new NextResponse("Erro interno", { status: 500 });
    }

}