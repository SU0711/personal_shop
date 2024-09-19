/*"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [personalColorCategory, setPersonalColorCategory] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [colorHex, setColorHex] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // 상품 데이터를 가져오는 함수
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  // 파일 업로드 처리 함수
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // 파일 URL을 생성하여 썸네일로 표시
    const fileUrl = URL.createObjectURL(file);
    setThumbnailUrl(fileUrl);
  };

  // 썸네일에서 중앙 색상 추출 및 퍼스널 컬러 판별
  const extractColorFromThumbnail = (imageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0);

    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;

    const [red, green, blue] = pixel;
    const hexColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
    
    // 퍼스널 컬러 판별
    const category = determinePersonalColorCategory(red, green, blue);
    setPersonalColorCategory(category);
    setColorHex(hexColor);  // 추출한 색상도 상태에 저장

    // 추천 상품 필터링
    filterRecommendedProducts(category);

    return hexColor;
  };

  // 퍼스널 컬러 판별 함수
  const determinePersonalColorCategory = (r, g, b) => {
    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const isLight = brightness > 180;
    const isBright = r > 180 && g > 180 && b < 150;
    const isDark = r < 100 && g < 100 && b < 100;
    const isBrown = r > 100 && g < 75 && b < 75;

    if (isBrown) {
      return '가을웜톤';
    } else if (isLight && !isBright && !isDark) {
      return '여름쿨톤';
    } else if (isBright) {
      return '봄웜톤';
    } else if (isDark) {
      return '겨울쿨톤';
    } else {
      return getRandomPersonalColorCategory();
    }
  };

  // 랜덤 퍼스널 컬러 카테고리 반환 함수
  const getRandomPersonalColorCategory = () => {
    const categories = ['봄웜톤', '여름쿨톤', '가을웜톤', '겨울쿨톤'];
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  };

  // 추천 상품 필터링 함수
  const filterRecommendedProducts = (category) => {
    const filteredProducts = products.filter(product => product.personalColorCategory === category);
    setRecommendedProducts(filteredProducts);
  };

  // 결제 처리 함수 (수량 차감)
  const handlePayment = async (product) => {
    try {
      await handleDecreaseQuantity(product.id);  // 수량 차감

      // 결제 완료 메시지 표시
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);  // 3초 후에 메시지를 숨김
    } catch (error) {
      console.error('결제 중 오류 발생:', error);
    }
  };

  // 상품 수량을 1개 차감하는 함수
  const handleDecreaseQuantity = async (productId) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: -1 }),  // 수량 차감 요청
      });

      if (!res.ok) {
        throw new Error('수량 차감 실패');
      }

      // 수량 차감 후 업데이트된 상품 목록을 다시 가져옴
      const updatedProducts = await res.json();
      setProducts(updatedProducts);
    } catch (error) {
      console.error('수량 차감 오류:', error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // 썸네일에서 색상 추출
    const image = new Image();
    image.src = URL.createObjectURL(selectedFile);
    image.onload = () => {
      extractColorFromThumbnail(image);
    };
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#4A90E2', fontSize: '36px', fontWeight: 'bold' }}>퍼스널 컬러 쇼핑몰에 오신 것을 환영합니다!</h1>
      <p style={{ fontSize: '18px', color: '#333' }}>당신의 개인 컬러에 맞는 멋진 옷을 찾아보세요.</p>

      {/* 사진 업로드 기능 추가 }
      <div>
        <h2 style={{ fontSize: '24px', color: '#555' }}>퍼스널 컬러 분석</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} style={{ margin: '10px 0', padding: '8px' }} />
        <button
          onClick={handleUpload}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          업로드 및 분석
        </button>
      </div>

      {thumbnailUrl && (
        <div style={{ marginTop: '20px' }}>
          <h2>업로드한 사진:</h2>
          <img src={thumbnailUrl} alt="Thumbnail" style={{ width: '200px', borderRadius: '10px' }} />
        </div>
      )}

      {colorHex && (
        <div style={{ marginTop: '20px' }}>
          <h2>추출된 색상:</h2>
          <div
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: colorHex,
              borderRadius: '10px',
              margin: '0 auto',
            }}
          ></div>
          <p>{colorHex}</p>
        </div>
      )}

      {personalColorCategory && (
        <div style={{ marginTop: '20px' }}>
          <h2>퍼스널 컬러: {personalColorCategory}</h2>
          <p>{personalColorCategory} 색상</p>
        </div>
      )}

      {recommendedProducts.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ fontSize: '28px', color: '#333' }}>추천 상품</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            {recommendedProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  padding: '20px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', borderRadius: '10px' }}
                />
                <h3 style={{ color: '#555' }}>{product.name}</h3>
                <p>가격: ₩{product.price}</p>
                <p>재고: {product.quantity > 0 ? `${product.quantity}개 남음` : '품절'}</p>
                <p>{product.description}</p>
                <button
                  onClick={() => handlePayment(product)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px',
                  }}
                >
                  결제하기
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div style={{ marginTop: '20px', color: 'green', fontSize: '24px', fontWeight: 'bold' }}>
          결제가 완료되었습니다!
        </div>
      )}
    </div>
  );
}
*/
"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [personalColorCategory, setPersonalColorCategory] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [colorHex, setColorHex] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  // 상품 데이터를 가져오는 함수
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  // 파일 업로드 처리 함수
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // 파일 URL을 생성하여 썸네일로 표시
    const fileUrl = URL.createObjectURL(file);
    setThumbnailUrl(fileUrl);
  };

  // 썸네일에서 중앙 색상 추출 및 퍼스널 컬러 판별
  const extractColorFromThumbnail = (imageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0);

    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;

    const [red, green, blue] = pixel;
    const hexColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;

    // 퍼스널 컬러 판별
    const category = determinePersonalColorCategory(red, green, blue);
    setPersonalColorCategory(category);
    setColorHex(hexColor);  // 추출한 색상도 상태에 저장

    // 추천 상품 필터링
    filterRecommendedProducts(category);

    return hexColor;
  };

  // 퍼스널 컬러 판별 함수
  const determinePersonalColorCategory = (r, g, b) => {
    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const isLight = brightness > 180;
    const isBright = r > 180 && g > 180 && b < 150;
    const isDark = r < 100 && g < 100 && b < 100;
    const isBrown = r > 100 && g < 75 && b < 75;

    if (isBrown) {
      return '가을웜톤';
    } else if (isLight && !isBright && !isDark) {
      return '여름쿨톤';
    } else if (isBright) {
      return '봄웜톤';
    } else if (isDark) {
      return '겨울쿨톤';
    } else {
      return getRandomPersonalColorCategory();
    }
  };

  // 랜덤 퍼스널 컬러 카테고리 반환 함수
  const getRandomPersonalColorCategory = () => {
    const categories = ['봄웜톤', '여름쿨톤', '가을웜톤', '겨울쿨톤'];
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  };

  // 추천 상품 필터링 함수
  const filterRecommendedProducts = (category) => {
    const filteredProducts = products.filter(product => product.personalColorCategory === category);
    setRecommendedProducts(filteredProducts);

    // 관련 비디오를 카테고리에 맞게 필터링
    filterRelatedVideos(category);
  };

  // 관련 비디오 필터링 함수
  const filterRelatedVideos = (category) => {
    const videoSamples = {
      봄웜톤: [
        { title: '봄 웜톤 패션', url: 'https://www.youtube.com/embed/H9vAfkUyF4Q?si=ZgTH_H3CHK7KnRFj' },
        { title: '봄 웜톤 메이크업', url: 'https://www.youtube.com/embed/byeSWcqJGMc?si=T-TVpMfqBUtUNdEg' },
        { title: '봄 웜톤 패션 팁', url: 'https://www.youtube.com/embed/b03zYMOuoa0?si=qtua_xFHIKIDuR52' },
        { title: '웜톤 꿀템!', url: 'https://www.youtube.com/embed/NYMPUlHypqo?si=0Ew52LSQtL-s90mC' },
      ],
      여름쿨톤: [
        { title: '여름 쿨톤 코디 추천', url: 'https://www.youtube.com/embed/SuLrdQOaN1c?si=Q5m6QTbZtNcLOclo"' },
        { title: '여름 쿨톤 메이크업', url: 'https://www.youtube.com/embed/kRllPst5QVA?si=_Hh8TSsAYn-wk1lc' },
        { title: '여름 쿨톤 꿀템!', url: 'https://www.youtube.com/embed/2t8oFkrZg64?si=IHQvwoYqKXXxLtjB' },
        { title: '여름 쿨톤!', url: 'https://www.youtube.com/embed/TeICUJ07gP0?si=WfIQa015l4ev5TZf' },
      ],
      가을웜톤: [
        { title: '퍼스널 컬러 가을', url: 'https://www.youtube.com/embed/-8n3ha-cFyg?si=w0VRNc61KGwJ7V-P' },
        { title: '가을 톤', url: 'https://www.youtube.com/embed/THSkOrW21Eo?si=hSQkr8XRv4TH7r16' },
        { title: '가을 톤 꿀팁!', url: 'https://www.youtube.com/embed/xylAoryCWpw?si=TYg3ydITt4J2sS4j' },
        { title: '가을 코디!!', url: 'https://www.youtube.com/embed/8JdKxX5fig4?si=4RzaLtYGkxp6upen' },
      ],
      겨울쿨톤: [
        { title: '겨울 스타일', url: 'https://www.youtube.com/embed/9oXqqaIkaQ8?si=3DUJL9ChNuQgTQsq' },
        { title: '겨울 메이크업', url: 'https://www.youtube.com/embed/WEu9E1r3MQ0?si=d_D4QK2jMEQlWyCe' },
        { title: '퍼스널 컬러 겨울', url: 'https://www.youtube.com/embed/l5SbgopL0qw?si=UBtRDu2I1NaV1cOS' },
        { title: '겨울 꿀팁!', url: 'https://www.youtube.com/embed/NUhNdjADwTk?si=8o9Jj3-3wW2KDyol' },
      ],
    };

    setRelatedVideos(videoSamples[category] || []);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    // 썸네일에서 색상 추출
    const image = new Image();
    image.src = URL.createObjectURL(selectedFile);
    image.onload = () => {
      extractColorFromThumbnail(image);
    };
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>퍼스널 컬러 쇼핑몰에 오신 것을 환영합니다!</h1>
      <p>막 걸쳐도 어울리는 옷을 찾으세요!</p>

      {/* 사진 업로드 기능 추가 */}
      <div>
        <h2>퍼스널 컬러 분석</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          업로드 및 분석
        </button>
      </div>

      {thumbnailUrl && (
        <div style={{ marginTop: '20px' }}>
          <h2>업로드한 사진:</h2>
          <img src={thumbnailUrl} alt="Thumbnail" style={{ width: '200px', borderRadius: '10px' }} />
        </div>
      )}

      {colorHex && (
        <div style={{ marginTop: '20px' }}>
          <h2>추출된 색상:</h2>
          <div
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: colorHex,
              borderRadius: '10px',
              margin: '0 auto',
            }}
          ></div>
          <p>{colorHex}</p>
        </div>
      )}

      {personalColorCategory && (
        <div style={{ marginTop: '20px' }}>
          <h2>퍼스널 컬러: {personalColorCategory}</h2>
          <p>{personalColorCategory} 색상</p>
        </div>
      )}

      {recommendedProducts.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>추천 상품</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            {recommendedProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  padding: '20px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', borderRadius: '10px' }}
                />
                <h3>{product.name}</h3>
                <p>가격: ₩{product.price}</p>
                <p>재고: {product.quantity > 0 ? `${product.quantity}개 남음` : '품절'}</p>
                <p>{product.description}</p>
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px',
                  }}
                >
                  결제하기
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {relatedVideos.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3>추천 코디</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {relatedVideos.map((video, index) => (
              <div key={index} style={{ border: '1px solid #ccc', padding: '20px' }}>
                <iframe
                  width="100%"
                  height="200"
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <p>{video.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
