import initLegacyMap from './legacy-directions';
import initRoutesMap from './new-routes';

// DOM 로드 후 두 모듈 모두 초기화
document.addEventListener('DOMContentLoaded', async () => {
  await initLegacyMap();
  await initRoutesMap();
});