/*import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Node.js 런타임 설정
export const runtime = 'nodejs';

export async function POST(request) {
  const form = formidable({ multiples: false, uploadDir: './uploads', keepExtensions: true });

  return new Promise((resolve) => {
    form.parse(request, async (err, fields, files) => {
      if (err) {
        console.error('파일 업로드 실패:', err);
        return resolve(NextResponse.json({ message: '파일 업로드 실패' }, { status: 500 }));
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
            color: hexColor, // 상품 색상과 매칭
          },
        });

        // 중앙 색상과 추천 상품 반환
        resolve(NextResponse.json({ centralColor: hexColor, recommendedProducts }));
      } catch (error) {
        console.error('이미지 처리 실패:', error);
        resolve(NextResponse.json({ message: '이미지 처리 중 오류 발생' }, { status: 500 }));
      } finally {
        // 임시 파일 삭제
        try {
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error('임시 파일 삭제 실패:', unlinkError);
        }
      }
    });
  });
}
*/
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Node.js 런타임 설정
export const runtime = 'nodejs';

// bodyParser 비활성화 설정
export const routeSegmentConfig = {
  bodyParser: false,
};

export async function POST(request) {
  // 서버리스 환경을 위해 /tmp 디렉터리 사용
  const form = formidable({
    multiples: false,
    uploadDir: '/tmp/uploads',
    keepExtensions: true,
  });

  return new Promise((resolve) => {
    form.parse(request, async (err, fields, files) => {
      if (err) {
        console.error('파일 업로드 실패:', err);
        return resolve(NextResponse.json({ message: '파일 업로드 실패' }, { status: 500 }));
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
            color: hexColor, // 상품 색상과 매칭
          },
        });

        // 중앙 색상과 추천 상품 반환
        resolve(NextResponse.json({ centralColor: hexColor, recommendedProducts }));
      } catch (error) {
        console.error('이미지 처리 실패:', error);
        resolve(NextResponse.json({ message: '이미지 처리 중 오류 발생' }, { status: 500 }));
      } finally {
        // 임시 파일 삭제
        try {
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.error('임시 파일 삭제 실패:', unlinkError);
        }
      }
    });
  });
}
