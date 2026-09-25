import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import {
  LayoutDashboard,
  Inbox,
  Users,
  Briefcase,
  Wrench,
  Building2,
  FolderKanban,
  FileText,
  Sliders,
  Image as ImageIcon,
  Settings,
  History,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  X,
  Upload,
  RefreshCw,
  Check,
  Globe,
  MapPin,
  Calendar,
  Tag,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Layers,
  Copy,
  FileDown,
  Navigation,
} from 'lucide-react';

interface AdminLayoutProps {
  onNavigateHome: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onNavigateHome }) => {
  const { adminProfile, token, logout } = useAuth();
  const { refreshData } = useData();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'hero-banner'
    | 'footer'
    | 'contacts'
    | 'manpower'
    | 'services'
    | 'workforce'
    | 'industries'
    | 'portfolio'
    | 'blog'
    | 'form-options'
    | 'media'
    | 'settings'
    | 'activity-logs'
  >('overview');

  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Sub-view data states
  const [contacts, setContacts] = useState<any[]>([]);
  const [manpowerList, setManpowerList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [workforceList, setWorkforceList] = useState<any[]>([]);
  const [industriesList, setIndustriesList] = useState<any[]>([]);
  const [portfolioList, setPortfolioList] = useState<any[]>([]);
  const [blogList, setBlogList] = useState<any[]>([]);
  const [formOptionsList, setFormOptionsList] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [activityList, setActivityList] = useState<any[]>([]);
  const [settingsForm, setSettingsForm] = useState<any>({});

  // Modals & form editor states
  const [selectedManpower, setSelectedManpower] = useState<any | null>(null);
  const [editItemModal, setEditItemModal] = useState<{
    type: 'service' | 'workforce' | 'industry' | 'portfolio' | 'blog' | 'form-option';
    item: any | null;
  } | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formGroupFilter, setFormGroupFilter] = useState<string>('all');
  const [portfolioStatusFilter, setPortfolioStatusFilter] = useState<string>('all');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState<string>('all');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>('all');
  const [mediaSearchTerm, setMediaSearchTerm] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Logo & Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState<{
    targetField: string;
    targetContext?: 'settings' | 'modal' | 'gallery';
    title: string;
  } | null>(null);
  const [mediaPickerSearch, setMediaPickerSearch] = useState('');

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  const notify = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Fetch stats & active tab data
  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const res = await fetch('/api/admin/stats', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadTabData = async () => {
    try {
      if (activeTab === 'overview') {
        loadStats();
      } else if (activeTab === 'contacts') {
        const res = await fetch('/api/admin/contact-submissions', { headers: getHeaders() });
        if (res.ok) setContacts(await res.json());
      } else if (activeTab === 'manpower') {
        const res = await fetch('/api/admin/manpower-requests', { headers: getHeaders() });
        if (res.ok) setManpowerList(await res.json());
      } else if (activeTab === 'services') {
        const res = await fetch('/api/admin/services', { headers: getHeaders() });
        if (res.ok) setServicesList(await res.json());
      } else if (activeTab === 'workforce') {
        const res = await fetch('/api/admin/workforce', { headers: getHeaders() });
        if (res.ok) setWorkforceList(await res.json());
      } else if (activeTab === 'industries') {
        const res = await fetch('/api/admin/industries', { headers: getHeaders() });
        if (res.ok) setIndustriesList(await res.json());
      } else if (activeTab === 'portfolio') {
        const res = await fetch('/api/admin/portfolio', { headers: getHeaders() });
        if (res.ok) setPortfolioList(await res.json());
      } else if (activeTab === 'blog') {
        const res = await fetch('/api/admin/blog', { headers: getHeaders() });
        if (res.ok) setBlogList(await res.json());
      } else if (activeTab === 'form-options') {
        const res = await fetch('/api/admin/form-options', { headers: getHeaders() });
        if (res.ok) setFormOptionsList(await res.json());
      } else if (activeTab === 'media') {
        const res = await fetch('/api/admin/media', { headers: getHeaders() });
        if (res.ok) setMediaList(await res.json());
      } else if (activeTab === 'hero-banner' || activeTab === 'footer' || activeTab === 'settings') {
        const res = await fetch('/api/admin/settings', { headers: getHeaders() });
        if (res.ok) setSettingsForm(await res.json());
        const mediaRes = await fetch('/api/admin/media', { headers: getHeaders() });
        if (mediaRes.ok) setMediaList(await mediaRes.json());
      } else if (activeTab === 'activity-logs') {
        const res = await fetch('/api/admin/activity-logs', { headers: getHeaders() });
        if (res.ok) setActivityList(await res.json());
      }
    } catch (err) {
      console.error('Error loading tab data:', err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadTabData();
    setSearchTerm('');
    setStatusFilter('all');
  }, [activeTab]);

  // Status updates for Leads
  const updateContactStatus = async (id: number, status: string, notes?: string) => {
    try {
      const res = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        notify(`Contact #${id} updated to ${status}`);
        loadTabData();
        loadStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteContact = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this contact inquiry?')) return;
    try {
      const res = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        notify(`Contact #${id} deleted`);
        loadTabData();
        loadStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateManpowerStatus = async (id: number, status: string, notes?: string) => {
    try {
      const res = await fetch(`/api/admin/manpower-requests/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        notify(`Requisition #${id} updated to ${status}`);
        loadTabData();
        loadStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteManpower = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this manpower requisition?')) return;
    try {
      const res = await fetch(`/api/admin/manpower-requests/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        notify(`Requisition #${id} deleted`);
        setSelectedManpower(null);
        loadTabData();
        loadStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        notify('Platform branding and settings successfully saved');
        await refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const form = new FormData();
    form.append('file', file);
    form.append('altText', file.name);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (res.ok) {
        notify(`Uploaded file: ${file.name}`);
        loadTabData();
      }
    } catch (err) {
      console.error('File upload failed:', err);
    }
  };

  const deleteMedia = async (mediaItemOrId: any) => {
    const item =
      typeof mediaItemOrId === 'object' && mediaItemOrId !== null
        ? mediaItemOrId
        : mediaList.find((m) => m.id === mediaItemOrId || String(m.id) === String(mediaItemOrId)) || {
            id: mediaItemOrId,
          };

    const targetId = item.id;
    const targetUrl = item.url || '';
    const targetFilename = item.filename || '';

    // Immediate optimistic update in UI: remove right away
    setMediaList((prev) =>
      prev.filter(
        (m) =>
          m.id !== targetId &&
          String(m.id) !== String(targetId) &&
          (!targetUrl || m.url !== targetUrl) &&
          (!targetFilename || m.filename !== targetFilename)
      )
    );

    try {
      const queryParams = new URLSearchParams();
      if (targetUrl) queryParams.set('url', targetUrl);
      if (targetFilename) queryParams.set('filename', targetFilename);
      const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';

      const res = await fetch(`/api/admin/media/${encodeURIComponent(targetId)}${queryStr}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        notify('Photo asset permanently deleted');
      } else {
        notify('Photo removed from library');
      }
    } catch (e) {
      console.error(e);
      notify('Photo removed from library');
    }
  };

  // Remove gallery image from case study in edit modal
  const handleRemoveGalleryImage = (imageUrl: string) => {
    if (!editItemModal?.item) return;
    let galleryArr: string[] = [];
    if (Array.isArray(editItemModal.item.gallery)) {
      galleryArr = [...editItemModal.item.gallery];
    } else if (typeof editItemModal.item.gallery === 'string') {
      try {
        galleryArr = JSON.parse(editItemModal.item.gallery);
      } catch {
        galleryArr = editItemModal.item.gallery ? [editItemModal.item.gallery] : [];
      }
    }
    const updated = galleryArr.filter((img) => img !== imageUrl);
    setEditItemModal({
      ...editItemModal,
      item: {
        ...editItemModal.item,
        gallery: updated,
      },
    });
    notify('Removed image from gallery');
  };

  // Set an asset directly as logo, footer logo, favicon, or hero banner
  const handleSetAsLogo = async (
    mediaUrl: string,
    targetField: 'logoUrl' | 'footerLogoUrl' | 'faviconUrl' | 'heroBannerImage' = 'logoUrl'
  ) => {
    try {
      const updated = {
        ...settingsForm,
        [targetField]: mediaUrl,
      };
      setSettingsForm(updated);

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        const label =
          targetField === 'logoUrl'
            ? 'Header Logo'
            : targetField === 'footerLogoUrl'
            ? 'Footer Logo'
            : targetField === 'heroBannerImage'
            ? 'Hero Banner'
            : 'Favicon';
        notify(`Updated ${label} successfully!`);
        await refreshData();
        setMediaPickerOpen(null);
      }
    } catch (err) {
      console.error('Error updating asset setting:', err);
    }
  };

  // Direct upload for logo, footer logo, or favicon
  const handleLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: 'logoUrl' | 'footerLogoUrl' | 'faviconUrl' = 'logoUrl'
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const form = new FormData();
    form.append('file', file);
    form.append('altText', `${settingsForm.companyName || 'Brand'} ${targetField}`);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (res.ok) {
        const uploadedMedia = await res.json();
        const updated = {
          ...settingsForm,
          [targetField]: uploadedMedia.url,
        };
        setSettingsForm(updated);

        const saveRes = await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify(updated),
        });

        if (saveRes.ok) {
          const label =
            targetField === 'logoUrl'
              ? 'Primary Logo'
              : targetField === 'footerLogoUrl'
              ? 'Footer Logo'
              : 'Favicon';
          notify(`Uploaded & activated new ${label}!`);
          await refreshData();
          setMediaPickerOpen(null);

          const mRes = await fetch('/api/admin/media', { headers: getHeaders() });
          if (mRes.ok) setMediaList(await mRes.json());
        }
      }
    } catch (err) {
      console.error('Logo upload failed:', err);
    }
  };

  // Upload handler specifically for Company Profile PDF Document
  const handleCompanyProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      notify('Please select a valid PDF file (.pdf)');
      return;
    }

    const form = new FormData();
    form.append('file', file);

    try {
      notify(`Uploading ${file.name}...`);
      const res = await fetch('/api/admin/company-profile/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        const updated = {
          ...settingsForm,
          companyProfilePdfUrl: data.url,
          companyProfilePdfName: data.originalName,
        };
        setSettingsForm(updated);
        notify('Company Profile PDF successfully uploaded & activated for visitors!');
        await refreshData();
      } else {
        const errData = await res.json();
        notify(errData.error || 'Failed to upload Company Profile PDF.');
      }
    } catch (err: any) {
      console.error('Company profile upload error:', err);
      notify('Network error uploading PDF file.');
    }
  };

  const handleSelectPickerAsset = (mediaUrl: string) => {
    if (!mediaPickerOpen) return;
    if (mediaPickerOpen.targetContext === 'modal') {
      setEditItemModal((prev) => {
        if (!prev) return null;
        const nextItem = {
          ...prev.item,
          [mediaPickerOpen.targetField]: mediaUrl,
        };
        // Keep image and featuredImage in sync
        if (mediaPickerOpen.targetField === 'featuredImage') {
          nextItem.image = mediaUrl;
        } else if (mediaPickerOpen.targetField === 'image') {
          nextItem.featuredImage = mediaUrl;
        }
        return {
          ...prev,
          item: nextItem,
        };
      });
      notify('Selected image asset');
      setMediaPickerOpen(null);
    } else if (mediaPickerOpen.targetContext === 'gallery') {
      if (!editItemModal?.item) return;
      let galleryArr: string[] = [];
      if (Array.isArray(editItemModal.item.gallery)) {
        galleryArr = [...editItemModal.item.gallery];
      } else if (typeof editItemModal.item.gallery === 'string') {
        try {
          galleryArr = JSON.parse(editItemModal.item.gallery);
        } catch {
          galleryArr = editItemModal.item.gallery ? [editItemModal.item.gallery] : [];
        }
      }
      if (!galleryArr.includes(mediaUrl)) {
        galleryArr.push(mediaUrl);
      }
      setEditItemModal({
        ...editItemModal,
        item: {
          ...editItemModal.item,
          gallery: galleryArr,
        },
      });
      notify('Added image to case study gallery');
      setMediaPickerOpen(null);
    } else if (mediaPickerOpen.targetContext === 'settings') {
      setSettingsForm((prev: any) => ({
        ...prev,
        [mediaPickerOpen.targetField]: mediaUrl,
      }));
      notify('Updated banner asset');
      setMediaPickerOpen(null);
    } else {
      handleSetAsLogo(mediaUrl, mediaPickerOpen.targetField as any);
    }
  };

  const handlePickerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !mediaPickerOpen) return;
    const file = e.target.files[0];
    const form = new FormData();
    form.append('file', file);
    form.append('altText', file.name);

    try {
      notify(`Uploading ${file.name}...`);
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (res.ok) {
        const uploaded = await res.json();
        const uploadedUrl = uploaded.file?.url || uploaded.url;
        notify(`Uploaded ${file.name}`);
        const mRes = await fetch('/api/admin/media', { headers: getHeaders() });
        if (mRes.ok) setMediaList(await mRes.json());
        handleSelectPickerAsset(uploadedUrl);
      }
    } catch (err) {
      console.error('Picker upload failed:', err);
    }
  };

  // Generic Save Modal Handler
  const handleSaveItemModal = async (data: any) => {
    if (!editItemModal) return;
    const { type, item } = editItemModal;
    const isEdit = Boolean(item?.id);
    let endpoint = `/api/admin/${type === 'form-option' ? 'form-options' : type === 'workforce' ? 'workforce' : type === 'service' ? 'services' : type === 'industry' ? 'industries' : type}`;
    if (isEdit) endpoint += `/${item.id}`;

    const preparedData = { ...data };

    // Standardize image & featuredImage across catalog types
    if (type === 'service' || type === 'portfolio' || type === 'blog') {
      if (preparedData.image && !preparedData.featuredImage) {
        preparedData.featuredImage = preparedData.image;
      }
      if (preparedData.featuredImage && !preparedData.image) {
        preparedData.image = preparedData.featuredImage;
      }
    } else if (type === 'workforce' || type === 'industry') {
      if (preparedData.featuredImage && !preparedData.image) {
        preparedData.image = preparedData.featuredImage;
      }
      if (preparedData.image && !preparedData.featuredImage) {
        preparedData.featuredImage = preparedData.image;
      }
    }

    const arrayFields = ['servicesProvided', 'workforceCategories', 'tags', 'skills', 'benefits', 'industries', 'relatedIndustries'];
    for (const f of arrayFields) {
      if (typeof preparedData[f] === 'string') {
        preparedData[f] = preparedData[f]
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    }
    if (Array.isArray(preparedData.gallery)) {
      preparedData.gallery = JSON.stringify(preparedData.gallery);
    }

    try {
      const res = await fetch(endpoint, {
        method: isEdit ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(preparedData),
      });
      if (res.ok) {
        notify(`${type.toUpperCase()} ${isEdit ? 'updated' : 'created'} successfully`);
        setEditItemModal(null);
        loadTabData();
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFormOption = async (opt: any) => {
    try {
      const updated = { ...opt, isActive: !opt.isActive };
      const res = await fetch(`/api/admin/form-options/${opt.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        notify(`Option "${opt.label}" ${!opt.isActive ? 'activated' : 'deactivated'}`);
        loadTabData();
        refreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteEntity = async (type: string, id: number) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    const endpoint = `/api/admin/${type === 'form-option' ? 'form-options' : type === 'workforce' ? 'workforce' : type === 'service' ? 'services' : type === 'industry' ? 'industries' : type}/${id}`;
    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (res.ok) {
        notify(`Item deleted`);
        loadTabData();
        refreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderEntityImageField = (
    label: string,
    description: string,
    targetField: 'featuredImage' | 'image',
    pickerTitle: string
  ) => {
    if (!editItemModal?.item) return null;
    const currentUrl =
      editItemModal.item[targetField] ||
      (targetField === 'featuredImage'
        ? editItemModal.item.image
        : editItemModal.item.featuredImage) ||
      '';

    const updateImage = (url: string) => {
      setEditItemModal({
        ...editItemModal,
        item: {
          ...editItemModal.item,
          [targetField]: url,
          featuredImage: url,
          image: url,
        },
      });
    };

    return (
      <div className="space-y-3 bg-slate-50/90 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase">
              {label}
            </label>
            <p className="text-[11px] text-slate-500">{description}</p>
          </div>
          {currentUrl && (
            <button
              type="button"
              onClick={() => updateImage('')}
              className="px-2.5 py-1 text-xs text-rose-600 hover:text-white hover:bg-rose-600 rounded font-semibold flex items-center gap-1 border border-rose-200 hover:border-rose-600 transition-colors cursor-pointer"
              title="Remove assigned image"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Image</span>
            </button>
          )}
        </div>

        {currentUrl ? (
          <div className="relative h-44 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 group flex items-center justify-center">
            <img
              src={currentUrl}
              alt="Asset Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '0.3';
              }}
            />
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setMediaPickerOpen({
                    targetField,
                    targetContext: 'modal',
                    title: pickerTitle,
                  })
                }
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
              >
                Change Photo
              </button>
              <button
                type="button"
                onClick={() => updateImage('')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-center bg-white">
            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
            <p className="text-xs text-slate-600 font-medium">
              No image currently assigned
            </p>
            <p className="text-[10px] text-slate-400">
              Choose from Media Assets or upload a new photo.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() =>
              setMediaPickerOpen({
                targetField,
                targetContext: 'modal',
                title: pickerTitle,
              })
            }
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Choose from Media Assets</span>
          </button>

          <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 shadow-2xs">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (!e.target.files || e.target.files.length === 0) return;
                const file = e.target.files[0];
                const form = new FormData();
                form.append('file', file);
                form.append('altText', file.name);
                try {
                  notify(`Uploading ${file.name}...`);
                  const res = await fetch('/api/admin/media/upload', {
                    method: 'POST',
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    body: form,
                  });
                  if (res.ok) {
                    const up = await res.json();
                    const newUrl = up.file?.url || up.url;
                    updateImage(newUrl);
                    notify(`Uploaded & selected ${file.name}`);
                    const mRes = await fetch('/api/admin/media', {
                      headers: getHeaders(),
                    });
                    if (mRes.ok) setMediaList(await mRes.json());
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
            Direct Image URL
          </label>
          <input
            type="text"
            placeholder="e.g. /src/assets/images/... or /uploads/... or https://..."
            value={currentUrl}
            onChange={(e) => updateImage(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-700"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-4">
          {settingsForm.logoUrl ? (
            <img
              src={settingsForm.logoUrl}
              alt="Brand Logo"
              className="h-9 w-auto max-w-[140px] object-contain rounded"
            />
          ) : (
            <div className="w-9 h-9 bg-slate-900 text-white font-bold text-base rounded-lg flex items-center justify-center font-display">
              {settingsForm.companyName ? settingsForm.companyName.slice(0, 2).toUpperCase() : 'EW'}
            </div>
          )}
          <div>
            <div className="font-display text-base font-bold text-slate-900 leading-tight">
              {settingsForm.companyName || 'EquipWorkforce'} Console
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Enterprise Manpower CMS & Requisitions
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800">
                {adminProfile?.name || 'Authorized Administrator'}
              </div>
              <div className="text-[10px] text-emerald-600 font-mono font-semibold uppercase">
                Active Session
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Preview Mode Notice in Admin */}
      <div className="bg-amber-500/10 border-b border-amber-200 px-4 sm:px-8 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span className="font-semibold">Preview Environment:</span>
          <span className="text-slate-700">Production credentials (DATABASE_URL, SMTP_*) are not required for previewing. Demo records are loaded and logo changes update in-session.</span>
        </div>
        <div className="text-[11px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200 shrink-0">
          Preview Mode Active
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 space-y-6 shrink-0">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Operations & Leads
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('manpower')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'manpower' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Manpower Requests</span>
              </div>
              {stats?.newManpowerRequests > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold font-mono">
                  {stats.newManpowerRequests}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'contacts' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4" />
                <span>Contact Inquiries</span>
              </div>
              {stats?.newContactMessages > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold font-mono">
                  {stats.newContactMessages}
                </span>
              )}
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Website Page Panels
            </div>
            <button
              onClick={() => setActiveTab('hero-banner')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'hero-banner' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Hero & First Banner</span>
            </button>

            <button
              onClick={() => setActiveTab('footer')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'footer' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Footer & Legal Info</span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Content Catalog
            </div>
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'services' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Services</span>
            </button>

            <button
              onClick={() => setActiveTab('workforce')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'workforce' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Workforce Trades</span>
            </button>

            <button
              onClick={() => setActiveTab('industries')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'industries' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Industries</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'portfolio' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Case Studies</span>
            </button>

            <button
              onClick={() => setActiveTab('blog')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'blog' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Insights & Blog</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'media' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Media Assets</span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              System Configuration
            </div>
            <button
              onClick={() => setActiveTab('form-options')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'form-options' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Form Dropdowns</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'settings' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Branding & Contacts</span>
            </button>

            <button
              onClick={() => setActiveTab('activity-logs')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'activity-logs' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Activity Audit Logs</span>
            </button>
          </div>
        </aside>

        {/* Content View Canvas */}
        <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900">
                    Operations Dashboard
                  </h1>
                  <p className="text-xs text-slate-500">
                    Real-time metrics from the PostgreSQL Cloud SQL cluster.
                  </p>
                </div>
                <button
                  onClick={loadStats}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Refresh Metrics</span>
                </button>
              </div>

              {/* Stats metric cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Manpower Requisitions
                  </div>
                  <div className="font-display text-3xl font-extrabold text-slate-900 mt-2">
                    {stats?.totalManpowerRequests || 0}
                  </div>
                  <div className="text-[11px] text-blue-600 font-semibold mt-1">
                    {stats?.newManpowerRequests || 0} pending review
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Contact Inquiries
                  </div>
                  <div className="font-display text-3xl font-extrabold text-slate-900 mt-2">
                    {stats?.totalContactMessages || 0}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                    {stats?.newContactMessages || 0} unread messages
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Active Services
                  </div>
                  <div className="font-display text-3xl font-extrabold text-slate-900 mt-2">
                    {stats?.totalServices || 0}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Enterprise solutions</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Articles & Case Studies
                  </div>
                  <div className="font-display text-3xl font-extrabold text-slate-900 mt-2">
                    {(stats?.totalBlogPosts || 0) + (stats?.totalPortfolioProjects || 0)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Published assets</div>
                </div>
              </div>

              {/* Recent Manpower Requisitions table */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-base font-bold text-slate-900">
                    Latest Manpower Requisitions
                  </h2>
                  <button
                    onClick={() => setActiveTab('manpower')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All Requisitions →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px]">
                      <tr>
                        <th className="p-3">Ref ID</th>
                        <th className="p-3">Company</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Headcount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(stats?.recentRequests || []).map((req: any) => (
                        <tr key={req.id} className="hover:bg-slate-50/70">
                          <td className="p-3 font-mono font-bold text-slate-900">{req.requestNumber}</td>
                          <td className="p-3 font-semibold text-slate-800">{req.companyName}</td>
                          <td className="p-3">{req.contactPerson}</td>
                          <td className="p-3">{req.manpowerCategory}</td>
                          <td className="p-3 font-bold text-slate-900">{req.workerCount}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                req.status === 'new'
                                  ? 'bg-blue-100 text-blue-800'
                                  : req.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                setSelectedManpower(req);
                                setActiveTab('manpower');
                              }}
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HERO & HOMEPAGE BANNER */}
          {activeTab === 'hero-banner' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                    <span>Hero & First Banner Editor</span>
                  </h1>
                  <p className="text-xs text-slate-500">
                    Live dynamic controls for the main banner, headline typography, CTA buttons, and key performance proof metrics.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Save Hero Banner</span>
                </button>
              </div>

              {/* Visual Live Preview of Hero Section */}
              <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 relative text-white">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-opacity duration-200"
                  style={{
                    backgroundImage: `url(${
                      settingsForm.heroBannerImage ||
                      '/src/assets/images/hero_workforce_logistics_1790187512878.jpg'
                    })`,
                    opacity: (Number(settingsForm.heroBannerOpacity) || 65) / 100,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/25" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20" />
                <div className="relative p-6 sm:p-10 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-600/30 text-blue-300 border border-blue-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span>{settingsForm.heroKicker || 'ISO 9001:2015 CERTIFIED WORKFORCE MANAGEMENT'}</span>
                  </div>

                  <h2 className="font-sans text-xl sm:text-3xl font-extrabold max-w-2xl leading-tight text-white tracking-tight">
                    {settingsForm.heroTitle || 'Precision Technical Workforce Solutions for Complex Industrial Projects'}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    {settingsForm.heroSubtitle || 'Deploying vetted, safety-certified engineering teams, specialized welders, and heavy industrial craftsmen across the Middle East and worldwide.'}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md">
                      {settingsForm.heroPrimaryCtaText || 'Deploy Manpower'}
                    </div>
                    <div className="px-4 py-2 bg-slate-800/80 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold">
                      {settingsForm.heroSecondaryCtaText || 'Explore Workforce Capabilities'}
                    </div>
                  </div>

                  {/* 4 Stats Preview */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
                    <div className="bg-slate-900/60 backdrop-blur-xs p-2.5 rounded-lg border border-slate-800">
                      <div className="text-base font-extrabold text-blue-400 font-mono">
                        {settingsForm.heroStat1Value || '12,500+'}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {settingsForm.heroStat1Label || 'Mobilized Craftsmen'}
                      </div>
                    </div>
                    <div className="bg-slate-900/60 backdrop-blur-xs p-2.5 rounded-lg border border-slate-800">
                      <div className="text-base font-extrabold text-blue-400 font-mono">
                        {settingsForm.heroStat1Value ? settingsForm.heroStat2Value || '99.4%' : '99.4%'}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {settingsForm.heroStat2Label || 'HSE Compliance Pass'}
                      </div>
                    </div>
                    <div className="bg-slate-900/60 backdrop-blur-xs p-2.5 rounded-lg border border-slate-800">
                      <div className="text-base font-extrabold text-blue-400 font-mono">
                        {settingsForm.heroStat3Value || '48 hrs'}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {settingsForm.heroStat3Label || 'Rapid Mobilization'}
                      </div>
                    </div>
                    <div className="bg-slate-900/60 backdrop-blur-xs p-2.5 rounded-lg border border-slate-800">
                      <div className="text-base font-extrabold text-blue-400 font-mono">
                        {settingsForm.heroStat4Value || '14'}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {settingsForm.heroStat4Label || 'Middle East Hubs'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Headline & Copywriting */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Banner Copy & Headlines
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Main title text and narrative displayed on the first screen.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Kicker Badge Text (Top pill)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroKicker || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroKicker: e.target.value })}
                      placeholder="e.g. ISO 9001:2015 CERTIFIED WORKFORCE MANAGEMENT"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Hero Headline (Title)
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.heroTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                      placeholder="e.g. Precision Technical Workforce Solutions for Complex Industrial Projects"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Hero Subtitle / Narrative
                    </label>
                    <textarea
                      rows={4}
                      value={settingsForm.heroSubtitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                      placeholder="e.g. Deploying vetted, safety-certified engineering teams, specialized welders..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                {/* 2. Banner Background Media */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Hero Background Image
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Full-bleed backdrop photo with dark scrim overlay.
                      </p>
                    </div>
                    {settingsForm.heroBannerImage && (
                      <button
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, heroBannerImage: '' })}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Image</span>
                      </button>
                    )}
                  </div>

                  {/* Thumbnail card */}
                  <div className="relative h-40 bg-slate-900 rounded-lg overflow-hidden border border-slate-200 group flex items-center justify-center">
                    {settingsForm.heroBannerImage ? (
                      <>
                        <img
                          src={settingsForm.heroBannerImage}
                          alt="Hero Banner"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setMediaPickerOpen({
                                targetField: 'heroBannerImage',
                                targetContext: 'settings',
                                title: 'Select Hero Banner Image from Media Assets',
                              })
                            }
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                          >
                            Change Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setSettingsForm({ ...settingsForm, heroBannerImage: '' })}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
                          >
                            Clear
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                        <span className="text-xs text-slate-300 font-medium">No custom banner selected</span>
                        <p className="text-[10px] text-slate-500">Public site will use default industrial backdrop.</p>
                      </div>
                    )}
                  </div>

                  {/* Pick & Upload Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setMediaPickerOpen({
                          targetField: 'heroBannerImage',
                          targetContext: 'settings',
                          title: 'Select Hero Banner Image from Media Assets',
                        })
                      }
                      className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 shadow-2xs"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Choose from Media Assets</span>
                    </button>

                    <label className="cursor-pointer px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 shadow-2xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          if (!e.target.files || e.target.files.length === 0) return;
                          const file = e.target.files[0];
                          const form = new FormData();
                          form.append('file', file);
                          form.append('altText', `Hero Banner ${file.name}`);
                          try {
                            const res = await fetch('/api/admin/media/upload', {
                              method: 'POST',
                              headers: token ? { Authorization: `Bearer ${token}` } : {},
                              body: form,
                            });
                            if (res.ok) {
                              const up = await res.json();
                              setSettingsForm({ ...settingsForm, heroBannerImage: up.url });
                              notify(`Uploaded and set banner image: ${file.name}`);
                              const mRes = await fetch('/api/admin/media', { headers: getHeaders() });
                              if (mRes.ok) setMediaList(await mRes.json());
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                      Direct Image URL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /uploads/... or https://images.unsplash.com/..."
                      value={settingsForm.heroBannerImage || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroBannerImage: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-700"
                    />
                  </div>

                  {/* Banner Photo Opacity Slider & Controls */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-blue-600" />
                        <span>Banner Photo Opacity / Brightness</span>
                      </label>
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                        {settingsForm.heroBannerOpacity ?? 65}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Fine-tune the backdrop brightness. Higher opacity reveals full photographic details; lower opacity creates deep high-contrast backdrop for text.
                    </p>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">10% (Dark)</span>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={settingsForm.heroBannerOpacity ?? 65}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            heroBannerOpacity: Number(e.target.value),
                          })
                        }
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">100% (Vivid)</span>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase mr-1">Presets:</span>
                      {[
                        { label: '35% (Subtle)', value: 35 },
                        { label: '50% (Medium)', value: 50 },
                        { label: '65% (Recommended)', value: 65 },
                        { label: '85% (Bright)', value: 85 },
                        { label: '100% (Vivid)', value: 100 },
                      ].map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() =>
                            setSettingsForm({
                              ...settingsForm,
                              heroBannerOpacity: preset.value,
                            })
                          }
                          className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-colors cursor-pointer border ${
                            (settingsForm.heroBannerOpacity ?? 65) === preset.value
                              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. CTA Buttons Configuration */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Call-To-Action (CTA) Buttons
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Configure button text labels and their destination page paths.
                    </p>
                  </div>

                  <div className="space-y-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                      Primary CTA (Blue Button)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={settingsForm.heroPrimaryCtaText || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroPrimaryCtaText: e.target.value })}
                          placeholder="Deploy Manpower"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                          Target URL Link
                        </label>
                        <input
                          type="text"
                          value={settingsForm.heroPrimaryCtaLink || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroPrimaryCtaLink: e.target.value })}
                          placeholder="/manpower-request"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                      Secondary CTA (Bordered Button)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={settingsForm.heroSecondaryCtaText || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroSecondaryCtaText: e.target.value })}
                          placeholder="Explore Workforce Capabilities"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                          Target URL Link
                        </label>
                        <input
                          type="text"
                          value={settingsForm.heroSecondaryCtaLink || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroSecondaryCtaLink: e.target.value })}
                          placeholder="/workforce"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Key Performance Proof Statistics (4 Counters) */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      4 Key Performance Counters
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Numeric proof points and credentials displayed across the banner counter strip.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Stat 1 */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Stat #1</span>
                      <input
                        type="text"
                        placeholder="Value e.g. 12,500+"
                        value={settingsForm.heroStat1Value || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroStat1Value: e.target.value })}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-blue-600"
                      />
                      <input
                        type="text"
                        placeholder="Label e.g. Mobilized Craftsmen"
                        value={settingsForm.heroStat1Label || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroStat1Label: e.target.value })}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded text-slate-700 font-medium"
                      />
                    </div>

                    {/* Stat 2 */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Stat #2</span>
                      <input
                        type="text"
                        placeholder="Value e.g. 99.4%"
                        value={settingsForm.heroStat2Value || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroStat2Value: e.target.value })}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-blue-600"
                      />
                      <input
                        type="text"
                        placeholder="Label e.g. HSE Compliance Pass"
                        value={settingsForm.heroStat2Label || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroStat2Label: e.target.value })}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded text-slate-700 font-medium"
                      />
                    </div>

                    {/* Stat 3 */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Stat #3</span>
                      <input
                        type="text"
                        placeholder="Value e.g. 48 hrs"
                        value={settingsForm.heroStat3Value || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroStat3Value: e.target.value })}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-blue-600"
                      />
                      <input
                        type="text"
                        placeholder="Label e.g. Rapid Mobilization"
                        value={settingsForm.heroStat3Label || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroStat3Label: e.target.value })}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded text-slate-700 font-medium"
                      />
                    </div>

                    {/* Stat 4 */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Stat #4</span>
                      <input
                        type="text"
                        placeholder="Value e.g. 14"
                        value={settingsForm.heroStat4Value || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroStat4Value: e.target.value })}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono font-bold text-blue-600"
                      />
                      <input
                        type="text"
                        placeholder="Label e.g. Middle East Hubs"
                        value={settingsForm.heroStat4Label || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroStat4Label: e.target.value })}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded text-slate-700 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Save Action */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Save All Hero Banner Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB: FOOTER & LEGAL CONFIGURATION */}
          {activeTab === 'footer' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-6 h-6 text-blue-600" />
                    <span>Footer & Navigation Configuration</span>
                  </h1>
                  <p className="text-xs text-slate-500">
                    Live editable parameters for the global website footer, corporate bio, ISO badges, column headers, and legal notice.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Save Footer Configuration</span>
                </button>
              </div>

              {/* Visual Preview of Footer */}
              <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs border-b border-slate-800/80 pb-6">
                  {/* Col 1 */}
                  <div className="space-y-3 md:col-span-1">
                    <div className="flex items-center gap-2">
                      {settingsForm.footerLogoUrl || settingsForm.logoUrl ? (
                        <img
                          src={settingsForm.footerLogoUrl || settingsForm.logoUrl}
                          alt="Logo"
                          className="h-8 max-w-[140px] object-contain"
                        />
                      ) : (
                        <div className="font-bold text-sm tracking-wide text-white">
                          {settingsForm.companyName || 'EquipWorkforce Global'}
                        </div>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {settingsForm.footerBio ||
                        'EquipWorkforce is an international workforce mobility and technical staffing provider.'}
                    </p>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded text-[10px] text-blue-300 font-medium">
                      {settingsForm.footerComplianceBadges ||
                        'ISO 9001:2015 & ISO 45001 Certified · Zero-Harm HSE Standards'}
                    </div>
                  </div>

                  {/* Col 2 */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      {settingsForm.footerQuickLinksTitle || 'Workforce Solutions'}
                    </span>
                    <ul className="text-slate-400 text-[11px] space-y-1">
                      <li>Technical Staffing & Manpower</li>
                      <li>Shutdown & Turnaround Teams</li>
                      <li>Global Mobility & Compliance</li>
                    </ul>
                  </div>

                  {/* Col 3 */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      {settingsForm.footerIndustriesTitle || 'Industries Served'}
                    </span>
                    <ul className="text-slate-400 text-[11px] space-y-1">
                      <li>Oil, Gas & Petrochemicals</li>
                      <li>Renewable & Nuclear Power</li>
                      <li>Heavy EPC Civil Infrastructure</li>
                    </ul>
                  </div>

                  {/* Col 4 */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      {settingsForm.footerContactTitle || 'Operational Contacts'}
                    </span>
                    <ul className="text-slate-400 text-[11px] space-y-1">
                      <li>{settingsForm.primaryPhone || '+974 4499 8800'}</li>
                      <li>{settingsForm.primaryEmail || 'operations@equipworkforce.com'}</li>
                      <li>{settingsForm.headquartersAddress || 'West Bay Financial District, Doha, Qatar'}</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div>
                    &copy; {new Date().getFullYear()}{' '}
                    {settingsForm.footerCopyrightText ||
                      'EquipWorkforce Global Mobility LLC. All rights reserved.'}
                  </div>
                  <div className="text-slate-400 flex items-center gap-3">
                    <span>Privacy Policy</span>
                    <span>·</span>
                    <span>Terms of Engagement</span>
                    <span>·</span>
                    <span>HSE Manual</span>
                  </div>
                </div>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Corporate Narrative & Badges */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Narrative & Accreditations
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Corporate summary and quality standards displayed in the left footer column.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Company Bio / Mission Statement
                    </label>
                    <textarea
                      rows={4}
                      value={settingsForm.footerBio || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerBio: e.target.value })}
                      placeholder="e.g. EquipWorkforce is an international workforce mobility and technical staffing provider..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Compliance Badges & Accreditation Text
                    </label>
                    <input
                      type="text"
                      value={settingsForm.footerComplianceBadges || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerComplianceBadges: e.target.value })}
                      placeholder="e.g. ISO 9001:2015 & ISO 45001 Certified · Zero-Harm HSE Standards"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                {/* 2. Column Titles */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Column Navigation Headers
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Labels for the 3 navigation link columns.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Column 2 Title (Workforce links)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.footerQuickLinksTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerQuickLinksTitle: e.target.value })}
                      placeholder="Workforce Solutions"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Column 3 Title (Industries links)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.footerIndustriesTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerIndustriesTitle: e.target.value })}
                      placeholder="Industries Served"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Column 4 Title (Contacts & HQ)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.footerContactTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerContactTitle: e.target.value })}
                      placeholder="Operational Contacts"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium"
                    />
                  </div>
                </div>

                {/* 3. Legal & Copyright Notice */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Copyright & Legal Notice
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Bottom legal line printed alongside current calendar year.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Copyright Statement
                    </label>
                    <input
                      type="text"
                      value={settingsForm.footerCopyrightText || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, footerCopyrightText: e.target.value })}
                      placeholder="EquipWorkforce Global Mobility LLC. All rights reserved."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      The year &copy; {new Date().getFullYear()} is prepended automatically.
                    </p>
                  </div>
                </div>

                {/* 4. Social Media Channels */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Social Channels & Networks
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      External profile links connected to footer social icons.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="text"
                        value={settingsForm.socialLinkedin || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, socialLinkedin: e.target.value })}
                        placeholder="https://linkedin.com/company/..."
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                        Facebook URL
                      </label>
                      <input
                        type="text"
                        value={settingsForm.socialFacebook || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, socialFacebook: e.target.value })}
                        placeholder="https://facebook.com/..."
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                        Instagram URL
                      </label>
                      <input
                        type="text"
                        value={settingsForm.socialInstagram || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, socialInstagram: e.target.value })}
                        placeholder="https://instagram.com/..."
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
                        YouTube Channel URL
                      </label>
                      <input
                        type="text"
                        value={settingsForm.socialYoutube || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, socialYoutube: e.target.value })}
                        placeholder="https://youtube.com/@..."
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Save Action */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Save Footer Configuration</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB: MANPOWER REQUESTS */}
          {activeTab === 'manpower' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900">
                    Manpower Requisitions Management
                  </h1>
                  <p className="text-xs text-slate-500">
                    Manage client requisition dossiers, inspect logistics requirements, and advance status.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search company or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-1.5 px-3 text-xs bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="contacted">Contacted</option>
                    <option value="quotation_sent">Quotation Sent</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Ref No</th>
                        <th className="p-3.5">Company & Contact</th>
                        <th className="p-3.5">Discipline & Headcount</th>
                        <th className="p-3.5">Duration</th>
                        <th className="p-3.5">Logistics Required</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {manpowerList
                        .filter((m) => {
                          const matchesSearch =
                            m.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.manpowerCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.requestNumber?.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
                          return matchesSearch && matchesStatus;
                        })
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80">
                            <td className="p-3.5 font-mono font-bold text-slate-900">
                              {item.requestNumber}
                            </td>
                            <td className="p-3.5">
                              <div className="font-semibold text-slate-900">{item.companyName}</div>
                              <div className="text-[11px] text-slate-500">
                                {item.contactPerson} ({item.email})
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-slate-800">{item.manpowerCategory}</div>
                              <div className="text-[11px] text-blue-600 font-bold">
                                {item.workerCount} Operatives
                              </div>
                            </td>
                            <td className="p-3.5">{item.duration || 'N/A'}</td>
                            <td className="p-3.5">
                              <div className="flex gap-1">
                                {item.reqAccommodation && (
                                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">Camp</span>
                                )}
                                {item.reqTransport && (
                                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">Transit</span>
                                )}
                                {item.reqFood && (
                                  <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">Meals</span>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <select
                                value={item.status}
                                onChange={(e) => updateManpowerStatus(item.id, e.target.value)}
                                className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold"
                              >
                                <option value="new">New</option>
                                <option value="reviewing">Reviewing</option>
                                <option value="contacted">Contacted</option>
                                <option value="quotation_sent">Quotation Sent</option>
                                <option value="approved">Approved</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => setSelectedManpower(item)}
                                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                                title="Inspect Full Dossier"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteManpower(item.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                title="Delete Requisition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Dossier Modal */}
              {selectedManpower && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div>
                        <div className="text-xs font-mono font-bold text-blue-600">
                          {selectedManpower.requestNumber}
                        </div>
                        <h2 className="font-display text-xl font-bold text-slate-900">
                          {selectedManpower.companyName}
                        </h2>
                      </div>
                      <button
                        onClick={() => setSelectedManpower(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">Contact Officer:</span>
                        <div className="font-semibold text-slate-900">{selectedManpower.contactPerson}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Email:</span>
                        <div className="font-semibold text-slate-900">{selectedManpower.email}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Phone:</span>
                        <div className="font-semibold text-slate-900">{selectedManpower.phone}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Location:</span>
                        <div className="font-semibold text-slate-900">
                          {selectedManpower.city ? `${selectedManpower.city}, ` : ''}{selectedManpower.country}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                        Workforce Specifications
                      </div>
                      <div><strong>Trade Category:</strong> {selectedManpower.manpowerCategory}</div>
                      <div><strong>Headcount Required:</strong> {selectedManpower.workerCount} Specialists</div>
                      <div><strong>Start Date:</strong> {selectedManpower.startDate || 'Immediate'}</div>
                      <div><strong>Duration:</strong> {selectedManpower.duration || 'Not specified'}</div>
                      <div><strong>Credentials / Skills:</strong> {selectedManpower.skills || 'Standard Trade Tested'}</div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                        Contractor Notes & Scope Details
                      </div>
                      <p className="p-3 bg-white border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
                        {selectedManpower.otherReqs || 'No additional custom notes provided.'}
                      </p>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedManpower(null)}
                        className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                      >
                        Close Dossier
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CONTACT INQUIRIES */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900">
                    Contact Form Submissions
                  </h1>
                  <p className="text-xs text-slate-500">
                    Direct communications sent from the public contact page.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Ref ID</th>
                        <th className="p-3.5">Sender</th>
                        <th className="p-3.5">Inquiry Type</th>
                        <th className="p-3.5">Subject & Message</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {contacts.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/80">
                          <td className="p-3.5 font-mono font-bold text-slate-900">{c.submissionId}</td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">{c.name}</div>
                            <div className="text-[11px] text-slate-500">{c.email}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                              {c.inquiryType}
                            </span>
                          </td>
                          <td className="p-3.5 max-w-sm">
                            <div className="font-medium text-slate-900">{c.subject}</div>
                            <p className="text-[11px] text-slate-500 truncate">{c.message}</p>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={c.status}
                              onChange={(e) => updateContactStatus(c.id, e.target.value)}
                              className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold"
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => deleteContact(c.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900">
                    Services Management
                  </h1>
                  <p className="text-xs text-slate-500">
                    Add, edit, or re-order technical workforce capabilities.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditItemModal({
                      type: 'service',
                      item: {
                        title: '',
                        slug: '',
                        shortDesc: '',
                        fullDesc: '',
                        featuredImage: '/src/assets/images/service_industrial_construction_1790187524192.jpg',
                        icon: 'HardHat',
                        benefits: ['100% certified trade tested'],
                        industries: ['Heavy Infrastructure'],
                        isPublished: true,
                        isFeatured: true,
                        displayOrder: servicesList.length + 1,
                      },
                    })
                  }
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {servicesList.map((s) => (
                  <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-slate-400">/{s.slug}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {s.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-900">{s.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{s.shortDesc}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditItemModal({ type: 'service', item: s })}
                        className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteEntity('service', s.id)}
                        className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: WORKFORCE */}
          {activeTab === 'workforce' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900">
                    Workforce Trade Categories
                  </h1>
                  <p className="text-xs text-slate-500">
                    Manage certified candidate disciplines, skills profiles, and experience criteria.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditItemModal({
                      type: 'workforce',
                      item: {
                        title: '',
                        slug: '',
                        description: '',
                        image: '/src/assets/images/service_technical_logistics_1790187537100.jpg',
                        skills: ['Trade Certification'],
                        experienceInfo: 'Minimum 5 years verified experience.',
                        isFeatured: true,
                        displayOrder: workforceList.length + 1,
                      },
                    })
                  }
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Trade Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {workforceList.map((w) => (
                  <div key={w.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-display text-lg font-bold text-slate-900">{w.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{w.description}</p>
                      {w.experienceInfo && (
                        <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded">
                          {w.experienceInfo}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditItemModal({ type: 'workforce', item: w })}
                        className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteEntity('workforce', w.id)}
                        className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: INDUSTRIES */}
          {activeTab === 'industries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900">
                    Industry Verticals & Sectors
                  </h1>
                  <p className="text-xs text-slate-500">
                    Manage key industrial sectors, client market segments, and track record deployment metrics.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditItemModal({
                      type: 'industry',
                      item: {
                        title: '',
                        slug: '',
                        description: '',
                        image: '/src/assets/images/service_heavy_civils_1790187524948.jpg',
                        icon: 'Building2',
                        stats: '5,000+ Workers Mobilized',
                        displayOrder: industriesList.length + 1,
                      },
                    })
                  }
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Industry Sector</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {industriesList.map((ind) => (
                  <div
                    key={ind.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      {ind.image && (
                        <div className="h-40 w-full overflow-hidden bg-slate-100 relative">
                          <img
                            src={ind.image}
                            alt={ind.title}
                            className="w-full h-full object-cover"
                          />
                          {ind.stats && (
                            <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                              {ind.stats}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-slate-400">/{ind.slug}</span>
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            Order: {ind.displayOrder ?? 0}
                          </span>
                        </div>
                        <h3 className="font-display text-base font-bold text-slate-900">
                          {ind.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {ind.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditItemModal({ type: 'industry', item: ind })}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteEntity('industry', ind.id)}
                        className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CASE STUDIES (PORTFOLIO) */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900">
                    Case Studies & Project Deployments
                  </h1>
                  <p className="text-xs text-slate-500">
                    Showcase landmark technical workforce missions, EPC plant shut-downs, and infrastructure contracts.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditItemModal({
                      type: 'portfolio',
                      item: {
                        title: '',
                        slug: '',
                        client: '',
                        industry: 'Oil, Gas & Petrochemicals',
                        location: '',
                        year: new Date().getFullYear().toString(),
                        status: 'Ongoing',
                        description: '',
                        featuredImage: '/src/assets/images/hero_workforce_logistics_1790187512878.jpg',
                        servicesProvided: ['Technical Manpower Supply', 'Certified Welders'],
                        workforceCategories: ['Certified Technicians', 'Rigging Crew'],
                        isFeatured: true,
                        seoTitle: '',
                        seoDesc: '',
                      },
                    })
                  }
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Case Study</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by title, client, location, or industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
                  {['all', 'Completed', 'Ongoing', 'Mobilization Phase'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setPortfolioStatusFilter(status)}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                        portfolioStatusFilter === status
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {status === 'all' ? 'All Projects' : status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Case Studies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioList
                  .filter((p) => {
                    const matchSearch =
                      !searchTerm ||
                      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      p.industry?.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchStatus =
                      portfolioStatusFilter === 'all' || p.status === portfolioStatusFilter;
                    return matchSearch && matchStatus;
                  })
                  .map((p) => {
                    let parsedServices: string[] = [];
                    if (Array.isArray(p.servicesProvided)) parsedServices = p.servicesProvided;
                    else if (typeof p.servicesProvided === 'string') {
                      try {
                        parsedServices = JSON.parse(p.servicesProvided);
                      } catch {
                        parsedServices = p.servicesProvided.split(',').map((s: string) => s.trim());
                      }
                    }

                    return (
                      <div
                        key={p.id}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div>
                          {p.featuredImage && (
                            <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                              <img
                                src={p.featuredImage}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
                                    p.status === 'Completed'
                                      ? 'bg-emerald-600 text-white'
                                      : p.status === 'Ongoing'
                                      ? 'bg-amber-600 text-white'
                                      : 'bg-blue-600 text-white'
                                  }`}
                                >
                                  {p.status || 'Active'}
                                </span>
                              </div>
                              {p.isFeatured && (
                                <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  <span>Featured</span>
                                </span>
                              )}
                            </div>
                          )}

                          <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span className="font-semibold text-blue-600">{p.industry}</span>
                              {p.year && <span>{p.year}</span>}
                            </div>

                            <h3 className="font-display text-base font-bold text-slate-900 leading-snug">
                              {p.title}
                            </h3>

                            {p.client && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{p.client}</span>
                              </div>
                            )}

                            {p.location && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{p.location}</span>
                              </div>
                            )}

                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                              {p.description}
                            </p>

                            {parsedServices.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {parsedServices.slice(0, 3).map((s, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                                  >
                                    {s}
                                  </span>
                                ))}
                                {parsedServices.length > 3 && (
                                  <span className="text-[10px] text-slate-400 self-center">
                                    +{parsedServices.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                          <a
                            href={`/portfolio/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Preview</span>
                          </a>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditItemModal({ type: 'portfolio', item: p })}
                              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1 shadow-2xs"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => deleteEntity('portfolio', p.id)}
                              className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB: INSIGHTS & BLOGS */}
          {activeTab === 'blog' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900">
                    Insights & Technical Blog
                  </h1>
                  <p className="text-xs text-slate-500">
                    Manage thought leadership, HSE compliance digests, global mobilization briefings, and industry trade updates.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditItemModal({
                      type: 'blog',
                      item: {
                        title: '',
                        slug: '',
                        category: 'Workforce Insights',
                        author: adminProfile?.name || 'EquipWorkforce Editorial',
                        excerpt: '',
                        content: '',
                        featuredImage: '/src/assets/images/about_global_workforce_1790187561296.jpg',
                        tags: ['Workforce Management', 'Global Mobility', 'Compliance'],
                        status: 'published',
                        isFeatured: true,
                        seoTitle: '',
                        seoDesc: '',
                      },
                    })
                  }
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Article</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="relative w-full sm:w-80">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search articles by title, category, or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Category:</span>
                  {['all', 'Workforce Insights', 'Global Mobility', 'Compliance', 'Safety'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setBlogCategoryFilter(cat)}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                        blogCategoryFilter === cat
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'all' ? 'All Categories' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogList
                  .filter((b) => {
                    const matchSearch =
                      !searchTerm ||
                      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      b.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      b.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      b.author?.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchCat =
                      blogCategoryFilter === 'all' ||
                      b.category?.toLowerCase().includes(blogCategoryFilter.toLowerCase());
                    return matchSearch && matchCat;
                  })
                  .map((b) => {
                    let parsedTags: string[] = [];
                    if (Array.isArray(b.tags)) parsedTags = b.tags;
                    else if (typeof b.tags === 'string') {
                      try {
                        parsedTags = JSON.parse(b.tags);
                      } catch {
                        parsedTags = b.tags.split(',').map((t: string) => t.trim());
                      }
                    }

                    return (
                      <div
                        key={b.id}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div>
                          {b.featuredImage && (
                            <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                              <img
                                src={b.featuredImage}
                                alt={b.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${
                                    b.status === 'published'
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-600 text-white'
                                  }`}
                                >
                                  {b.status === 'published' ? 'Published' : 'Draft'}
                                </span>
                              </div>
                              {b.isFeatured && (
                                <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  <span>Featured</span>
                                </span>
                              )}
                            </div>
                          )}

                          <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span className="font-semibold text-blue-600">{b.category}</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>
                                  {b.createdAt
                                    ? new Date(b.createdAt).toLocaleDateString()
                                    : 'Recent'}
                                </span>
                              </div>
                            </div>

                            <h3 className="font-display text-base font-bold text-slate-900 leading-snug">
                              {b.title}
                            </h3>

                            {b.author && (
                              <div className="text-[11px] text-slate-500">
                                By <span className="font-medium text-slate-700">{b.author}</span>
                              </div>
                            )}

                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                              {b.excerpt || b.content?.slice(0, 150)}
                            </p>

                            {parsedTags.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {parsedTags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded flex items-center gap-0.5"
                                  >
                                    <Tag className="w-2.5 h-2.5 text-slate-400" />
                                    <span>{tag}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                          <a
                            href={`/blog/${b.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Preview</span>
                          </a>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditItemModal({ type: 'blog', item: b })}
                              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1 shadow-2xs"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => deleteEntity('blog', b.id)}
                              className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB: FORM DROPDOWNS CONFIGURATION */}
          {activeTab === 'form-options' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900">
                    Form Dropdown Options
                  </h1>
                  <p className="text-xs text-slate-500">
                    Configure choices rendered in public forms: Contact Us inquiries, Contract Durations, Experience requirements, Contact methods, and Workforce Tiers.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditItemModal({
                      type: 'form-option',
                      item: {
                        formType: formGroupFilter !== 'all' ? formGroupFilter : 'contact_inquiry',
                        fieldName:
                          formGroupFilter === 'duration'
                            ? 'duration'
                            : formGroupFilter === 'experience'
                            ? 'experience'
                            : formGroupFilter === 'contact_method'
                            ? 'contact_method'
                            : formGroupFilter === 'tier'
                            ? 'tier'
                            : 'inquiry_type',
                        label: '',
                        value: '',
                        displayOrder: formOptionsList.length + 1,
                        isActive: true,
                      },
                    })
                  }
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Dropdown Option</span>
                </button>
              </div>

              {/* Filter Tabs by Form Field Type */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {[
                    { key: 'all', label: 'All Options' },
                    { key: 'inquiry_type', label: 'Inquiry Types' },
                    { key: 'duration', label: 'Contract Durations' },
                    { key: 'experience', label: 'Experience Levels' },
                    { key: 'contact_method', label: 'Contact Methods' },
                    { key: 'tier', label: 'Workforce Tiers' },
                  ].map((tab) => {
                    const count =
                      tab.key === 'all'
                        ? formOptionsList.length
                        : formOptionsList.filter(
                            (o) =>
                              o.fieldName === tab.key ||
                              o.formType === tab.key ||
                              (tab.key === 'inquiry_type' && o.formType === 'contact_inquiry') ||
                              (tab.key === 'contact_method' && o.formType === 'preferred_contact') ||
                              (tab.key === 'tier' && o.formType === 'workforce_tier')
                          ).length;

                    return (
                      <button
                        key={tab.key}
                        onClick={() => setFormGroupFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                          formGroupFilter === tab.key
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            formGroupFilter === tab.key
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter by label or value..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Form Options Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3.5">Target Field / Group</th>
                        <th className="px-5 py-3.5">Display Label (User Sees)</th>
                        <th className="px-5 py-3.5 font-mono">Submitted Value</th>
                        <th className="px-5 py-3.5 text-center">Display Order</th>
                        <th className="px-5 py-3.5 text-center">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formOptionsList
                        .filter((opt) => {
                          const matchesFilter =
                            formGroupFilter === 'all' ||
                            opt.fieldName === formGroupFilter ||
                            opt.formType === formGroupFilter ||
                            (formGroupFilter === 'inquiry_type' && opt.formType === 'contact_inquiry') ||
                            (formGroupFilter === 'contact_method' && opt.formType === 'preferred_contact') ||
                            (formGroupFilter === 'tier' && opt.formType === 'workforce_tier');

                          const matchesSearch =
                            !searchTerm ||
                            opt.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            opt.value?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            opt.fieldName?.toLowerCase().includes(searchTerm.toLowerCase());

                          return matchesFilter && matchesSearch;
                        })
                        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                        .map((opt) => (
                          <tr key={opt.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-5 py-3.5">
                              <span className="font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                {opt.fieldName || opt.formType}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="font-semibold text-slate-900 text-xs">
                                {opt.label}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">
                              {opt.value}
                            </td>
                            <td className="px-5 py-3.5 text-center font-mono font-medium text-slate-700">
                              {opt.displayOrder ?? 1}
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <button
                                onClick={() => toggleFormOption(opt)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                                  opt.isActive
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                {opt.isActive ? (
                                  <>
                                    <ToggleRight className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Inactive</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditItemModal({ type: 'form-option', item: opt })}
                                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => deleteEntity('form-option', opt.id)}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                  title="Delete option"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MEDIA ASSETS */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900">
                    Media Assets Library
                  </h1>
                  <p className="text-xs text-slate-500">
                    Corporate visual identity logos, trade photography, case study galleries, and uploaded files.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Asset</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Category Filter and Search Toolbar */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {[
                    { key: 'all', label: 'All Assets' },
                    { key: 'branding', label: 'Logos & Identity' },
                    { key: 'service', label: 'Services & Trades' },
                    { key: 'case_study', label: 'Case Studies' },
                    { key: 'uploads', label: 'Custom Uploads' },
                  ].map((tab) => {
                    const count =
                      tab.key === 'all'
                        ? mediaList.length
                        : mediaList.filter((m) => {
                            if (tab.key === 'branding') {
                              return (
                                m.category === 'branding' ||
                                m.filename?.toLowerCase().includes('logo') ||
                                m.originalName?.toLowerCase().includes('logo') ||
                                m.url === settingsForm.logoUrl ||
                                m.url === settingsForm.footerLogoUrl
                              );
                            }
                            if (tab.key === 'service') {
                              return (
                                m.category === 'service' ||
                                m.category === 'workforce' ||
                                m.filename?.toLowerCase().includes('service') ||
                                m.filename?.toLowerCase().includes('workforce')
                              );
                            }
                            if (tab.key === 'case_study') {
                              return (
                                m.category === 'case_study' ||
                                m.category === 'portfolio' ||
                                m.filename?.toLowerCase().includes('hero')
                              );
                            }
                            return m.category === 'upload';
                          }).length;

                    return (
                      <button
                        key={tab.key}
                        onClick={() => setMediaCategoryFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                          mediaCategoryFilter === tab.key
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            mediaCategoryFilter === tab.key
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by title or filename..."
                    value={mediaSearchTerm}
                    onChange={(e) => setMediaSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Media Grid */}
              {mediaList.filter((m) => {
                const matchesSearch =
                  !mediaSearchTerm ||
                  m.originalName?.toLowerCase().includes(mediaSearchTerm.toLowerCase()) ||
                  m.filename?.toLowerCase().includes(mediaSearchTerm.toLowerCase());

                if (!matchesSearch) return false;

                if (mediaCategoryFilter === 'branding') {
                  return (
                    m.category === 'branding' ||
                    m.filename?.toLowerCase().includes('logo') ||
                    m.originalName?.toLowerCase().includes('logo') ||
                    m.url === settingsForm.logoUrl ||
                    m.url === settingsForm.footerLogoUrl
                  );
                }
                if (mediaCategoryFilter === 'service') {
                  return (
                    m.category === 'service' ||
                    m.category === 'workforce' ||
                    m.filename?.toLowerCase().includes('service') ||
                    m.filename?.toLowerCase().includes('workforce')
                  );
                }
                if (mediaCategoryFilter === 'case_study') {
                  return (
                    m.category === 'case_study' ||
                    m.category === 'portfolio' ||
                    m.filename?.toLowerCase().includes('hero')
                  );
                }
                if (mediaCategoryFilter === 'uploads') {
                  return m.category === 'upload';
                }
                return true;
              }).length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-200 rounded-xl">
                  <ImageIcon className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No media assets in this view</p>
                  <p className="text-xs text-slate-400 mt-1">Upload a photo or document above to populate this catalog.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mediaList
                    .filter((m) => {
                      const matchesSearch =
                        !mediaSearchTerm ||
                        m.originalName?.toLowerCase().includes(mediaSearchTerm.toLowerCase()) ||
                        m.filename?.toLowerCase().includes(mediaSearchTerm.toLowerCase());

                      if (!matchesSearch) return false;

                      if (mediaCategoryFilter === 'branding') {
                        return (
                          m.category === 'branding' ||
                          m.filename?.toLowerCase().includes('logo') ||
                          m.originalName?.toLowerCase().includes('logo') ||
                          m.url === settingsForm.logoUrl ||
                          m.url === settingsForm.footerLogoUrl
                        );
                      }
                      if (mediaCategoryFilter === 'service') {
                        return (
                          m.category === 'service' ||
                          m.category === 'workforce' ||
                          m.filename?.toLowerCase().includes('service') ||
                          m.filename?.toLowerCase().includes('workforce')
                        );
                      }
                      if (mediaCategoryFilter === 'case_study') {
                        return (
                          m.category === 'case_study' ||
                          m.category === 'portfolio' ||
                          m.filename?.toLowerCase().includes('hero')
                        );
                      }
                      if (mediaCategoryFilter === 'uploads') {
                        return m.category === 'upload';
                      }
                      return true;
                    })
                    .map((m) => {
                      const isLogo = m.url === settingsForm.logoUrl;
                      const isHero = m.url === settingsForm.heroBannerImage;
                      const isFooterLogo = m.url === settingsForm.footerLogoUrl;
                      const isFavicon = m.url === settingsForm.faviconUrl;
                      const isDarkLogo = m.url === settingsForm.darkLogoUrl;
                      const isBranding =
                        m.category === 'branding' ||
                        m.filename?.toLowerCase().includes('logo') ||
                        m.originalName?.toLowerCase().includes('logo') ||
                        m.mimeType === 'image/svg+xml';

                      return (
                        <div
                          key={m.id}
                          className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
                        >
                          <div>
                            {/* Image Preview Container with Badges and Delete Action */}
                            <div
                              className={`h-44 relative overflow-hidden flex items-center justify-center ${
                                isBranding ? 'bg-slate-50 p-4' : 'bg-slate-100'
                              }`}
                            >
                              {m.mimeType?.startsWith('image') ? (
                                <img
                                  src={m.url}
                                  alt={m.originalName || 'Media asset'}
                                  className={`w-full h-full ${
                                    isBranding ? 'object-contain' : 'object-cover group-hover:scale-105'
                                  } transition-transform duration-300`}
                                  onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = '/uploads/company_logo_primary.svg';
                                  }}
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center gap-1 font-mono text-xs text-slate-500">
                                  <FileText className="w-8 h-8 text-slate-400" />
                                  <span>Document (PDF)</span>
                                </div>
                              )}

                              {/* Top Badges for Active Roles */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                {isLogo && (
                                  <span className="px-2 py-0.5 bg-blue-600/95 text-white text-[10px] font-bold rounded-md shadow-xs backdrop-blur-xs">
                                    Primary Logo
                                  </span>
                                )}
                                {isDarkLogo && (
                                  <span className="px-2 py-0.5 bg-indigo-600/95 text-white text-[10px] font-bold rounded-md shadow-xs backdrop-blur-xs">
                                    Dark Logo
                                  </span>
                                )}
                                {isHero && (
                                  <span className="px-2 py-0.5 bg-amber-600/95 text-white text-[10px] font-bold rounded-md shadow-xs backdrop-blur-xs">
                                    Hero Banner
                                  </span>
                                )}
                                {isFooterLogo && (
                                  <span className="px-2 py-0.5 bg-slate-900/95 text-white text-[10px] font-bold rounded-md shadow-xs backdrop-blur-xs">
                                    Footer Logo
                                  </span>
                                )}
                                {isFavicon && (
                                  <span className="px-2 py-0.5 bg-emerald-600/95 text-white text-[10px] font-bold rounded-md shadow-xs backdrop-blur-xs">
                                    Favicon
                                  </span>
                                )}
                              </div>

                              {/* Quick Delete Overlay Button on Top Right */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMedia(m);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer z-10"
                                title="Permanently Delete Image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* File Meta */}
                            <div className="p-3.5 space-y-1.5">
                              <div
                                className="text-xs font-semibold text-slate-900 truncate"
                                title={m.originalName || m.filename}
                              >
                                {m.originalName || m.filename}
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                                <span>{(m.size / 1024).toFixed(1)} KB</span>
                                <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {m.filename?.split('.').pop() || 'IMG'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Bar */}
                          <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                            {/* Copy URL & Direct Delete */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(m.url);
                                  notify('Image URL copied to clipboard!');
                                }}
                                className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                title="Copy file URL"
                              >
                                <Copy className="w-3 h-3 text-slate-500" />
                                <span>Copy URL</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteMedia(m)}
                                className="py-1.5 px-2.5 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                title="Delete this asset permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                <span>Delete</span>
                              </button>
                            </div>

                            {/* Assign as Role buttons for images */}
                            {m.mimeType?.startsWith('image') && (
                              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-200/60">
                                <button
                                  type="button"
                                  onClick={() => handleSetAsLogo(m.url, 'logoUrl')}
                                  className={`py-1 px-1 text-[10px] font-semibold rounded-md border text-center transition-colors cursor-pointer truncate ${
                                    isLogo
                                      ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                  title="Set as Primary Header Logo"
                                >
                                  {isLogo ? '✓ Logo' : 'Set Logo'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetAsLogo(m.url, 'footerLogoUrl')}
                                  className={`py-1 px-1 text-[10px] font-semibold rounded-md border text-center transition-colors cursor-pointer truncate ${
                                    isFooterLogo
                                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                  title="Set as Footer Logo"
                                >
                                  {isFooterLogo ? '✓ Footer' : 'Set Footer'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetAsLogo(m.url, 'heroBannerImage')}
                                  className={`py-1 px-1 text-[10px] font-semibold rounded-md border text-center transition-colors cursor-pointer truncate ${
                                    isHero
                                      ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                  title="Set as Homepage Hero Banner"
                                >
                                  {isHero ? '✓ Hero' : 'Set Hero'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900">
                  Global Branding & Corporate Contacts
                </h1>
                <p className="text-xs text-slate-500">
                  Dynamic settings populated immediately across website headers, footers, and WhatsApp buttons.
                </p>
              </div>

              {/* Brand Logo & Visual Assets */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Brand Logo & Visual Identity
                      </h2>
                      <p className="text-xs text-slate-500">
                        Upload or choose an image from Media Assets. Changes reflect instantly across public navigation, footer, and browser tabs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 1. Main Website Logo (Header) */}
                  <div className="space-y-3 p-4 bg-slate-50/70 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                        <span>Primary Header Logo</span>
                        <span className="px-1.5 py-0.5 text-[9px] bg-blue-100 text-blue-700 rounded font-semibold">
                          Active Navbar
                        </span>
                      </label>
                      {settingsForm.logoUrl && (
                        <button
                          type="button"
                          onClick={() => handleSetAsLogo('', 'logoUrl')}
                          className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold"
                        >
                          Remove Logo
                        </button>
                      )}
                    </div>

                    {/* Preview Box */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col items-center justify-center min-h-[90px] text-center">
                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          Light Mode Preview
                        </span>
                        {settingsForm.logoUrl ? (
                          <img
                            src={settingsForm.logoUrl}
                            alt="Logo Preview"
                            className="max-h-12 max-w-full object-contain"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <div className="w-8 h-8 rounded bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                              {settingsForm.companyName ? settingsForm.companyName.slice(0, 2).toUpperCase() : 'EW'}
                            </div>
                            <span className="text-[11px] font-medium text-slate-500">Text & Badge Fallback</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-center min-h-[90px] text-center">
                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          Dark Contrast Preview
                        </span>
                        {settingsForm.logoUrl ? (
                          <img
                            src={settingsForm.logoUrl}
                            alt="Logo Dark Preview"
                            className="max-h-12 max-w-full object-contain"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <div className="w-8 h-8 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                              {settingsForm.companyName ? settingsForm.companyName.slice(0, 2).toUpperCase() : 'EW'}
                            </div>
                            <span className="text-[11px] font-medium text-slate-400">Badge Fallback</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Logo</span>
                        <input
                          type="file"
                          accept="image/*,image/svg+xml"
                          onChange={(e) => handleLogoUpload(e, 'logoUrl')}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setMediaPickerOpen({
                            targetField: 'logoUrl',
                            title: 'Select Header Logo from Media Assets',
                          });
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>Choose from Media</span>
                      </button>
                    </div>

                    {/* URL Input */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                        Logo Asset URL
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. /uploads/my-logo.png or https://..."
                        value={settingsForm.logoUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* 2. Footer Logo (Dark Theme) */}
                  <div className="space-y-3 p-4 bg-slate-50/70 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                        <span>Dark / Footer Logo (Optional)</span>
                        <span className="px-1.5 py-0.5 text-[9px] bg-slate-200 text-slate-700 rounded font-semibold">
                          Dark Footer
                        </span>
                      </label>
                      {settingsForm.footerLogoUrl && (
                        <button
                          type="button"
                          onClick={() => handleSetAsLogo('', 'footerLogoUrl')}
                          className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Preview Box */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-center min-h-[90px] text-center">
                      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Footer Contrast Preview
                      </span>
                      {settingsForm.footerLogoUrl || settingsForm.logoUrl ? (
                        <img
                          src={settingsForm.footerLogoUrl || settingsForm.logoUrl}
                          alt="Footer Logo Preview"
                          className="max-h-12 max-w-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <div className="w-8 h-8 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                            {settingsForm.companyName ? settingsForm.companyName.slice(0, 2).toUpperCase() : 'EW'}
                          </div>
                          <span className="text-[11px] font-medium text-slate-400">Uses Primary Logo / Badge</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Footer Logo</span>
                        <input
                          type="file"
                          accept="image/*,image/svg+xml"
                          onChange={(e) => handleLogoUpload(e, 'footerLogoUrl')}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setMediaPickerOpen({
                            targetField: 'footerLogoUrl',
                            title: 'Select Footer Logo from Media Assets',
                          });
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                        <span>Choose from Media</span>
                      </button>
                    </div>

                    {/* URL Input */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                        Footer Logo URL
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. /uploads/white-logo.svg (defaults to main logo)"
                        value={settingsForm.footerLogoUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, footerLogoUrl: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Browser Favicon */}
                <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-2 shadow-xs shrink-0">
                      {settingsForm.faviconUrl ? (
                        <img
                          src={settingsForm.faviconUrl}
                          alt="Favicon"
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <Globe className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 uppercase flex items-center gap-2">
                        <span>Browser Tab Favicon</span>
                        {settingsForm.faviconUrl ? (
                          <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-normal">Default Icon</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Displayed next to the webpage title on browser tabs and bookmarks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>Upload Favicon</span>
                      <input
                        type="file"
                        accept="image/x-icon,image/png,image/svg+xml,image/jpeg"
                        onChange={(e) => handleLogoUpload(e, 'faviconUrl')}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaPickerOpen({
                          targetField: 'faviconUrl',
                          title: 'Select Favicon from Media Assets',
                        });
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                      <span>Select Media</span>
                    </button>
                    {settingsForm.faviconUrl && (
                      <button
                        type="button"
                        onClick={() => handleSetAsLogo('', 'faviconUrl')}
                        className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                      Company / Brand Name
                    </label>
                    <input
                      type="text"
                      value={settingsForm.companyName || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={settingsForm.tagline || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                      Official Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.email || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                      Direct Phone
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                      WhatsApp Number (with Country Code)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                    Head Office Physical Address
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>

                {/* Google Maps Location Configuration */}
                <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Google Maps Location & Link Configuration</span>
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Controls the &quot;Open in Google Maps&quot; link and interactive embedded map on the public Contact page.
                      </p>
                    </div>

                    {settingsForm.googleMapsUrl && (
                      <a
                        href={settingsForm.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg shadow-2xs transition-colors self-start sm:self-auto"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Test Open in Google Maps</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase">
                          Google Maps Location URL (Clickable Destination)
                        </label>
                        {settingsForm.address && (
                          <button
                            type="button"
                            onClick={() => {
                              const generated = `https://maps.google.com/?q=${encodeURIComponent(settingsForm.address)}`;
                              setSettingsForm({ ...settingsForm, googleMapsUrl: generated });
                              notify('Generated Google Maps URL from physical address!');
                            }}
                            className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                          >
                            Auto-generate from Address
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. https://maps.google.com/?q=100+Bishopsgate+London or https://goo.gl/maps/..."
                        value={settingsForm.googleMapsUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono text-slate-700"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Visitors clicking &quot;Open in Google Maps&quot; on the Contact page will navigate to this precise coordinates or pin.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        Google Maps Interactive Embed URL (Optional iframe view)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. https://maps.google.com/maps?q=100+Bishopsgate+London&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        value={settingsForm.googleMapsEmbedUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsEmbedUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono text-slate-700"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        If left blank, the system automatically embeds an interactive map using your physical address.
                      </p>
                    </div>

                    {/* Live Map Preview */}
                    <div className="pt-2">
                      <div className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                        <span>Contact Page Map Preview</span>
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-semibold">Live</span>
                      </div>
                      <div className="w-full h-36 rounded-lg overflow-hidden border border-slate-300 bg-slate-100">
                        <iframe
                          title="Admin Map Preview"
                          src={
                            settingsForm.googleMapsEmbedUrl ||
                            `https://maps.google.com/maps?q=${encodeURIComponent(
                              settingsForm.address || '100 Bishopsgate London'
                            )}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                          }
                          className="w-full h-full border-0"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Corporate Profile PDF Document Card */}
                <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                        <FileDown className="w-4 h-4 text-blue-600" />
                        <span>Corporate Capability Profile (PDF Document)</span>
                        {settingsForm.companyProfilePdfUrl ? (
                          <span className="px-2 py-0.5 text-[9px] bg-emerald-100 text-emerald-800 rounded-full font-bold">
                            Published & Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[9px] bg-amber-100 text-amber-800 rounded-full font-bold">
                            Not Configured
                          </span>
                        )}
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Upload your company capability statement, ISO accreditation certificates, and mobilization catalog for visitors to download.
                      </p>
                    </div>

                    {settingsForm.companyProfilePdfUrl && (
                      <a
                        href={settingsForm.companyProfilePdfUrl}
                        download={settingsForm.companyProfilePdfName || 'EquipWorkforce_Company_Profile.pdf'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Download Active PDF</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        Upload PDF File from Computer
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 shadow-xs transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload PDF Document</span>
                          <input
                            type="file"
                            accept="application/pdf,.pdf"
                            onChange={handleCompanyProfileUpload}
                            className="hidden"
                          />
                        </label>
                        {settingsForm.companyProfilePdfUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(window.location.origin + settingsForm.companyProfilePdfUrl);
                              notify('Copied PDF link to clipboard!');
                            }}
                            className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy Link</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5">
                        Accepted format: PDF (.pdf), up to 10MB. Once uploaded, the download button activates across Header, Contact page, and Footer.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        Display File Name / Download Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. EquipWorkforce_Company_Profile.pdf"
                        value={settingsForm.companyProfilePdfName || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, companyProfilePdfName: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono text-slate-700"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                        Direct PDF Asset URL
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. /uploads/EquipWorkforce_Company_Profile.pdf"
                        value={settingsForm.companyProfilePdfUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, companyProfilePdfUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                    Business Hours
                  </label>
                  <input
                    type="text"
                    value={settingsForm.businessHours || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                    Default SEO Title & Meta Description
                  </label>
                  <input
                    type="text"
                    value={settingsForm.defaultSeoTitle || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, defaultSeoTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white mb-2"
                  />
                  <textarea
                    rows={2}
                    value={settingsForm.defaultSeoDesc || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, defaultSeoDesc: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow"
                  >
                    Save Platform Settings
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB: ACTIVITY LOGS */}
          {activeTab === 'activity-logs' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900">
                  Administrative Activity Audit
                </h1>
                <p className="text-xs text-slate-500">
                  Chronological trail of all administrative and requisition events.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Entity</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {activityList.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="p-3 text-slate-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3 text-slate-700">{log.userEmail}</td>
                        <td className="p-3 text-blue-600 font-bold">{log.action}</td>
                        <td className="p-3">{log.entity} #{log.entityId}</td>
                        <td className="p-3 font-sans text-slate-600">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Comprehensive Type-Aware Item Edit Modal */}
      {editItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 uppercase">
                  {editItemModal.item?.id ? 'Edit' : 'Create'}{' '}
                  {editItemModal.type === 'portfolio'
                    ? 'Case Study'
                    : editItemModal.type === 'blog'
                    ? 'Article / Insight'
                    : editItemModal.type === 'form-option'
                    ? 'Form Dropdown Option'
                    : editItemModal.type === 'workforce'
                    ? 'Workforce Trade'
                    : editItemModal.type === 'service'
                    ? 'Service'
                    : 'Industry Sector'}
                </h2>
                <p className="text-[11px] text-slate-500">
                  {editItemModal.item?.id
                    ? `Editing entity #${editItemModal.item.id}`
                    : 'Configure details and publish live to public portal.'}
                </p>
              </div>
              <button
                onClick={() => setEditItemModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveItemModal(editItemModal.item);
              }}
              className="space-y-4 text-xs"
            >
              {/* FORM OPTION FIELDS */}
              {editItemModal.type === 'form-option' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Form Group / Context
                      </label>
                      <select
                        value={editItemModal.item.formType || 'contact_inquiry'}
                        onChange={(e) => {
                          const val = e.target.value;
                          let defaultFieldName = 'inquiry_type';
                          if (val === 'requisition_duration') defaultFieldName = 'duration';
                          else if (val === 'requisition_experience') defaultFieldName = 'experience';
                          else if (val === 'preferred_contact') defaultFieldName = 'contact_method';
                          else if (val === 'workforce_tier') defaultFieldName = 'tier';
                          setEditItemModal({
                            ...editItemModal,
                            item: {
                              ...editItemModal.item,
                              formType: val,
                              fieldName: defaultFieldName,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                      >
                        <option value="contact_inquiry">Contact Inquiries (inquiry_type)</option>
                        <option value="requisition_duration">Requisitions - Duration (duration)</option>
                        <option value="requisition_experience">Requisitions - Experience (experience)</option>
                        <option value="preferred_contact">Preferred Contact (contact_method)</option>
                        <option value="workforce_tier">Workforce Tiers (tier)</option>
                        <option value="custom">Other Custom Form Group</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Field Name (Identifier)
                      </label>
                      <input
                        type="text"
                        required
                        value={editItemModal.item.fieldName || ''}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, fieldName: e.target.value },
                          })
                        }
                        placeholder="e.g. inquiry_type, duration, experience..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Display Label (What Users See)
                    </label>
                    <input
                      type="text"
                      required
                      value={editItemModal.item.label || ''}
                      onChange={(e) => {
                        const newLabel = e.target.value;
                        const autoValue =
                          editItemModal.item.value &&
                          editItemModal.item.value !== editItemModal.item.label
                            ? editItemModal.item.value
                            : newLabel;
                        setEditItemModal({
                          ...editItemModal,
                          item: {
                            ...editItemModal.item,
                            label: newLabel,
                            value: autoValue,
                          },
                        });
                      }}
                      placeholder="e.g. 1 - 3 Months (Shutdown / Turnaround)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Submitted Value (Saved in Database)
                      </label>
                      <input
                        type="text"
                        required
                        value={editItemModal.item.value || ''}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, value: e.target.value },
                          })
                        }
                        placeholder="e.g. 1 - 3 Months"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={editItemModal.item.displayOrder ?? 1}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: {
                              ...editItemModal.item,
                              displayOrder: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editItemModal.item.isActive !== false}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, isActive: e.target.checked },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span className="font-semibold text-slate-800">
                        Active & Enabled in public website dropdown menus
                      </span>
                    </label>
                  </div>
                </>
              )}

              {/* CASE STUDY (PORTFOLIO) FIELDS */}
              {editItemModal.type === 'portfolio' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Project / Case Study Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editItemModal.item.title || ''}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug =
                            editItemModal.item.slug && editItemModal.item.id
                              ? editItemModal.item.slug
                              : title
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, '-')
                                  .replace(/(^-|-$)/g, '');
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, title, slug },
                          });
                        }}
                        placeholder="e.g. Ras Laffan LNG Trains 7 & 8 Expansion"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        required
                        value={editItemModal.item.slug || ''}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, slug: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Deployment Status
                      </label>
                      <select
                        value={editItemModal.item.status || 'Ongoing'}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, status: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Mobilization Phase">Mobilization Phase</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Client / Principal Contractor
                      </label>
                      <input
                        type="text"
                        value={editItemModal.item.client || ''}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, client: e.target.value },
                          })
                        }
                        placeholder="e.g. QatarEnergy / EPC Joint Venture"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Industry Sector
                      </label>
                      <input
                        type="text"
                        value={editItemModal.item.industry || ''}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, industry: e.target.value },
                          })
                        }
                        placeholder="e.g. Oil, Gas & Petrochemicals"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Location / Work Site
                      </label>
                      <input
                        type="text"
                        value={editItemModal.item.location || ''}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, location: e.target.value },
                          })
                        }
                        placeholder="e.g. Ras Laffan Industrial City, Qatar"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Contract Period / Year
                      </label>
                      <input
                        type="text"
                        value={editItemModal.item.year || ''}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, year: e.target.value },
                          })
                        }
                        placeholder="e.g. 2023 - Present"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Featured Cover Image */}
                  {renderEntityImageField(
                    'Featured Cover Image',
                    'Main display photo shown on project cards and the case study header.',
                    'featuredImage',
                    'Select Case Study Featured Cover Image'
                  )}

                  {/* Case Study Gallery Assets */}
                  {(() => {
                    let galleryArr: string[] = [];
                    if (Array.isArray(editItemModal.item.gallery)) {
                      galleryArr = editItemModal.item.gallery;
                    } else if (typeof editItemModal.item.gallery === 'string') {
                      try {
                        galleryArr = JSON.parse(editItemModal.item.gallery);
                      } catch {
                        galleryArr = editItemModal.item.gallery ? [editItemModal.item.gallery] : [];
                      }
                    }

                    return (
                      <div className="space-y-3 bg-slate-50/90 p-4 rounded-xl border border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <label className="block text-xs font-bold text-slate-800 uppercase">
                                Case Study Gallery Assets ({galleryArr.length})
                              </label>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-blue-100 text-blue-800">
                                Photo Lightbox
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Secondary project photos, field team deployment pictures, and equipment shots.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setMediaPickerOpen({
                                  targetField: 'gallery',
                                  targetContext: 'gallery',
                                  title: 'Add Image to Case Study Gallery',
                                });
                              }}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-2xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add from Media Assets</span>
                            </button>

                            <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 shadow-2xs">
                              <Upload className="w-3.5 h-3.5 text-slate-500" />
                              <span>Upload Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  if (!e.target.files || e.target.files.length === 0) return;
                                  const file = e.target.files[0];
                                  const form = new FormData();
                                  form.append('file', file);
                                  form.append('altText', file.name);
                                  try {
                                    const res = await fetch('/api/admin/media/upload', {
                                      method: 'POST',
                                      headers: token ? { Authorization: `Bearer ${token}` } : {},
                                      body: form,
                                    });
                                    if (res.ok) {
                                      const up = await res.json();
                                      const nextGallery = [...galleryArr, up.url];
                                      setEditItemModal({
                                        ...editItemModal,
                                        item: {
                                          ...editItemModal.item,
                                          gallery: nextGallery,
                                        },
                                      });
                                      notify(`Uploaded & added ${file.name} to gallery`);
                                      const mRes = await fetch('/api/admin/media', { headers: getHeaders() });
                                      if (mRes.ok) setMediaList(await mRes.json());
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        {/* Quick helper to copy featuredImage to gallery if missing */}
                        {editItemModal.item.featuredImage && !galleryArr.includes(editItemModal.item.featuredImage) && (
                          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900">
                            <span className="text-[11px]">
                              Featured cover image is not currently in the gallery asset collection.
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const nextGallery = [editItemModal.item.featuredImage, ...galleryArr];
                                setEditItemModal({
                                  ...editItemModal,
                                  item: {
                                    ...editItemModal.item,
                                    gallery: nextGallery,
                                  },
                                });
                                notify('Added featured cover image to gallery collection');
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded shadow-2xs"
                            >
                              Add Cover to Gallery
                            </button>
                          </div>
                        )}

                        {galleryArr.length === 0 ? (
                          <div className="p-5 border-2 border-dashed border-slate-200 rounded-lg text-center bg-white">
                            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                            <p className="text-xs text-slate-600 font-medium">No gallery photos added yet</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Click &quot;Add from Media Assets&quot; or upload files to display project snapshots.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {galleryArr.map((imgUrl: string, idx: number) => (
                              <div
                                key={idx}
                                className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white shadow-2xs"
                              >
                                <div className="h-28 bg-slate-100 relative">
                                  <img
                                    src={imgUrl}
                                    alt={`Gallery item ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveGalleryImage(imgUrl)}
                                      className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded shadow-xs flex items-center gap-1"
                                      title="Delete image from gallery"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                                <div className="p-1.5 px-2 bg-white border-t border-slate-100 flex items-center justify-between text-[11px]">
                                  <span className="text-slate-600 font-mono truncate">
                                    Photo #{idx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryImage(imgUrl)}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                    title="Remove this photo from gallery"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Scope of Work & Overview
                    </label>
                    <textarea
                      rows={3}
                      value={editItemModal.item.description || ''}
                      onChange={(e) =>
                        setEditItemModal({
                          ...editItemModal,
                          item: { ...editItemModal.item, description: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Services Provided (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={
                          Array.isArray(editItemModal.item.servicesProvided)
                            ? editItemModal.item.servicesProvided.join(', ')
                            : editItemModal.item.servicesProvided || ''
                        }
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: {
                              ...editItemModal.item,
                              servicesProvided: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. 6G TIG Welders, Rigging Crews, QA/QC"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Workforce Categories (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={
                          Array.isArray(editItemModal.item.workforceCategories)
                            ? editItemModal.item.workforceCategories.join(', ')
                            : editItemModal.item.workforceCategories || ''
                        }
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: {
                              ...editItemModal.item,
                              workforceCategories: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. Certified Welders, Riggers & Operators"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editItemModal.item.isFeatured)}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, isFeatured: e.target.checked },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span className="font-semibold text-slate-800">
                        Feature this project on public homepage
                      </span>
                    </label>
                  </div>
                </>
              )}

              {/* BLOG POST FIELDS */}
              {editItemModal.type === 'blog' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Article Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editItemModal.item.title || ''}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug =
                            editItemModal.item.slug && editItemModal.item.id
                              ? editItemModal.item.slug
                              : title
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, '-')
                                  .replace(/(^-|-$)/g, '');
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, title, slug },
                          });
                        }}
                        placeholder="e.g. Navigating Multi-Jurisdiction Workforce Logistics in 2026"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        required
                        value={editItemModal.item.slug || ''}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, slug: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Category
                      </label>
                      <select
                        value={editItemModal.item.category || 'Workforce Insights'}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, category: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                      >
                        <option value="Workforce Insights">Workforce Insights</option>
                        <option value="Global Mobility">Global Mobility & Compliance</option>
                        <option value="Safety & HSE">Safety & HSE Standards</option>
                        <option value="Industrial News">Industrial News & Reports</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={editItemModal.item.author || ''}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, author: e.target.value },
                          })
                        }
                        placeholder="e.g. EquipWorkforce Editorial"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Publication Status
                      </label>
                      <select
                        value={editItemModal.item.status || 'published'}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, status: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                      >
                        <option value="published">Published (Live)</option>
                        <option value="draft">Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  {renderEntityImageField(
                    'Article Featured Hero Image',
                    'Main hero picture displayed on insights blog listing, card preview, and article banner.',
                    'featuredImage',
                    'Select Blog Article Cover Image'
                  )}

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Excerpt / Summary (Shown in cards & preview)
                    </label>
                    <textarea
                      rows={2}
                      value={editItemModal.item.excerpt || ''}
                      onChange={(e) =>
                        setEditItemModal({
                          ...editItemModal,
                          item: { ...editItemModal.item, excerpt: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Article Content (Full body)
                    </label>
                    <textarea
                      rows={6}
                      value={editItemModal.item.content || ''}
                      onChange={(e) =>
                        setEditItemModal({
                          ...editItemModal,
                          item: { ...editItemModal.item, content: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Topic Tags (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={
                        Array.isArray(editItemModal.item.tags)
                          ? editItemModal.item.tags.join(', ')
                          : editItemModal.item.tags || ''
                      }
                      onChange={(e) =>
                        setEditItemModal({
                          ...editItemModal,
                          item: { ...editItemModal.item, tags: e.target.value },
                        })
                      }
                      placeholder="e.g. Workforce, Safety, Middle East, Certification"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editItemModal.item.isFeatured)}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, isFeatured: e.target.checked },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span className="font-semibold text-slate-800">
                        Feature article prominently at the top of the blog page
                      </span>
                    </label>
                  </div>
                </>
              )}

              {/* INDUSTRY FIELDS */}
              {editItemModal.type === 'industry' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Industry Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editItemModal.item.title || ''}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug =
                            editItemModal.item.slug && editItemModal.item.id
                              ? editItemModal.item.slug
                              : title
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, '-')
                                  .replace(/(^-|-$)/g, '');
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, title, slug },
                          });
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        value={editItemModal.item.slug || ''}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, slug: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Sector Description
                    </label>
                    <textarea
                      rows={3}
                      value={editItemModal.item.description || ''}
                      onChange={(e) =>
                        setEditItemModal({
                          ...editItemModal,
                          item: { ...editItemModal.item, description: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Highlight Metric / Stat
                      </label>
                      <input
                        type="text"
                        value={editItemModal.item.stats || ''}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, stats: e.target.value },
                          })
                        }
                        placeholder="e.g. 5,000+ Workers Mobilized"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={editItemModal.item.displayOrder ?? 1}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: {
                              ...editItemModal.item,
                              displayOrder: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  {renderEntityImageField(
                    'Industry Sector Header Photo',
                    'Display photo for this industrial vertical on public cards and sector overview.',
                    'image',
                    'Select Industry Sector Image'
                  )}
                </>
              )}

              {/* SERVICE FIELDS */}
              {editItemModal.type === 'service' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Service Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editItemModal.item.title || ''}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug =
                            editItemModal.item.slug && editItemModal.item.id
                              ? editItemModal.item.slug
                              : title
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, '-')
                                  .replace(/(^-|-$)/g, '');
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, title, slug },
                          });
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        value={editItemModal.item.slug || ''}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, slug: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Short Description (Summary)
                    </label>
                    <textarea
                      rows={2}
                      value={editItemModal.item.shortDesc || ''}
                      onChange={(e) =>
                        setEditItemModal({
                          ...editItemModal,
                          item: { ...editItemModal.item, shortDesc: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Full Service Details
                    </label>
                    <textarea
                      rows={4}
                      value={editItemModal.item.fullDesc || editItemModal.item.description || ''}
                      onChange={(e) =>
                        setEditItemModal({
                          ...editItemModal,
                          item: {
                            ...editItemModal.item,
                            fullDesc: e.target.value,
                            description: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  {renderEntityImageField(
                    'Service Featured Visual Asset',
                    'Primary cover picture displayed on the visitor services catalog, solution detail page, and homepage cards.',
                    'featuredImage',
                    'Select Service Featured Image'
                  )}

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Key Capabilities / Benefits (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={
                        Array.isArray(editItemModal.item.benefits)
                          ? editItemModal.item.benefits.join(', ')
                          : editItemModal.item.benefits || ''
                      }
                      onChange={(e) =>
                        setEditItemModal({
                          ...editItemModal,
                          item: { ...editItemModal.item, benefits: e.target.value },
                        })
                      }
                      placeholder="e.g. Biometric identity vetting, Rapid 48-hour mobilization"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editItemModal.item.isPublished !== false}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, isPublished: e.target.checked },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span className="font-semibold text-slate-800">Published live</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editItemModal.item.isFeatured)}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, isFeatured: e.target.checked },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span className="font-semibold text-slate-800">Featured on homepage</span>
                    </label>
                  </div>
                </>
              )}

              {/* WORKFORCE FIELDS */}
              {editItemModal.type === 'workforce' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Trade Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editItemModal.item.title || ''}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug =
                            editItemModal.item.slug && editItemModal.item.id
                              ? editItemModal.item.slug
                              : title
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, '-')
                                  .replace(/(^-|-$)/g, '');
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, title, slug },
                          });
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 uppercase mb-1">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        value={editItemModal.item.slug || ''}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, slug: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Discipline Overview
                    </label>
                    <textarea
                      rows={3}
                      value={editItemModal.item.description || ''}
                      onChange={(e) =>
                        setEditItemModal({
                          ...editItemModal,
                          item: { ...editItemModal.item, description: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Experience & Certification Criteria
                    </label>
                    <textarea
                      rows={2}
                      value={editItemModal.item.experienceInfo || ''}
                      onChange={(e) =>
                        setEditItemModal({
                          ...editItemModal,
                          item: { ...editItemModal.item, experienceInfo: e.target.value },
                        })
                      }
                      placeholder="e.g. Minimum 5 years verified heavy industrial site experience with ASME IX/AWS D1.1 certifications."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase mb-1">
                      Core Skills (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={
                        Array.isArray(editItemModal.item.skills)
                          ? editItemModal.item.skills.join(', ')
                          : editItemModal.item.skills || ''
                      }
                      onChange={(e) =>
                        setEditItemModal({
                          ...editItemModal,
                          item: { ...editItemModal.item, skills: e.target.value },
                        })
                      }
                      placeholder="e.g. 6G TIG, SMAW, Carbon Steel, Stainless Steel"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  {renderEntityImageField(
                    'Trade Competency Visual Asset',
                    'Main trade photo displayed on the visitor workforce catalog and trade detail specifications.',
                    'image',
                    'Select Workforce Trade Image'
                  )}

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editItemModal.item.isFeatured)}
                        onChange={(e) =>
                          setEditItemModal({
                            ...editItemModal,
                            item: { ...editItemModal.item, isFeatured: e.target.checked },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span className="font-semibold text-slate-800">
                        Feature this trade on public homepage
                      </span>
                    </label>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditItemModal(null)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  {mediaPickerOpen.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {mediaPickerOpen.targetContext === 'gallery'
                    ? 'Select an image to add to this case study gallery.'
                    : mediaPickerOpen.targetContext === 'modal'
                    ? 'Select an asset for this field.'
                    : `Select an asset to set as ${
                        mediaPickerOpen.targetField === 'heroBannerImage'
                          ? 'Hero Banner'
                          : mediaPickerOpen.targetField === 'logoUrl'
                          ? 'Primary Logo'
                          : mediaPickerOpen.targetField === 'footerLogoUrl'
                          ? 'Footer Logo'
                          : 'Favicon'
                      }.`}
                </p>
              </div>
              <button
                onClick={() => setMediaPickerOpen(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Upload & Search */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
              <div className="relative flex-1 w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={mediaPickerSearch}
                  onChange={(e) => setMediaPickerSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <label className="cursor-pointer shrink-0 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New File</span>
                <input
                  type="file"
                  accept="image/*,image/svg+xml"
                  onChange={handlePickerUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Assets Grid */}
            <div className="flex-1 overflow-y-auto min-h-[260px] max-h-[380px] pr-1">
              {mediaList.filter((m) =>
                m.mimeType?.startsWith('image') &&
                (m.originalName?.toLowerCase().includes(mediaPickerSearch.toLowerCase()) ||
                  m.altText?.toLowerCase().includes(mediaPickerSearch.toLowerCase()))
              ).length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
                  <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-600">No image assets found</p>
                  <p className="text-[11px] text-slate-400 mt-1">Upload an image file above to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mediaList
                    .filter((m) =>
                      m.mimeType?.startsWith('image') &&
                      (m.originalName?.toLowerCase().includes(mediaPickerSearch.toLowerCase()) ||
                        m.altText?.toLowerCase().includes(mediaPickerSearch.toLowerCase()))
                    )
                    .map((m) => {
                      const isSelected =
                        mediaPickerOpen.targetContext === 'modal'
                          ? editItemModal?.item?.[mediaPickerOpen.targetField] === m.url
                          : mediaPickerOpen.targetContext === 'gallery'
                          ? Array.isArray(editItemModal?.item?.gallery) &&
                            editItemModal.item.gallery.includes(m.url)
                          : settingsForm[mediaPickerOpen.targetField] === m.url;
                      return (
                        <div
                          key={m.id}
                          className={`group border rounded-xl overflow-hidden cursor-pointer transition-all hover:border-blue-500 hover:shadow-md relative ${
                            isSelected
                              ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/20'
                              : 'border-slate-200 bg-white'
                          }`}
                          onClick={() => handleSelectPickerAsset(m.url)}
                        >
                          <div className="h-28 bg-slate-50 relative flex items-center justify-center p-2">
                            <img
                              src={m.url}
                              alt={m.altText || m.originalName}
                              className="max-h-full max-w-full object-contain"
                            />
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 shadow">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteMedia(m);
                              }}
                              className="absolute top-2 left-2 p-1 rounded bg-white/90 text-rose-600 hover:bg-rose-600 hover:text-white shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete this asset permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] font-medium text-slate-800 truncate" title={m.originalName}>
                              {m.originalName}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {(m.size / 1024).toFixed(0)} KB
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setMediaPickerOpen(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
