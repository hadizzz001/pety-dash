// app/api/stock1/route.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  const bodyText = await request.text();  
  const [id, qtyStr, color] = bodyText.split(',');
  const qty = parseInt(qtyStr, 10);

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    } 

    const colorList = product.color || [];
    const colorIndex = colorList.findIndex(c => c.color === color); 
    if (colorIndex === -1) {
      return new Response(JSON.stringify({ error: 'Color not found' }), { status: 400 });
    }

    colorList[colorIndex].qty += qty; // INCREASE instead of decrease

    const updated = await prisma.product.update({
      where: { id },
      data: { color: colorList },
    });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
