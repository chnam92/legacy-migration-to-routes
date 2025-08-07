// Routes API 모듈 (computeRoutes 메서드 사용)
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
let routePolyline: google.maps.Polyline | null = null;

export default async function initMap() {
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  
  const map = new Map(
    document.getElementById("routes-map") as HTMLElement,
    {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 },
    }
  );

  const onChangeHandler = function () {
    calculateAndDisplayNewRoute(map);
  };

  (document.getElementById("routes-start") as HTMLElement).addEventListener(
    "change",
    onChangeHandler
  );
  (document.getElementById("routes-end") as HTMLElement).addEventListener(
    "change",
    onChangeHandler
  );
}

async function calculateAndDisplayNewRoute(map: google.maps.Map) {
  const startLocation = (document.getElementById("routes-start") as HTMLInputElement).value;
  const endLocation = (document.getElementById("routes-end") as HTMLInputElement).value;

  if (!startLocation || !endLocation) {
    return;
  }

  try {
    // 먼저 주소를 좌표로 변환 (Geocoding이 필요)
    const startCoords = await geocodeAddress(startLocation);
    const endCoords = await geocodeAddress(endLocation);

    // 새로운 Routes API 요청
    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: startCoords.lat,
              longitude: startCoords.lng
            }
          }
        },
        destination: {
          location: {
            latLng: {
              latitude: endCoords.lat,
              longitude: endCoords.lng
            }
          }
        },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      
      // 기존 경로 제거
      if (routePolyline) {
        routePolyline.setMap(null);
      }

      // 새로운 경로 표시
      const decodedPath = google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline);
      
      routePolyline = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

      routePolyline.setMap(map);

      // 경로에 맞게 지도 범위 조정
      const bounds = new google.maps.LatLngBounds();
      decodedPath.forEach(point => bounds.extend(point));
      map.fitBounds(bounds);

      console.log(`거리: ${route.distanceMeters}m, 소요시간: ${route.duration}`);
    }

  } catch (error) {
    console.error('Routes API 요청 실패:', error);
    window.alert('경로 계산에 실패했습니다. API 키를 확인해주세요.');
  }
}

async function geocodeAddress(address: string): Promise<{lat: number, lng: number}> {
  const { Geocoder } = await google.maps.importLibrary("geocoding") as google.maps.GeocodingLibrary;
  const geocoder = new Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng()
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
}
