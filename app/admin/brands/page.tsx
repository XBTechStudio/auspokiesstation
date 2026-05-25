"use client";

import { useState, useEffect } from "react";
import styles from "./brands.module.css";

type Brand = {
  id: number;
  key: string;
  name: string;
  registerUrl_2?: string;
  source: 'wildgroup' | '88group';
};

/** WildGroup 与 88Group 各库自增 id 会重复，必须用 source+id 区分行状态 */
function brandRowKey(brand: Brand): string {
  return `${brand.source}:${brand.id}`;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/brands", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBrands(data);
        // Initialize edit values
        const initialValues: Record<string, string> = {};
        data.forEach((brand: Brand) => {
          initialValues[brandRowKey(brand)] = brand.registerUrl_2 || '';
        });
        setEditValues(initialValues);
        
        if (data.length === 0) {
          setMessage({ 
            type: "error", 
            text: "No brands found. Please check: 1) Database connection 2) Brands table exists 3) Brands have is_active = TRUE" 
          });
          setTimeout(() => setMessage(null), 8000);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error("API Error:", errorData);
        setMessage({ 
          type: "error", 
          text: `Failed to fetch brands: ${errorData.error || 'Unknown error'}. Check browser console for details.` 
        });
        setTimeout(() => setMessage(null), 8000);
      }
    } catch (error: any) {
      console.error("Error fetching brands:", error);
      setMessage({ 
        type: "error", 
        text: `Error fetching brands: ${error.message || 'Network error'}. Check browser console for details.` 
      });
      setTimeout(() => setMessage(null), 8000);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (brand: Brand) => {
    const key = brandRowKey(brand);
    setSaving((prev) => ({ ...prev, [key]: true }));
    setMessage(null);

    try {
      const token = localStorage.getItem("admin_token");
      const registerUrl_2 = editValues[key]?.trim() || null;
      
      const response = await fetch("/api/admin/brands", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: brand.id,
          source: brand.source,
          registerUrl_2: registerUrl_2,
        }),
      });

      if (response.ok) {
        setBrands((prev) =>
          prev.map((b) =>
            b.source === brand.source && b.id === brand.id
              ? { ...b, registerUrl_2: registerUrl_2 || undefined }
              : b
          )
        );
        setEditingKey(null);
        setMessage({ type: "success", text: `${brand.name} updated successfully!` });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.error || `Failed to update ${brand.name}` });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error saving brand:", error);
      setMessage({ type: "error", text: `Error updating ${brand.name}` });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleCancel = (brand: Brand) => {
    const key = brandRowKey(brand);
    setEditValues({
      ...editValues,
      [key]: brand.registerUrl_2 || '',
    });
    setEditingKey(null);
  };

  const handleEdit = (brand: Brand) => {
    const key = brandRowKey(brand);
    setEditingKey(key);
    setEditValues({
      ...editValues,
      [key]: brand.registerUrl_2 || '',
    });
  };

  const filteredBrands = {
    wildgroup: brands.filter(b => b.source === 'wildgroup'),
    '88group': brands.filter(b => b.source === '88group'),
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading brands...</p>
      </div>
    );
  }

  return (
    <div className={styles.brandsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Brand Management</h1>
        <p className={styles.subtitle}>Configure Register Now links for all partner brands</p>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.brandsContainer}>
        {/* WildGroup Brands */}
        <div className={styles.brandSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sourceBadge} style={{ background: '#6B46C1' }}>WildGroup</span>
            Brands ({filteredBrands.wildgroup.length})
          </h2>
          
          {filteredBrands.wildgroup.length === 0 ? (
            <p className={styles.emptyMessage}>No WildGroup brands found</p>
          ) : (
            <div className={styles.brandsList}>
              {filteredBrands.wildgroup.map((brand) => {
                const rowKey = brandRowKey(brand);
                return (
                <div key={rowKey} className={styles.brandCard}>
                  <div className={styles.brandInfo}>
                    <h3 className={styles.brandName}>{brand.name}</h3>
                    <span className={styles.brandKey}>{brand.key}</span>
                  </div>
                  
                  {editingKey === rowKey ? (
                    <div className={styles.editForm}>
                      <input
                        type="url"
                        value={editValues[rowKey] || ''}
                        onChange={(e) => {
                          setEditValues({
                            ...editValues,
                            [rowKey]: e.target.value,
                          });
                        }}
                        placeholder="Enter Register URL"
                        className={styles.urlInput}
                      />
                      <div className={styles.editActions}>
                        <button
                          onClick={() => handleSave(brand)}
                          disabled={saving[rowKey]}
                          className={styles.saveButton}
                        >
                          {saving[rowKey] ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => handleCancel(brand)}
                          disabled={saving[rowKey]}
                          className={styles.cancelButton}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.viewMode}>
                      <div className={styles.urlDisplay}>
                        {brand.registerUrl_2 ? (
                          <a
                            href={brand.registerUrl_2}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.urlLink}
                          >
                            {brand.registerUrl_2}
                          </a>
                        ) : (
                          <span className={styles.noUrl}>No URL set</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleEdit(brand)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              );
              })}
            </div>
          )}
        </div>

        {/* 88Group Brands */}
        <div className={styles.brandSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sourceBadge} style={{ background: '#059669' }}>88Group</span>
            Brands ({filteredBrands['88group'].length})
          </h2>
          
          {filteredBrands['88group'].length === 0 ? (
            <p className={styles.emptyMessage}>No 88Group brands found</p>
          ) : (
            <div className={styles.brandsList}>
              {filteredBrands['88group'].map((brand) => {
                const rowKey = brandRowKey(brand);
                return (
                <div key={rowKey} className={styles.brandCard}>
                  <div className={styles.brandInfo}>
                    <h3 className={styles.brandName}>{brand.name}</h3>
                    <span className={styles.brandKey}>{brand.key}</span>
                  </div>
                  
                  {editingKey === rowKey ? (
                    <div className={styles.editForm}>
                      <input
                        type="url"
                        value={editValues[rowKey] || ''}
                        onChange={(e) => {
                          setEditValues({
                            ...editValues,
                            [rowKey]: e.target.value,
                          });
                        }}
                        placeholder="Enter Register URL"
                        className={styles.urlInput}
                      />
                      <div className={styles.editActions}>
                        <button
                          onClick={() => handleSave(brand)}
                          disabled={saving[rowKey]}
                          className={styles.saveButton}
                        >
                          {saving[rowKey] ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => handleCancel(brand)}
                          disabled={saving[rowKey]}
                          className={styles.cancelButton}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.viewMode}>
                      <div className={styles.urlDisplay}>
                        {brand.registerUrl_2 ? (
                          <a
                            href={brand.registerUrl_2}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.urlLink}
                          >
                            {brand.registerUrl_2}
                          </a>
                        ) : (
                          <span className={styles.noUrl}>No URL set</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleEdit(brand)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
