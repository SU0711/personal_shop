let products = []; // 서버 실행 동안 메모리에 저장되는 배열

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, image, price, quantity, description, personalColorCategory } = req.body;

    const newProduct = {
      id: products.length + 1, // ID를 자동으로 증가
      name,
      image,
      price: parseFloat(price), // price는 float로 변환
      quantity: parseInt(quantity), // quantity는 int로 변환
      description,
      personalColorCategory, // personalColorCategory 필드 추가
    };

    products.push(newProduct); // 새로운 상품을 배열에 추가
    return res.status(201).json(newProduct); // 추가된 상품을 응답으로 보냄
  } else if (req.method === 'GET') {
    return res.status(200).json(products); // 저장된 모든 상품을 응답으로 보냄
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' }); // 지원되지 않는 HTTP 메서드 처리
  }
}
