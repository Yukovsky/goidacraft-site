/**
 * Server Status Fetcher
 * Fetches cached server status from external API
 * 
 * Architecture: Service Worker Cache OR In-Browser Cache
 * - Client gets instant data from cache
 */

const ServerStatus = (() => {
  const EXTERNAL_API_URL = 'https://api.mcsrvstat.us/2/goidacraft.online';
  const CLIENT_CACHE_DURATION = 30000; // 30 seconds (local browser cache)
  const POLL_INTERVAL = 30000; // 30 seconds (client-side polling)
  
  let lastUpdate = 0;
  let cachedData = null;

  /**
   * Fetch from external API
   */
  const fetchServerStatus = async () => {
    try {
      const now = Date.now();
      
      // Use browser cache if fresh (avoid flooding server)
      if (cachedData && (now - lastUpdate) < CLIENT_CACHE_DURATION) {
        return cachedData;
      }

      const response = await fetch(EXTERNAL_API_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      cachedData = data;
      lastUpdate = now;
      
      console.debug('✓ Data from external API');
      return data;
    } catch (error) {
      console.error('Server status fetch error:', error);
      return null;
    }
  };

  const formatPlayerCount = (data) => {
    if (!data) return 'Данные не загрузились';
    if (!data.online) return 'Сервер офлайн';
    
    const online = data.players?.online ?? 0;
    const max = data.players?.max ?? '?';
    
    return `${online}/${max} онлайн`;
  };

  const formatLicenseStatus = (data) => {
    if (!data) return '—';
    return 'С лицензией и Без';
  };

  const getStatusIndicator = (data) => {
    if (!data) return 'offline';
    return data.online ? 'online' : 'offline';
  };

  const formatStatusText = (data) => {
    if (!data) return 'Ждёт данные';
    return data.online ? 'Онлайн' : 'Офлайн';
  };

  const updateStatusElement = async (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const data = await fetchServerStatus();
    const status = getStatusIndicator(data);
    const statusText = formatStatusText(data);
    
    // Update the status indicator color and text
    element.setAttribute('data-status', status);
    element.textContent = statusText;
  };

  const updatePlayerCount = async (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const data = await fetchServerStatus();
    element.textContent = formatPlayerCount(data);
  };

  const updateLicenseStatus = async (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const data = await fetchServerStatus();
    element.textContent = formatLicenseStatus(data);
  };

  const init = (statusElementId, playerElementId, licenseElementId) => {
    // Initial update
    updateStatusElement(statusElementId);
    updatePlayerCount(playerElementId);
    updateLicenseStatus(licenseElementId);

    // Set up auto-refresh (30 seconds)
    setInterval(() => {
      updateStatusElement(statusElementId);
      updatePlayerCount(playerElementId);
      updateLicenseStatus(licenseElementId);
    }, POLL_INTERVAL);
  };

  return {
    init,
    fetch: fetchServerStatus,
    formatPlayerCount,
    formatLicenseStatus,
    formatStatusText,
    getStatusIndicator,
    updateStatusElement,
    updatePlayerCount,
    updateLicenseStatus
  };
})();

// Auto-init if elements exist on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('server-status') && 
      document.getElementById('server-players') && 
      document.getElementById('server-license')) {
    ServerStatus.init('server-status', 'server-players', 'server-license');
  }
});
