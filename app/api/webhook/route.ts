import { headers } from "next/headers"
import { NextResponse } from "next/server"
import crypto, { BinaryLike } from 'crypto'


import prismadb from "@/lib/prismadb"

export async function POST(req: Request) {
    const hash = crypto.createHmac('sha256', process.env.WEB_HOOK_SECRET as BinaryLike).update(JSON.stringify(req.body)).digest('hex');
    const headerList = headers()
    const signature = headerList.get("Chapa-Signature") || headerList.get("x-chapa-signature")

    if (hash == signature) {
        const event = req.body;
        console.log(event)


    const order = await prismadb.order.update({
      where: {
        id: "slkgha4",
      },
      data: {
        isPaid: true,
        address: "AddIS Ababa",
        phone: "092052071" || '',
      },
      include: {
        orderItems: true,
      }
    });

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true
      }
    });

    }

  return new NextResponse(null, { status: 200 });
};