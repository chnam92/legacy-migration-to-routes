// Legacy Directions API 모듈
export default async function initMap() {
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes") as google.maps.RoutesLibrary;
  
  const directionsService = new DirectionsService();
  const directionsRenderer = new DirectionsRenderer();

  const map = new Map(
    document.getElementById("legacy-map") as HTMLElement,
    {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 },
    }
  );

  directionsRenderer.setMap(map);

  const onChangeHandler = function () {
    calculateAndDisplayLegacyRoute(directionsService, directionsRenderer);
  };

  (document.getElementById("legacy-start") as HTMLElement).addEventListener(
    "change",
    onChangeHandler
  );
  (document.getElementById("legacy-end") as HTMLElement).addEventListener(
    "change",
    onChangeHandler
  );
}

function calculateAndDisplayLegacyRoute(
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer
) {
  directionsService
    .route({
      origin: {
        query: (document.getElementById("legacy-start") as HTMLInputElement).value,
      },
      destination: {
        query: (document.getElementById("legacy-end") as HTMLInputElement).value,
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch(() => console.warn("Legacy Directions request failed"));
}
