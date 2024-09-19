import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, image, price, quantity, description, personalColorCategory } = await req.json();

    // 필수 값이 빠진 경우 처리
    if (!personalColorCategory) {
      return new Response(JSON.stringify({ error: 'Personal Color Category is required' }), { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        image,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description,
        personalColorCategory, // 필수 필드
      },
    });

    return new Response(JSON.stringify(newProduct), { status: 201 });
  } catch (error) {
    console.error('Failed to add product:', error);
    return new Response(JSON.stringify({ message: 'Failed to add product.' }), { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch products.' }), { status: 500 });
  }
}
