/**
 * Server Status Fetcher
 * Fetches cached server status from local Backend API
 * 
 * Architecture: Background Polling + Shared Cache
 * - Backend worker polls external API every 5 minutes
 * - Data cached in server memory
 * - Client always gets instant data from cache
 */

const ServerStatus = (() => {
  // When opened as file:// there is no web origin, so always use localhost backend.
  const IS_LOCAL_RUNTIME =
    window.location.protocol === 'file:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  const LOCAL_API_URL = IS_LOCAL_RUNTIME
    ? 'http://localhost:3000/api/server-status'
    : '/api/server-status';
  
  const FALLBACK_API_URL = 'https://api.mcsrvstat.us/2/goidacraft.aboba.host';
  const CLIENT_CACHE_DURATION = 30000; // 30 seconds (local browser cache)
  const POLL_INTERVAL = 30000; // 30 seconds (client-side polling)
  
  let lastUpdate = 0;
  let cachedData = null;

  /**
   * Fetch from local backend API
   * Falls back to external API if backend is unavailable
   */
  const fetchServerStatus = async () => {
    try {
      const now = Date.now();
      
      // Use browser cache if fresh (avoid flooding server)
      if (cachedData && (now - lastUpdate) < CLIENT_CACHE_DURATION) {
        return cachedData;
      }

      // Try local API first
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(LOCAL_API_URL, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        
        if (response.ok) {
          const apiResponse = await response.json();
          // Extract actual server data
          const data = apiResponse.data || apiResponse;
          cachedData = data;
          lastUpdate = now;
          
          console.debug('✓ Data from local backend cache');
          return data;
        }
      } catch (localError) {
        console.debug('Local API unavailable, falling back to external API:', localError.message);
      }

      // Fallback to external API if local is unavailable
      const response = await fetch(FALLBACK_API_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      cachedData = data;
      lastUpdate = now;
      
      console.debug('⚠ Data from external API (fallback mode)');
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
    // Backend already updates cache every 5 minutes, so client just polls regularly
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
