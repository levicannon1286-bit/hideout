import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { GlobalChat } from "@/components/GlobalChat";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Palette, Database, Trash2, Mail, Globe, Zap, Activity } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePageTitle } from "@/hooks/use-page-title";
import { StarBackground } from "@/components/StarBackground";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ThemesData = {
  site: string;
  "main-theme": string;
  themes: Array<{
    id: string;
    name: string;
    themePath: string;
  }>;
};

const EmailSettingsToggle = () => {
  const [newslettersEnabled, setNewslettersEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('hideout_email_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNewslettersEnabled(parsed.newsletters !== undefined ? parsed.newsletters : true);
      } catch {
        setNewslettersEnabled(true);
      }
    }
  }, []);

  const handleChange = (checked: boolean) => {
    setNewslettersEnabled(checked);
    const settings = { newsletters: checked };
    localStorage.setItem('hideout_email_settings', JSON.stringify(settings));
    toast.success("Email settings updated", { duration: 5000 });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Newsletters</Label>
          <p className="text-sm text-muted-foreground">Receive updates, news, and special offers</p>
        </div>
        <Switch 
          checked={newslettersEnabled} 
          onCheckedChange={handleChange}
        />
      </div>
    </div>
  );
};

type SettingsData = {
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  notificationsEnabled: boolean;
  generalNotifications: boolean;
  performanceMode: boolean;
  showFPS: boolean;
  disableUpdatePopups: boolean;
  incognitoMode: boolean;
  selectedTheme: string;
};

