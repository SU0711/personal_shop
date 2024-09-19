import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,  // formidable을 사용하기 위해 bodyParser 비활성화
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({ multiples: false, uploadDir: './uploads', keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('파일 업로드 실패:', err);
        return res.status(500).json({ message: '파일 업로드 실패' });
      }

      const filePath = files.file.filepath;

      try {
        // Sharp를 사용하여 이미지의 중앙 색상 추출
        const image = sharp(filePath);
        const metadata = await image.metadata();
        const { width, height } = metadata;

        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);

        const pixel = await image.extract({ left: centerX, top: centerY, width: 1, height: 1 }).raw().toBuffer();
        const [red, green, blue] = pixel;
        const hexColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;

        // 상품 추천 로직
        const recommendedProducts = await prisma.product.findMany({
          where: {
            color: hexColor,  // 상품 색상과 매칭
          },
        });

        // 중앙 색상과 추천 상품 반환
        res.status(200).json({ centralColor: hexColor, recommendedProducts });
      } catch (error) {
        console.error('이미지 처리 실패:', error);
        res.status(500).json({ message: '이미지 처리 중 오류 발생' });
      } finally {
        // 임시 파일 삭제
        await fs.unlink(filePath);
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
