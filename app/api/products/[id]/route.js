import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // ID로 상품 삭제
    const deletedProduct = await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });

    return new Response(JSON.stringify(deletedProduct), { status: 200 });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return new Response(JSON.stringify({ message: 'Failed to delete product.' }), { status: 500 });
  }
}
