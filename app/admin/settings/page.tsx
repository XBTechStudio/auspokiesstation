"use client";

import { useState, useEffect } from "react";
import styles from "./settings.module.css";

type SiteSettings = {
  // Logo
  logoUrl?: string;
  
  // Contact & Social
  contactEmail?: string;
  contactFormEmail?: string;
  telegram?: string;
  whatsapp?: {
    channel?: string;
    community?: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    telegram?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  
  // Footer
  footerDescription?: string;
  responsibleGamingText?: string;
  
  // Homepage
  heroTitle?: string;
  heroSubtitle?: string;
  
  // Contact Page
  contactPageTitle?: string;
  contactPageSubtitle?: string;
  
  // Other
  feedbackDocs?: string;
  complaintHotline?: {
    phone?: string;
    link?: string;
  };
  marquee?: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      
      // First, get admin settings (local database)
      const adminResponse = await fetch("/api/admin/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Also get public settings (which includes defaults from external databases)
      const publicResponse = await fetch("/api/settings");

      let adminData: SiteSettings = {};
      let publicData: SiteSettings = {};

      if (adminResponse.ok) {
        adminData = await adminResponse.json();
      }

      if (publicResponse.ok) {
        publicData = await publicResponse.json();
      }

      // Merge: admin settings override public settings, but use public as defaults
      const mergedSettings = {
        // Logo
        logoUrl: adminData.logoUrl || publicData.logoUrl || "/partnership_logo.png",
        
        // Contact & Social
        contactEmail: adminData.contactEmail || publicData.contactEmail || "88grouppartnership@gmail.com",
        contactFormEmail: adminData.contactFormEmail || publicData.contactFormEmail || "88grouppartnership@gmail.com",
        telegram: adminData.telegram || publicData.telegram || "https://t.me/AusPokiesStation",
        whatsapp: {
          channel: adminData.whatsapp?.channel || publicData.whatsapp?.channel || "",
          community: adminData.whatsapp?.community || publicData.whatsapp?.community || "https://chat.whatsapp.com/FzBYah59mJPCfWRf7xVdhO",
        },
        socialMedia: {
          facebook: adminData.socialMedia?.facebook || publicData.socialMedia?.facebook || "https://www.facebook.com",
          instagram: adminData.socialMedia?.instagram || publicData.socialMedia?.instagram || "https://www.instagram.com",
          twitter: adminData.socialMedia?.twitter || publicData.socialMedia?.twitter || "https://twitter.com",
          telegram: adminData.socialMedia?.telegram || publicData.socialMedia?.telegram || "https://t.me/AusPokiesStation",
        },
        contact: {
          email: adminData.contact?.email || publicData.contact?.email || "",
          phone: adminData.contact?.phone || publicData.contact?.phone || "+61 420 368 915",
          address: adminData.contact?.address || publicData.contact?.address || "",
        },
        
        // Footer
        footerDescription: adminData.footerDescription || publicData.footerDescription || "88 GROUP × WILD GROUP PARTNERSHIP connects Australian players with trusted casino platforms offering competitive welcome bonuses, thousands of online pokies, live casino games, and secure access.",
        responsibleGamingText: adminData.responsibleGamingText || publicData.responsibleGamingText || "Please gamble responsibly. Only play with money you can afford to lose. If you have a gambling problem, seek help from organizations like Gambling Help Online (www.gamblinghelponline.org.au) or call 1800 858 858.",
        
        // Homepage
        heroTitle: adminData.heroTitle || publicData.heroTitle || "88 GROUP × WILD GROUP PARTNERSHIP Best Online Casinos Australia for Real Money & Bonuses",
        heroSubtitle: adminData.heroSubtitle || publicData.heroSubtitle || "One gateway. Multiple verified brands.\nFast access, transparent data, real-time withdrawals.",
        
        // Contact Page
        contactPageTitle: adminData.contactPageTitle || publicData.contactPageTitle || "Contact Us",
        contactPageSubtitle: adminData.contactPageSubtitle || publicData.contactPageSubtitle || "Have a question? We'd love to hear from you.",
        
        // Other
        feedbackDocs: adminData.feedbackDocs || publicData.feedbackDocs || "",
        complaintHotline: {
          phone: adminData.complaintHotline?.phone || publicData.complaintHotline?.phone || "+61 420 368 915",
          link: adminData.complaintHotline?.link || publicData.complaintHotline?.link || "https://api.whatsapp.com/send/?phone=%2B61420368915&text&type=phone_number&app_absent=0&wame_ctl=1",
        },
        marquee: adminData.marquee || publicData.marquee || "",
      };

      setSettings(mergedSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.error || "Failed to save settings" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error saving settings" });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNestedSetting = (parentKey: string, childKey: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey as keyof SiteSettings] as any),
        [childKey]: value,
      },
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Invalid file type. Only images are allowed." });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setMessage({ type: "error", text: "File size too large. Maximum size is 5MB." });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setUploadingLogo(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateSetting("logoUrl", data.url);
        setLogoPreview(data.url);
        setMessage({ type: "success", text: "Logo uploaded successfully!" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setMessage({ type: "error", text: errorData.error || "Failed to upload logo" });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error uploading logo" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setUploadingLogo(false);
    }
  };

  useEffect(() => {
    if (settings.logoUrl) {
      setLogoPreview(settings.logoUrl);
    }
  }, [settings.logoUrl]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className={styles.settingsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Site Settings</h1>
        <p className={styles.subtitle}>Manage site-wide settings and content</p>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.settingsContainer}>
        {/* Logo Section */}
        <div className={styles.settingsSection}>
          <h2 className={styles.sectionTitle}>Logo</h2>
          
          <div className={styles.formGroup}>
            <label>Logo Image</label>
            
            {logoPreview && (
              <div className={styles.logoPreview}>
                <img src={logoPreview} alt="Logo Preview" className={styles.logoPreviewImage} />
                <button
                  type="button"
                  onClick={() => {
                    setLogoPreview("");
                    updateSetting("logoUrl", "");
                  }}
                  className={styles.removeLogoButton}
                >
                  Remove
                </button>
              </div>
            )}

            <div className={styles.uploadContainer}>
              <input
                type="file"
                id="logoUpload"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
                className={styles.fileInput}
              />
              <label htmlFor="logoUpload" className={styles.uploadButton}>
                {uploadingLogo ? "Uploading..." : logoPreview ? "Change Logo" : "Upload Logo"}
              </label>
              <p className={styles.helpText}>
                Supported formats: JPEG, PNG, GIF, WebP, SVG (Max 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Social Section */}
        <div className={styles.settingsSection}>
          <h2 className={styles.sectionTitle}>Contact & Social Media</h2>
          
          <div className={styles.formGroup}>
            <label>Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail || ""}
              onChange={(e) => updateSetting("contactEmail", e.target.value)}
              placeholder={settings.contactEmail || "88grouppartnership@gmail.com"}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Telegram Link</label>
            <input
              type="url"
              value={settings.telegram || ""}
              onChange={(e) => updateSetting("telegram", e.target.value)}
              placeholder={settings.telegram || "https://t.me/AusPokiesStation"}
            />
          </div>

          <div className={styles.formGroup}>
            <label>WhatsApp Channel</label>
            <input
              type="url"
              value={settings.whatsapp?.channel || ""}
              onChange={(e) => updateNestedSetting("whatsapp", "channel", e.target.value)}
              placeholder={settings.whatsapp?.channel || "https://whatsapp.com/channel/..."}
            />
          </div>

          <div className={styles.formGroup}>
            <label>WhatsApp Community</label>
            <input
              type="url"
              value={settings.whatsapp?.community || ""}
              onChange={(e) => updateNestedSetting("whatsapp", "community", e.target.value)}
              placeholder={settings.whatsapp?.community || "https://chat.whatsapp.com/FzBYah59mJPCfWRf7xVdhO"}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Facebook URL</label>
            <input
              type="url"
              value={settings.socialMedia?.facebook || ""}
              onChange={(e) => updateNestedSetting("socialMedia", "facebook", e.target.value)}
              placeholder={settings.socialMedia?.facebook || "https://www.facebook.com"}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Instagram URL</label>
            <input
              type="url"
              value={settings.socialMedia?.instagram || ""}
              onChange={(e) => updateNestedSetting("socialMedia", "instagram", e.target.value)}
              placeholder={settings.socialMedia?.instagram || "https://www.instagram.com"}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Twitter URL</label>
            <input
              type="url"
              value={settings.socialMedia?.twitter || ""}
              onChange={(e) => updateNestedSetting("socialMedia", "twitter", e.target.value)}
              placeholder={settings.socialMedia?.twitter || "https://twitter.com"}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Contact Phone</label>
            <input
              type="tel"
              value={settings.contact?.phone || ""}
              onChange={(e) => updateNestedSetting("contact", "phone", e.target.value)}
              placeholder={settings.contact?.phone || "+61 420 368 915"}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Contact Address</label>
            <textarea
              value={settings.contact?.address || ""}
              onChange={(e) => updateNestedSetting("contact", "address", e.target.value)}
              placeholder={settings.contact?.address || "Physical address"}
              rows={3}
            />
          </div>
        </div>

        {/* Homepage Section */}
        <div className={styles.settingsSection}>
          <h2 className={styles.sectionTitle}>Homepage Content</h2>
          
          <div className={styles.formGroup}>
            <label>Hero Title</label>
            <input
              type="text"
              value={settings.heroTitle || ""}
              onChange={(e) => updateSetting("heroTitle", e.target.value)}
              placeholder={settings.heroTitle || "88 GROUP × WILD GROUP PARTNERSHIP"}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Hero Subtitle</label>
            <textarea
              value={settings.heroSubtitle || ""}
              onChange={(e) => updateSetting("heroSubtitle", e.target.value)}
              placeholder={settings.heroSubtitle || "Your hero subtitle text"}
              rows={3}
            />
          </div>
        </div>

        {/* Contact Page Section */}
        <div className={styles.settingsSection}>
          <h2 className={styles.sectionTitle}>Contact Page Content</h2>
          
          <div className={styles.formGroup}>
            <label>Contact Page Title</label>
            <input
              type="text"
              value={settings.contactPageTitle || ""}
              onChange={(e) => updateSetting("contactPageTitle", e.target.value)}
              placeholder={settings.contactPageTitle || "Contact Us"}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Contact Page Subtitle</label>
            <textarea
              value={settings.contactPageSubtitle || ""}
              onChange={(e) => updateSetting("contactPageSubtitle", e.target.value)}
              placeholder={settings.contactPageSubtitle || "Have a question? We'd love to hear from you."}
              rows={2}
            />
          </div>
        </div>

        {/* Footer Section */}
        <div className={styles.settingsSection}>
          <h2 className={styles.sectionTitle}>Footer Content</h2>
          
          <div className={styles.formGroup}>
            <label>Footer Description</label>
            <textarea
              value={settings.footerDescription || ""}
              onChange={(e) => updateSetting("footerDescription", e.target.value)}
              placeholder={settings.footerDescription || "88 GROUP × WILD GROUP PARTNERSHIP connects Australian players with trusted casino platforms offering competitive welcome bonuses, thousands of online pokies, live casino games, and secure access."}
              rows={4}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Responsible Gaming Text</label>
            <textarea
              value={settings.responsibleGamingText || ""}
              onChange={(e) => updateSetting("responsibleGamingText", e.target.value)}
              placeholder={settings.responsibleGamingText || "Please gamble responsibly. Only play with money you can afford to lose. If you have a gambling problem, seek help from organizations like Gambling Help Online (www.gamblinghelponline.org.au) or call 1800 858 858."}
              rows={4}
            />
          </div>
        </div>

        {/* Email Settings */}
        <div className={styles.settingsSection}>
          <h2 className={styles.sectionTitle}>Email Settings</h2>
          
          <div className={styles.formGroup}>
            <label>Contact Form Recipient Email</label>
            <input
              type="email"
              value={settings.contactFormEmail || ""}
              onChange={(e) => updateSetting("contactFormEmail", e.target.value)}
              placeholder={settings.contactFormEmail || "88grouppartnership@gmail.com"}
            />
            <p className={styles.helpText}>Email address to receive contact form submissions</p>
          </div>

          <div className={styles.infoBox}>
            <p className={styles.infoText}>
              <strong>Note:</strong> SMTP configuration (host, port, user, password) is managed via environment variables (`.env` file). 
              Please configure <code>SMTP_HOST</code>, <code>SMTP_PORT</code>, <code>SMTP_USER</code>, <code>SMTP_PASS</code>, and <code>SMTP_FROM</code> in your `.env.local` file.
            </p>
          </div>
        </div>

        {/* Other Settings */}
        <div className={styles.settingsSection}>
          <h2 className={styles.sectionTitle}>Other Settings</h2>
          
          <div className={styles.formGroup}>
            <label>Feedback Docs URL</label>
            <input
              type="url"
              value={settings.feedbackDocs || ""}
              onChange={(e) => updateSetting("feedbackDocs", e.target.value)}
              placeholder={settings.feedbackDocs || "https://..."}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Complaint Hotline Phone</label>
            <input
              type="tel"
              value={settings.complaintHotline?.phone || ""}
              onChange={(e) => updateNestedSetting("complaintHotline", "phone", e.target.value)}
              placeholder={settings.complaintHotline?.phone || "+61 420 368 915"}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Complaint Hotline Link</label>
            <input
              type="url"
              value={settings.complaintHotline?.link || ""}
              onChange={(e) => updateNestedSetting("complaintHotline", "link", e.target.value)}
              placeholder={settings.complaintHotline?.link || "https://api.whatsapp.com/send/?phone=%2B61420368915&text&type=phone_number&app_absent=0&wame_ctl=1"}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Marquee Text</label>
            <input
              type="text"
              value={settings.marquee || ""}
              onChange={(e) => updateSetting("marquee", e.target.value)}
              placeholder={settings.marquee || "Scrolling marquee text"}
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleSave}
          disabled={saving}
          className={styles.saveButton}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
