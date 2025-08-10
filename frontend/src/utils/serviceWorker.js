// Service Worker Manager for PWA capabilities
class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.installPrompt = null;
    this.updateAvailable = false;
    this.init();
  }

  async init() {
    try {
      if ('serviceWorker' in navigator) {
        // Register service worker
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', this.registration);

        // Check for updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.updateAvailable = true;
              this.showUpdateNotification();
            }
          });
        });

        // Handle controller change (update)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          this.updateAvailable = false;
          window.location.reload();
        });

        // Setup event listeners
        this.setupEventListeners();

        // Check for updates periodically
        setInterval(() => {
          this.checkForUpdates();
        }, 60000); // Check every minute

      } else {
        console.log('Service Worker not supported');
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  setupEventListeners() {
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e;
      this.showInstallPrompt();
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.installPrompt = null;
      this.hideInstallPrompt();
    });

    // Listen for online/offline status
    window.addEventListener('online', () => {
      this.updateOnlineStatus(true);
    });

    window.addEventListener('offline', () => {
      this.updateOnlineStatus(false);
    });

    // Listen for service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleServiceWorkerMessage(event.data);
    });
  }

  async checkForUpdates() {
    if (this.registration) {
      try {
        await this.registration.update();
      } catch (error) {
        console.error('Update check failed:', error);
      }
    }
  }

  showUpdateNotification() {
    // Create update notification
    const notification = document.createElement('div');
    notification.id = 'update-notification';
    notification.innerHTML = `
      <div class="fixed top-4 right-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white p-4 rounded-2xl shadow-glass-lg border border-white/20 backdrop-blur-xl z-50 max-w-sm animate-fade-in-up">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span class="text-sm">🔄</span>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-sm">Update Available</h4>
            <p class="text-xs opacity-90">A new version is ready to install</p>
          </div>
        </div>
        <div class="flex gap-2 mt-3">
          <button id="update-now" class="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
            Update Now
          </button>
          <button id="update-later" class="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs transition-all">
            Later
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Add event listeners
    document.getElementById('update-now').addEventListener('click', () => {
      this.performUpdate();
    });

    document.getElementById('update-later').addEventListener('click', () => {
      this.hideUpdateNotification();
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
      this.hideUpdateNotification();
    }, 10000);
  }

  hideUpdateNotification() {
    const notification = document.getElementById('update-notification');
    if (notification) {
      notification.remove();
    }
  }

  async performUpdate() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  showInstallPrompt() {
    // Create install prompt
    const prompt = document.createElement('div');
    prompt.id = 'install-prompt';
    prompt.innerHTML = `
      <div class="fixed bottom-4 left-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white p-4 rounded-2xl shadow-glass-lg border border-white/20 backdrop-blur-xl z-50 max-w-sm animate-fade-in-up">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span class="text-sm">📱</span>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-sm">Install App</h4>
            <p class="text-xs opacity-90">Add to home screen for quick access</p>
          </div>
        </div>
        <div class="flex gap-2 mt-3">
          <button id="install-app" class="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
            Install
          </button>
          <button id="install-dismiss" class="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs transition-all">
            Dismiss
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(prompt);

    // Add event listeners
    document.getElementById('install-app').addEventListener('click', () => {
      this.triggerInstall();
    });

    document.getElementById('install-dismiss').addEventListener('click', () => {
      this.hideInstallPrompt();
    });

    // Auto-hide after 15 seconds
    setTimeout(() => {
      this.hideInstallPrompt();
    }, 15000);
  }

  hideInstallPrompt() {
    const prompt = document.getElementById('install-prompt');
    if (prompt) {
      prompt.remove();
    }
  }

  async triggerInstall() {
    if (this.installPrompt) {
      this.installPrompt.prompt();
      const { outcome } = await this.installPrompt.userChoice;
      console.log('Install prompt outcome:', outcome);
      this.installPrompt = null;
      this.hideInstallPrompt();
    }
  }

  updateOnlineStatus(isOnline) {
    // Update UI to show online/offline status
    const status = document.getElementById('connection-status');
    if (status) {
      status.textContent = isOnline ? '🟢 Online' : '🔴 Offline';
      status.className = isOnline ? 'text-green-500' : 'text-red-500';
    }

    // Show notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${isOnline ? '#4CAF50' : '#f44336'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = isOnline ? '🟢 Back online!' : '🔴 You\'re offline';
    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  handleServiceWorkerMessage(data) {
    switch (data.type) {
      case 'CACHE_UPDATED':
        console.log('Cache updated:', data.payload);
        break;
      case 'OFFLINE_ACTION_QUEUED':
        console.log('Offline action queued:', data.payload);
        break;
      default:
        console.log('Unknown message from service worker:', data);
    }
  }

  // Utility methods
  async getRegistration() {
    return this.registration;
  }

  isUpdateAvailable() {
    return this.updateAvailable;
  }

  async unregister() {
    if (this.registration) {
      await this.registration.unregister();
      console.log('Service Worker unregistered');
    }
  }
}

// Create global instance
const serviceWorkerManager = new ServiceWorkerManager();

// Export for use in components
export default serviceWorkerManager;

// Export utility functions
export const registerServiceWorker = () => serviceWorkerManager;
export const checkForUpdates = () => serviceWorkerManager.checkForUpdates();
export const isUpdateAvailable = () => serviceWorkerManager.isUpdateAvailable();
export const performUpdate = () => serviceWorkerManager.performUpdate();
export const triggerInstall = () => serviceWorkerManager.triggerInstall();
