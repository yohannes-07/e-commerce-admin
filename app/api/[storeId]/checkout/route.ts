import { NextResponse } from "next/server";

import { chapa } from "@/lib/chapa";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
    
    const { productIds } = await req.json();

    if (!productIds || productIds.length === 0) {
      return new NextResponse("Product ids are required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    });
     const user = {
      firstName : "Yohannes",
      lastName:"Ahunm",
      email: "yohannes@gmail.com"

     }

    if (user) {
      const totalAmount = products.reduce((total, product) => total + product.price.toNumber(), 0);
      const tx_ref = await chapa.generateTransactionReference();

      const order = await prismadb.order.create({
        data: {
          storeId: params.storeId,
          isPaid: false,
          orderItems: {
            create: productIds.map((productId: string) => ({
              product: {
                connect: {
                  id: productId
                }
              }
            }))
          }
        }
      });
      
      const response = await chapa.initialize({
        first_name: user.firstName , 
        last_name: user.lastName,
        email: user.email,
        currency: 'ETB',    
        amount: totalAmount.toString(), 
        tx_ref: tx_ref,
        callback_url: process.env.WEBBOOK_URL, 
        return_url: process.env.FRONTEND_STORE_URL,
        customization: {
          title: 'Product Checkout',
          description: 'Purchase multiple products', 
        },
      });
    
      
      return NextResponse.json({ url: response.data.checkout_url }, {
        headers: corsHeaders
      });
    }
  try {
 
  }catch(error) {
    console.log("[CHAPA_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};