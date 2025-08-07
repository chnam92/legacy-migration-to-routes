# Google Maps API Migration Demo: Directions API → Routes API

이 프로젝트는 Google Maps의 레거시 **Directions API**에서 새로운 **Routes API**로의 마이그레이션을 보여주는 데모 애플리케이션입니다.

## 📋 프로젝트 개요

Google Maps Platform에서 Directions API가 레거시가 되고 새로운 Routes API (`computeRoutes` 메서드)를 권장함에 따라, 두 API의 차이점과 마이그레이션 방법을 실제 동작하는 예제로 보여줍니다.

### 주요 특징

- **Side-by-Side 비교**: 레거시와 새로운 API를 나란히 비교
- **TypeScript 지원**: 완전한 타입 안정성
- **환경변수 관리**: API 키를 안전하게 관리

## 🏗️ 기술 스택

- **빌드 도구**: Vite
- **언어**: TypeScript
- **API**: Google Maps JavaScript API
  - Legacy: Directions API
  - New: Routes API (computeRoutes)
- **스타일링**: CSS3

## 🚀 시작하기

### 사전 요구사항

1. **Google Maps API 키** (다음 API가 활성화되어야 함):
   - Maps JavaScript API
   - Directions API (레거시)
   - Routes API (새로운)
   - Geocoding API

### 설치 및 실행

1. **레포지토리 클론**
   ```bash
   git clone <repository-url>
   cd legacy-migration-to-routes
   ```

2. **의존성 설치**
   ```bash
   npm install
   # 또는
   pnpm install
   ```

3. **환경변수 설정**
   ```bash
   # .env 파일 생성
   echo "VITE_GOOGLE_MAPS_API_KEY=your_api_key_here" > .env
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **브라우저에서 확인**
   - http://localhost:5173 접속

## 📁 프로젝트 구조

```
├── src/
│   ├── main.ts              # 애플리케이션 엔트리 포인트
│   ├── legacy-directions.ts # 레거시 Directions API 구현
│   ├── new-routes.ts        # 새로운 Routes API 구현
│   ├── style.css            # 스타일시트
│   └── vite-env.d.ts        # Vite 타입 정의
├── index.html               # HTML 템플릿
├── package.json             # 프로젝트 설정
├── tsconfig.json            # TypeScript 설정
└── .env                     # 환경변수 (생성 필요)
```

## 🔄 API 비교

### Legacy Directions API
```typescript
// DirectionsService와 DirectionsRenderer 사용
const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();

directionsService.route({
  origin: { query: "Chicago, IL" },
  destination: { query: "Los Angeles, CA" },
  travelMode: google.maps.TravelMode.DRIVING,
});
```

### New Routes API
```typescript
// HTTP POST 요청으로 computeRoutes 호출
const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY,
    'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
  },
  body: JSON.stringify({
    origin: { location: { latLng: { latitude: 41.85, longitude: -87.65 } } },
    destination: { location: { latLng: { latitude: 34.05, longitude: -118.24 } } },
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_AWARE'
  })
});
```

## 🚧 주요 차이점

| 기능 | Legacy API | Routes API |
|------|------------|------------|
| **요청 방식** | JavaScript SDK | HTTP REST API (POST) |
| **응답 형식** | JavaScript 객체 | JSON (Field Mask 필요) |
| **트래픽 정보** | 제한적 | 향상된 실시간 트래픽 |

## 🛠️ 사용 가능한 스크립트

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## 🔒 보안 고려사항

- `.env` 파일은 절대 커밋하지 마세요
- API 키에 적절한 제한 설정을 적용하세요
- 프로덕션에서는 서버 사이드 프록시 사용을 고려하세요

## 📚 참고 자료

- [Google Maps Routes API 문서](https://developers.google.com/maps/documentation/routes/compute_route_directions)
- [Directions API에서 Routes API로 마이그레이션](https://developers.google.com/maps/documentation/routes/migrate-routes)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)

## 📄 라이선스

이 프로젝트는 데모 목적으로 제공됩니다.
```

이 README.md는 프로젝트의 목적, 설치 방법, 사용법, 그리고 두 API 간의 주요 차이점을 포괄적으로 설명합니다.