const SettingsPage = () => {
  usePageTitle('Settings');
  const location = useLocation();
  const fromBrowser = (location.state as { fromBrowser?: boolean })?.fromBrowser;
  const [user, setUser] = useState<any>(null);
  const [themesData, setThemesData] = useState<ThemesData | null>(null);
  
  const [settings, setSettings] = useState<SettingsData>({
    reducedMotion: false,
    fontSize: 'medium',
    highContrast: false,
    notificationsEnabled: false,
    generalNotifications: true,
    performanceMode: false,
    showFPS: false,
    disableUpdatePopups: false,
    incognitoMode: false,
    selectedTheme: '',
  });

  useEffect(() => {
    // Fetch themes data from remote URL
    const loadThemes = async () => {
      try {
        const response = await fetch('https://hideout-network.github.io/hideout-assets/themes/themes.json');
        const data = await response.json();
        setThemesData(data);

        // Load settings from localStorage
        const savedSettings = localStorage.getItem('hideout_settings');
        
        let loadedSettings: SettingsData = {
          reducedMotion: false,
          fontSize: 'medium',
          highContrast: false,
          notificationsEnabled: false,
          generalNotifications: true,
          performanceMode: false,
          showFPS: false,
          disableUpdatePopups: false,
          incognitoMode: false,
          selectedTheme: data['main-theme'],
        };
        
        if (savedSettings) {
          try {
            const parsed = JSON.parse(savedSettings);
            loadedSettings = { ...loadedSettings, ...parsed };
          } catch (e) {
            console.error('Failed to parse settings:', e);
          }
        }

        // Check notification permission (don't overwrite other settings)
        if ('Notification' in window) {
          loadedSettings.notificationsEnabled = Notification.permission === 'granted';
        }

        // Update state and apply settings
        setSettings(loadedSettings);
        applySettings(loadedSettings);
        
        // Clean up old theme storage items - only use hideout_settings
        localStorage.removeItem('hideout_active_theme');
        localStorage.removeItem('hideout_theme');
        
        // Apply saved theme from settings
        if (loadedSettings.selectedTheme) {
          const theme = data.themes.find((t: any) => t.id === loadedSettings.selectedTheme);
          if (theme) {
            // Clean up old theme effects first
            const customEffectsContainer = document.getElementById('halloween-pumpkins');
            if (customEffectsContainer) customEffectsContainer.remove();
            const themeEffects = document.getElementById('theme-effects');
            if (themeEffects) themeEffects.remove();
            
            const oldScript = document.getElementById('hideout-theme');
            if (oldScript) oldScript.remove();
            
            const script = document.createElement('script');
            script.id = 'hideout-theme';
            script.src = `${data.site}${theme.themePath}`;
            document.head.appendChild(script);
          }
        }
      } catch (error) {
        console.error('Failed to load themes:', error);
        toast.error('Failed to load themes data');
      }
    };

    loadThemes();
  }, []);

  const applySettings = (newSettings: SettingsData) => {
    // Apply font size
    const root = document.documentElement;
    if (newSettings.fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (newSettings.fontSize === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }

    // Apply reduced motion
    if (newSettings.reducedMotion) {
      // Disable all animations when reduced motion is enabled
      root.style.setProperty('--transition-smooth', 'none');
      root.style.setProperty('--transition-fast', 'none');
      root.classList.add('reduce-motion');
      
      // Add CSS to disable all animations
      const styleId = 'reduce-motion-style';
      let style = document.getElementById(styleId);
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
      }
      style.textContent = `
        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `;
    } else {
      root.style.setProperty('--transition-smooth', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
      root.style.setProperty('--transition-fast', 'all 0.15s ease-out');
      root.classList.remove('reduce-motion');
      const style = document.getElementById('reduce-motion-style');
      if (style) style.remove();
    }

    // Apply performance mode
    if (newSettings.performanceMode) {
      root.classList.add('performance-mode');
    } else {
      root.classList.remove('performance-mode');
    }

    // Apply high contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  };

  const handleChange = (field: keyof SettingsData, value: any) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    
    // Save to localStorage immediately
    localStorage.setItem('hideout_settings', JSON.stringify(newSettings));
    
    // Apply settings immediately
    applySettings(newSettings);
    
    // Apply theme change immediately if theme was changed
    if (field === 'selectedTheme' && themesData) {
      const theme = themesData.themes.find(t => t.id === value);
      if (theme) {
        const script = document.getElementById('theme-script');
        if (script) {
          script.remove();
        }
        
        const newScript = document.createElement('script');
        newScript.id = 'theme-script';
        newScript.src = `${themesData.site}${theme.themePath}`;
        newScript.async = true;
        newScript.onload = () => {
          console.log(`Theme loaded: ${theme.name}`);
        };
        document.head.appendChild(newScript);
      }
    }
    
    toast.success("Settings saved", { duration: 2000 });
  };

  const handleRequestNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, notificationsEnabled: true }));
        toast.success("Notifications enabled!", { duration: 5000 });
      } else {
        toast.error("Notification permission denied", { duration: 5000 });
      }
    }
  };

  const handleClearLocalStorage = () => {
    const storedUser = localStorage.getItem('hideout_user') || sessionStorage.getItem('hideout_user');
    
    localStorage.clear();
    
    if (storedUser) {
      toast.info("Local storage cleared - you have been logged out", { duration: 5000 });
      window.location.href = '/';
    } else {
      toast.success("Local storage cleared successfully!", { duration: 5000 });
    }
  };

  const handleClearCookies = () => {
    const storedUser = localStorage.getItem('hideout_user') || sessionStorage.getItem('hideout_user');
    
    // Clear session storage
    sessionStorage.clear();
    
    // Clear cookies (if any)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    if (storedUser) {
      toast.info("Cookies cleared - you have been logged out", { duration: 5000 });
      window.location.href = '/';
    } else {
      toast.success("Cookies cleared successfully!", { duration: 5000 });
    }
  };

  const handleResetDefaults = () => {
    if (!themesData) return;

    const defaultSettings: SettingsData = {
      reducedMotion: false,
      fontSize: 'medium',
      highContrast: false,
      notificationsEnabled: settings.notificationsEnabled,
      generalNotifications: true,
      performanceMode: false,
      showFPS: false,
      disableUpdatePopups: false,
      incognitoMode: false,
      selectedTheme: themesData['main-theme'],
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('hideout_settings', JSON.stringify(defaultSettings));
    applySettings(defaultSettings);
    toast.success("Settings reset to defaults", { duration: 5000 });
  };

  const handleThemeChange = (themeId: string) => {
    if (!themesData) return;

    const theme = themesData.themes.find(t => t.id === themeId);
    if (!theme) return;

    // Clean up old theme effects thoroughly
    const oldScript = document.getElementById('hideout-theme');
    if (oldScript) {
      try {
        // Remove any custom effect containers
        const customEffectsContainer = document.getElementById('halloween-pumpkins');
        if (customEffectsContainer) customEffectsContainer.remove();
        const themeEffects = document.getElementById('theme-effects');
        if (themeEffects) themeEffects.remove();
      } catch (e) {}
      oldScript.remove();
    }

    // Load new theme
    const script = document.createElement('script');
    script.id = 'hideout-theme';
    script.src = `${themesData.site}${theme.themePath}`;
    document.head.appendChild(script);

    // Save to settings and localStorage immediately
    const newSettings = { ...settings, selectedTheme: themeId };
    setSettings(newSettings);
    localStorage.setItem('hideout_settings', JSON.stringify(newSettings));
    toast.success("Theme updated", { duration: 5000 });
  };

  const handleClearData = () => {
    // Clear all localStorage except theme settings
    const keysToRemove = Object.keys(localStorage).filter(
      (key) => !key.includes("hideout_settings")
    );
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    toast.success("All data cleared successfully");
  };

  if (!themesData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <StarBackground />
      <Navigation />
      <GlobalChat />

      <main className="pt-24 px-4 sm:px-6 pb-12 max-w-4xl mx-auto relative z-10">
        {fromBrowser && (
          <div className="mb-8 p-8 bg-card border border-border rounded-lg text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">🚧 Under Construction</h2>
            <p className="text-muted-foreground">Browser-specific settings are coming soon!</p>
          </div>
        )}
        
        {/* Header */}
        <div className="space-y-6 mb-12 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Manage your preferences and account</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card className="p-4 sm:p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Appearance</h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations</p>
                </div>
                <Switch 
                  checked={settings.reducedMotion} 
                  onCheckedChange={(v) => handleChange('reducedMotion', v)} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High Contrast</Label>
                  <p className="text-sm text-muted-foreground">Increase color contrast</p>
                </div>
                <Switch 
                  checked={settings.highContrast} 
                  onCheckedChange={(v) => handleChange('highContrast', v)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Font Size</Label>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <Button
                      key={size}
                      variant={settings.fontSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleChange('fontSize', size)}
                      className="capitalize"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={settings.selectedTheme} onValueChange={handleThemeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto custom-scrollbar">
                    {themesData.themes.map((theme) => (
                      <SelectItem key={theme.id} value={theme.id}>
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Data Settings */}
          <Card className="p-4 sm:p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Data & Storage</h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Clear Data</Label>
                  <p className="text-sm text-muted-foreground">Delete all local data</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleClearData} className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear Data
                </Button>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-4 sm:p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Notifications</h2>
            </div>
            <Separator className="mb-4" />
            {!settings.notificationsEnabled ? (
              <div className="text-center py-6 space-y-4">
                <p className="text-muted-foreground">Enable notifications to receive updates</p>
                <Button onClick={handleRequestNotifications} className="gap-2">
                  <Bell className="w-4 h-4" />
                  Allow Notifications
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive general notifications</p>
                  </div>
                  <Switch 
                    checked={settings.generalNotifications} 
                    onCheckedChange={(v) => handleChange('generalNotifications', v)} 
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Email Settings */}
          <Card className="p-4 sm:p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Email Settings</h2>
            </div>
            <Separator className="mb-4" />
            <EmailSettingsToggle />
          </Card>

          {/* Browser Settings */}
          <Card className="p-4 sm:p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Browser Settings</h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Incognito Mode</Label>
                  <p className="text-sm text-muted-foreground">Don't save history or cookies</p>
                </div>
                <Switch 
                  checked={settings.incognitoMode} 
                  onCheckedChange={(v) => handleChange('incognitoMode', v)} 
                />
              </div>
            </div>
          </Card>

          {/* Performance Settings */}
          <Card className="p-4 sm:p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Performance</h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Performance Mode</Label>
                  <p className="text-sm text-muted-foreground">Disable animations for better performance</p>
                </div>
                <Switch 
                  checked={settings.performanceMode} 
                  onCheckedChange={(v) => handleChange('performanceMode', v)} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show FPS Counter</Label>
                  <p className="text-sm text-muted-foreground">Display frames per second in games</p>
                </div>
                <Switch 
                  checked={settings.showFPS} 
                  onCheckedChange={(v) => handleChange('showFPS', v)} 
                />
              </div>
            </div>
          </Card>

          {/* Update Settings */}
          <Card className="p-4 sm:p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Updates</h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Disable Update Popups</Label>
                  <p className="text-sm text-muted-foreground">Don't show update notifications</p>
                </div>
                <Switch 
                  checked={settings.disableUpdatePopups} 
                  onCheckedChange={(v) => handleChange('disableUpdatePopups', v)} 
                />
              </div>
            </div>
          </Card>

          {/* Reset Button */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleResetDefaults}>Reset to Defaults</Button>
          </div>
        </div>
      </main>

    </div>
  );
};

export default SettingsPage;
