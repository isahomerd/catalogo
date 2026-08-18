import { useState } from 'react';
import {
  Package,
  Tags,
  MessageSquare,
  Plus,
  Trash2,
  Pencil,
  Search,
  Mail,
  Phone,
  Clock,
  X,
  Check,
  Image,
  Type,
  RotateCcw,
  Eye,
  Save,
  UploadCloud,
  MapPin,
  Instagram,
  Facebook,
} from 'lucide-react';
import type { Product, ContactMessage, HomeContent, SiteContact, ProductCategory } from '../types';
import { defaultHomeContent } from '../data';
import { saveHomeContent, uploadHomeImage } from '../services/homeContent';
import { saveSiteContact } from '../services/siteContact';
import {
  deleteProduct as deleteSupabaseProduct,
  saveProduct,
  uploadProductImage,
} from '../services/products';
import {
  deleteCategory as deleteSupabaseCategory,
  saveCategory,
} from '../services/categories';
import { formatCurrency } from '../utils/format';

type ProductDraft = {
  id?: string;
  name: string;
  category: Product['category'];
  price: string;
  description: string;
  colors: string;
  stock: string;
  existingSales: number;
  imageUrl: string;
  featured: boolean;
};

const emptyProductDraft: ProductDraft = {
  name: '',
  category: 'Cocina',
  price: '',
  description: '',
  colors: '#936639',
  stock: '',
  existingSales: 0,
  imageUrl: '',
  featured: false,
};

interface AdminPageProps {
  messages: ContactMessage[];
  onMarkRead: (id: string) => void;
  onDeleteMessage: (id: string) => void;
  products: Product[];
  categories: ProductCategory[];
  onProductSaved: (product: Product) => void;
  onProductDeleted: (id: string) => void;
  onCategorySaved: (category: ProductCategory) => void;
  onCategoryDeleted: (id: string) => void;
  homeContent: HomeContent;
  onHomeContentChange: (content: HomeContent) => void;
  siteContact: SiteContact;
  onSiteContactChange: (contact: SiteContact) => void;
}

export default function AdminPage({
  messages,
  onMarkRead,
  onDeleteMessage,
  products,
  categories: productCategories,
  onProductSaved,
  onProductDeleted,
  onCategorySaved,
  onCategoryDeleted,
  homeContent,
  onHomeContentChange,
  siteContact,
  onSiteContactChange,
}: AdminPageProps) {
  const [tab, setTab] = useState<'products' | 'categories' | 'messages' | 'home' | 'contact'>('products');
  const [search, setSearch] = useState('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productDraft, setProductDraft] = useState<ProductDraft>(emptyProductDraft);
  const [productStatus, setProductStatus] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState({ id: '', name: '', sortOrder: '' });
  const [categoryStatus, setCategoryStatus] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);
  const [homeStatus, setHomeStatus] = useState('');
  const [savingHome, setSavingHome] = useState(false);
  const [uploadingHomeImage, setUploadingHomeImage] = useState(false);
  const [contactStatus, setContactStatus] = useState('');
  const [savingContact, setSavingContact] = useState(false);

  const unreadCount = messages.filter((m) => !m.read).length;
  const categoryNames = productCategories.map((category) => category.name);

  const updateHomeField = (field: keyof HomeContent, value: string) => {
    onHomeContentChange({ ...homeContent, [field]: value });
  };

  const updateContactField = (field: keyof SiteContact, value: string) => {
    onSiteContactChange({ ...siteContact, [field]: value });
  };

  const resetHomeContent = () => {
    onHomeContentChange(defaultHomeContent);
    setHomeStatus('Contenido restaurado. Guarda para aplicarlo en Supabase.');
  };

  const handleSaveHomeContent = async () => {
    setSavingHome(true);
    setHomeStatus('');
    try {
      const savedContent = await saveHomeContent(homeContent);
      onHomeContentChange(savedContent);
      setHomeStatus('Cambios guardados en Supabase.');
    } catch (error) {
      console.error(error);
      setHomeStatus('No se pudieron guardar los cambios.');
    } finally {
      setSavingHome(false);
    }
  };

  const handleHomeImageSelect = async (file: File | undefined) => {
    if (!file) return;

    setUploadingHomeImage(true);
    setHomeStatus('');
    try {
      const uploaded = await uploadHomeImage(file);
      onHomeContentChange({
        ...homeContent,
        imageUrl: uploaded.publicUrl,
        imageAlt: homeContent.imageAlt || file.name.replace(/\.[^/.]+$/, ''),
      });
      setHomeStatus(`Imagen subida a Storage: ${uploaded.path}`);
    } catch (error) {
      console.error(error);
      setHomeStatus('No se pudo subir la imagen.');
    } finally {
      setUploadingHomeImage(false);
    }
  };

  const handleSaveSiteContact = async () => {
    setSavingContact(true);
    setContactStatus('');
    try {
      const savedContact = await saveSiteContact(siteContact);
      onSiteContactChange(savedContact);
      setContactStatus('Contacto guardado en Supabase.');
    } catch (error) {
      console.error(error);
      setContactStatus('No se pudo guardar el contacto.');
    } finally {
      setSavingContact(false);
    }
  };

  const openNewProductModal = () => {
    setProductDraft({
      ...emptyProductDraft,
      category: categoryNames[0] || 'Cocina',
    });
    setProductStatus('');
    setProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setProductDraft({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      colors: product.colors.join(', '),
      stock: product.stock.toString(),
      existingSales: product.sales,
      imageUrl: product.images[0] || '',
      featured: Boolean(product.featured),
    });
    setProductStatus('');
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productDraft.name.trim() || !productDraft.price.trim()) return;

    setSavingProduct(true);
    setProductStatus('');
    try {
      const savedProduct = await saveProduct({
        id: productDraft.id,
        name: productDraft.name.trim(),
        category: productDraft.category,
        price: Number(productDraft.price),
        description: productDraft.description.trim() || 'Sin descripción',
        colors: productDraft.colors.split(',').map((c) => c.trim()).filter(Boolean),
        images: productDraft.imageUrl ? [productDraft.imageUrl] : [],
        stock: Number(productDraft.stock) || 0,
        sales: productDraft.id ? productDraft.existingSales : 0,
        featured: productDraft.featured,
      });

      onProductSaved(savedProduct);
      setProductStatus('Producto guardado en Supabase.');
      setProductModalOpen(false);
    } catch (error) {
      console.error(error);
      setProductStatus('No se pudo guardar el producto.');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleProductImageSelect = async (file: File | undefined) => {
    if (!file) return;

    setUploadingProductImage(true);
    setProductStatus('');
    try {
      const uploaded = await uploadProductImage(file);
      setProductDraft((prev) => ({ ...prev, imageUrl: uploaded.publicUrl }));
      setProductStatus(`Imagen subida a Storage: ${uploaded.path}`);
    } catch (error) {
      console.error(error);
      setProductStatus('No se pudo subir la imagen.');
    } finally {
      setUploadingProductImage(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setProductStatus('');
    try {
      await deleteSupabaseProduct(id);
      onProductDeleted(id);
    } catch (error) {
      console.error(error);
      setProductStatus('No se pudo eliminar el producto.');
    }
  };

  const startEditCategory = (category: ProductCategory) => {
    setCategoryDraft({
      id: category.id,
      name: category.name,
      sortOrder: category.sortOrder.toString(),
    });
    setCategoryStatus('');
  };

  const resetCategoryDraft = () => {
    setCategoryDraft({ id: '', name: '', sortOrder: '' });
    setCategoryStatus('');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryDraft.name.trim()) return;

    setSavingCategory(true);
    setCategoryStatus('');
    try {
      const savedCategory = await saveCategory({
        id: categoryDraft.id || undefined,
        name: categoryDraft.name,
        sortOrder:
          Number(categoryDraft.sortOrder) ||
          (productCategories.length + 1) * 10,
      });
      onCategorySaved(savedCategory);
      setCategoryDraft({ id: '', name: '', sortOrder: '' });
      setCategoryStatus('Categoría guardada en Supabase.');
    } catch (error) {
      console.error(error);
      setCategoryStatus('No se pudo guardar la categoría.');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setCategoryStatus('');
    try {
      await deleteSupabaseCategory(categoryId);
      onCategoryDeleted(categoryId);
    } catch (error) {
      console.error(error);
      setCategoryStatus('No se pudo eliminar la categoría.');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-charcoal_brown-500 py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <span className="text-xs uppercase tracking-[0.3em] text-dry_sage-400 mb-3 block">
            Panel de administración
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-khaki_beige-900">
            Gestión Isa Home
          </h1>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-8">
        <div className="flex gap-2 border-b border-dry_sage-300/40">
          <button
            onClick={() => setTab('products')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === 'products'
                ? 'border-toffee_brown-500 text-charcoal_brown-500'
                : 'border-transparent text-ebony-500 hover:text-charcoal_brown-500'
            }`}
          >
            <Package className="w-4 h-4" />
            Productos ({products.length})
          </button>
          <button
            onClick={() => setTab('categories')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === 'categories'
                ? 'border-toffee_brown-500 text-charcoal_brown-500'
                : 'border-transparent text-ebony-500 hover:text-charcoal_brown-500'
            }`}
          >
            <Tags className="w-4 h-4" />
            Categorías ({productCategories.length})
          </button>
          <button
            onClick={() => setTab('home')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === 'home'
                ? 'border-toffee_brown-500 text-charcoal_brown-500'
                : 'border-transparent text-ebony-500 hover:text-charcoal_brown-500'
            }`}
          >
            <Image className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => setTab('contact')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === 'contact'
                ? 'border-toffee_brown-500 text-charcoal_brown-500'
                : 'border-transparent text-ebony-500 hover:text-charcoal_brown-500'
            }`}
          >
            <Phone className="w-4 h-4" />
            Contacto
          </button>
          <button
            onClick={() => setTab('messages')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === 'messages'
                ? 'border-toffee_brown-500 text-charcoal_brown-500'
                : 'border-transparent text-ebony-500 hover:text-charcoal_brown-500'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Mensajes ({messages.length})
            {unreadCount > 0 && (
              <span className="bg-toffee_brown-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Products Tab */}
      {tab === 'products' && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ebony-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-khaki_beige-800/70 border border-dry_sage-300/50 rounded-full focus:outline-none focus:border-toffee_brown-500 transition-colors text-charcoal_brown-500"
              />
            </div>
            <button
              onClick={openNewProductModal}
              className="inline-flex items-center gap-2 bg-charcoal_brown-500 text-khaki_beige-900 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-charcoal_brown-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Producto
            </button>
          </div>

          {productStatus && !productModalOpen && (
            <p className="text-sm text-ebony-600 mb-4">{productStatus}</p>
          )}

          <div className="overflow-x-auto rounded-2xl border border-dry_sage-300/40">
            <table className="w-full text-sm">
              <thead className="bg-khaki_beige-800/60 text-ebony-500 text-xs uppercase tracking-widest">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Producto</th>
                  <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Categoría</th>
                  <th className="text-left px-5 py-3 font-medium">Precio</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Stock</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Ventas</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dry_sage-300/30">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-khaki_beige-800/40 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <span className="text-charcoal_brown-500 font-medium truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ebony-600 hidden sm:table-cell">{p.category}</td>
                    <td className="px-5 py-3 font-serif text-charcoal_brown-500">{formatCurrency(p.price)}</td>
                    <td className="px-5 py-3 text-ebony-600 hidden md:table-cell">{p.stock}</td>
                    <td className="px-5 py-3 text-ebony-600 hidden md:table-cell">{p.sales}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditProductModal(p)}
                          className="p-2 text-ebony-400 hover:text-charcoal_brown-500 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 text-ebony-400 hover:text-toffee_brown-600 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Categories Tab */}
      {tab === 'categories' && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <form
              onSubmit={handleSaveCategory}
              className="lg:col-span-2 space-y-5 bg-khaki_beige-800/60 border border-dry_sage-300/40 rounded-2xl p-6"
            >
              <div>
                <h2 className="font-serif text-2xl text-charcoal_brown-500">
                  {categoryDraft.id ? 'Editar categoría' : 'Nueva categoría'}
                </h2>
                <p className="text-sm text-ebony-500 mt-1">
                  Estas opciones aparecen al crear productos.
                </p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                  Nombre
                </label>
                <input
                  type="text"
                  value={categoryDraft.name}
                  onChange={(e) => setCategoryDraft({ ...categoryDraft, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                  placeholder="Ej. Iluminación"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                  Orden
                </label>
                <input
                  type="number"
                  value={categoryDraft.sortOrder}
                  onChange={(e) => setCategoryDraft({ ...categoryDraft, sortOrder: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                  placeholder={`${(productCategories.length + 1) * 10}`}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="inline-flex items-center justify-center gap-2 bg-charcoal_brown-500 text-khaki_beige-900 px-6 py-3 rounded-full text-sm font-medium hover:bg-charcoal_brown-400 transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {savingCategory ? 'Guardando...' : 'Guardar categoría'}
                </button>
                {categoryDraft.id && (
                  <button
                    type="button"
                    onClick={resetCategoryDraft}
                    className="inline-flex items-center justify-center gap-2 border border-dry_sage-300/60 text-charcoal_brown-500 px-6 py-3 rounded-full text-sm font-medium hover:bg-dry_sage-200/40 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                )}
              </div>
              {categoryStatus && (
                <p className="text-sm text-ebony-600">{categoryStatus}</p>
              )}
            </form>

            <div className="lg:col-span-3 overflow-x-auto rounded-2xl border border-dry_sage-300/40">
              <table className="w-full text-sm">
                <thead className="bg-khaki_beige-800/60 text-ebony-500 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium">Categoría</th>
                    <th className="text-left px-5 py-3 font-medium">Orden</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dry_sage-300/30">
                  {productCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-khaki_beige-800/40 transition-colors">
                      <td className="px-5 py-3 text-charcoal_brown-500 font-medium">
                        {category.name}
                      </td>
                      <td className="px-5 py-3 text-ebony-600">{category.sortOrder}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => startEditCategory(category)}
                            className="p-2 text-ebony-400 hover:text-charcoal_brown-500 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-ebony-400 hover:text-toffee_brown-600 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Home Tab */}
      {tab === 'home' && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="font-serif text-2xl text-charcoal_brown-500">
                    Configuración del Home
                  </h2>
                  <p className="text-sm text-ebony-500 mt-1">
                    Hero principal y llamada a la acción.
                  </p>
                </div>
                <button
                  onClick={resetHomeContent}
                  className="w-10 h-10 rounded-full border border-dry_sage-300/50 text-ebony-500 hover:text-charcoal_brown-500 hover:bg-dry_sage-200/40 transition-colors flex items-center justify-center shrink-0"
                  title="Restaurar contenido"
                  aria-label="Restaurar contenido"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5 bg-khaki_beige-800/60 border border-dry_sage-300/40 rounded-2xl p-6">
                <div>
                  <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 flex items-center gap-2">
                    <Type className="w-3.5 h-3.5" />
                    Etiqueta superior
                  </label>
                  <input
                    type="text"
                    value={homeContent.eyebrow}
                    onChange={(e) => updateHomeField('eyebrow', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                    placeholder="Artículos para el Hogar"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                    Título principal
                  </label>
                  <input
                    type="text"
                    value={homeContent.title}
                    onChange={(e) => updateHomeField('title', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                    placeholder="La calidez que tu hogar merece"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                    Mensaje
                  </label>
                  <textarea
                    value={homeContent.description}
                    onChange={(e) => updateHomeField('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500 resize-none"
                    placeholder="Mensaje del hero"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                    Texto del botón
                  </label>
                  <input
                    type="text"
                    value={homeContent.ctaLabel}
                    onChange={(e) => updateHomeField('ctaLabel', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                    placeholder="Ver Catálogo"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 flex items-center gap-2">
                    <Image className="w-3.5 h-3.5" />
                    Imagen principal
                  </label>
                  <label className="mb-3 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-dry_sage-400/60 bg-khaki_beige-900/45 px-4 py-5 text-center transition-colors hover:bg-dry_sage-200/30">
                    <UploadCloud className="w-7 h-7 text-toffee_brown-600 mb-2" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-charcoal_brown-500">
                      {uploadingHomeImage ? 'Subiendo imagen...' : 'Seleccionar imagen desde tu desktop'}
                    </span>
                    <span className="text-xs text-ebony-500 mt-1">
                      JPG, PNG, WEBP o GIF hasta 10 MB
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      disabled={uploadingHomeImage}
                      onChange={(e) => handleHomeImageSelect(e.target.files?.[0])}
                    />
                  </label>
                  <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                    URL de imagen
                  </label>
                  <input
                    type="url"
                    value={homeContent.imageUrl}
                    onChange={(e) => updateHomeField('imageUrl', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                    Texto alternativo
                  </label>
                  <input
                    type="text"
                    value={homeContent.imageAlt}
                    onChange={(e) => updateHomeField('imageAlt', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                    placeholder="Descripción breve de la imagen"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveHomeContent}
                    disabled={savingHome || uploadingHomeImage}
                    className="inline-flex items-center justify-center gap-2 bg-charcoal_brown-500 text-khaki_beige-900 px-6 py-3 rounded-full text-sm font-medium hover:bg-charcoal_brown-400 transition-colors disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {savingHome ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  {homeStatus && (
                    <p className="text-sm text-ebony-600">
                      {homeStatus}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-5">
                <Eye className="w-4 h-4 text-toffee_brown-600" />
                <h3 className="text-sm font-medium text-charcoal_brown-500">
                  Vista previa
                </h3>
              </div>
              <div className="relative min-h-[520px] rounded-2xl overflow-hidden bg-charcoal_brown-500 shadow-lg">
                <img
                  src={homeContent.imageUrl}
                  alt={homeContent.imageAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal_brown-500/75 via-charcoal_brown-500/45 to-transparent" />
                <div className="relative min-h-[520px] px-7 sm:px-10 flex flex-col justify-center">
                  <div className="max-w-md">
                    <span className="text-xs uppercase tracking-[0.3em] text-dry_sage-400 mb-4 block">
                      {homeContent.eyebrow || 'Etiqueta superior'}
                    </span>
                    <h3 className="font-serif text-4xl sm:text-5xl text-khaki_beige-900 leading-tight mb-5">
                      {homeContent.title || 'Título principal'}
                    </h3>
                    <p className="text-khaki_beige-800 text-base leading-relaxed mb-8">
                      {homeContent.description || 'Mensaje del hero'}
                    </p>
                    <span className="inline-flex items-center gap-2 bg-khaki_beige-900 text-charcoal_brown-500 px-7 py-3.5 rounded-full text-sm tracking-wide font-medium">
                      {homeContent.ctaLabel || 'Texto del botón'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Tab */}
      {tab === 'contact' && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="mb-5">
                <h2 className="font-serif text-2xl text-charcoal_brown-500">
                  Datos de contacto
                </h2>
                <p className="text-sm text-ebony-500 mt-1">
                  Información visible en Contacto y Footer.
                </p>
              </div>

              <div className="space-y-5 bg-khaki_beige-800/60 border border-dry_sage-300/40 rounded-2xl p-6">
                <div>
                  <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={siteContact.phone}
                    onChange={(e) => updateContactField('phone', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                    placeholder="+1 809 000 0000"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    Correo
                  </label>
                  <input
                    type="email"
                    value={siteContact.email}
                    onChange={(e) => updateContactField('email', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                    placeholder="hola@isahome.com"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    Dirección
                  </label>
                  <textarea
                    value={siteContact.address}
                    onChange={(e) => updateContactField('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500 resize-none"
                    placeholder="Dirección de la tienda"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Horario
                  </label>
                  <input
                    type="text"
                    value={siteContact.hours}
                    onChange={(e) => updateContactField('hours', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                    placeholder="Lun-Vie: 10:00-20:00"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 flex items-center gap-2">
                    <Instagram className="w-3.5 h-3.5" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={siteContact.instagramUrl}
                    onChange={(e) => updateContactField('instagramUrl', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                    placeholder="https://instagram.com/isahomerd"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 flex items-center gap-2">
                    <Facebook className="w-3.5 h-3.5" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={siteContact.facebookUrl}
                    onChange={(e) => updateContactField('facebookUrl', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                    placeholder="https://facebook.com/isahomerd"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSiteContact}
                    disabled={savingContact}
                    className="inline-flex items-center justify-center gap-2 bg-charcoal_brown-500 text-khaki_beige-900 px-6 py-3 rounded-full text-sm font-medium hover:bg-charcoal_brown-400 transition-colors disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {savingContact ? 'Guardando...' : 'Guardar contacto'}
                  </button>
                  {contactStatus && (
                    <p className="text-sm text-ebony-600">
                      {contactStatus}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-5">
                <Eye className="w-4 h-4 text-toffee_brown-600" />
                <h3 className="text-sm font-medium text-charcoal_brown-500">
                  Vista previa
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { icon: Phone, label: 'Teléfono', value: siteContact.phone },
                  { icon: Mail, label: 'Email', value: siteContact.email },
                  { icon: MapPin, label: 'Dirección', value: siteContact.address },
                  { icon: Clock, label: 'Horario', value: siteContact.hours },
                  { icon: Instagram, label: 'Instagram', value: siteContact.instagramUrl },
                  { icon: Facebook, label: 'Facebook', value: siteContact.facebookUrl },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="min-h-32 rounded-2xl border border-dry_sage-300/40 bg-khaki_beige-800/60 p-5 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-dry_sage-200/60 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-toffee_brown-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-widest text-ebony-500">
                        {item.label}
                      </p>
                      <p className="text-charcoal_brown-500 mt-1 break-words">
                        {item.value || 'Sin configurar'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Messages Tab */}
      {tab === 'messages' && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="w-14 h-14 text-dry_sage-400 mx-auto mb-4" strokeWidth={1} />
              <p className="font-serif text-xl text-charcoal_brown-500">No hay mensajes</p>
              <p className="text-sm text-ebony-500 mt-1">Los mensajes del formulario aparecerán aquí.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-2xl border p-5 transition-all ${
                    msg.read
                      ? 'bg-khaki_beige-800/40 border-dry_sage-300/30'
                      : 'bg-khaki_beige-800/70 border-toffee_brown-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!msg.read && (
                          <span className="w-2 h-2 rounded-full bg-toffee_brown-500 shrink-0" />
                        )}
                        <h3 className="font-serif text-lg text-charcoal_brown-500">{msg.name}</h3>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ebony-500 mb-3">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> {msg.email}
                        </span>
                        {msg.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> {msg.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {formatDate(msg.date)}
                        </span>
                      </div>
                      <p className="text-sm text-ebony-600 leading-relaxed">{msg.message}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {!msg.read && (
                        <button
                          onClick={() => onMarkRead(msg.id)}
                          className="p-2 text-ebony-400 hover:text-dusty_olive-600 transition-colors rounded-lg hover:bg-dry_sage-200/50"
                          title="Marcar como leído"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        className="p-2 text-ebony-400 hover:text-toffee_brown-600 transition-colors rounded-lg hover:bg-dry_sage-200/50"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {productModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal_brown-500/50 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setProductModalOpen(false)}
        >
          <form
            onSubmit={handleSaveProduct}
            className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-khaki_beige-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-dry_sage-300/40 bg-khaki_beige-900 px-6 py-5">
              <div>
                <h2 className="font-serif text-2xl text-charcoal_brown-500">
                  {productDraft.id ? 'Editar producto' : 'Nuevo producto'}
                </h2>
                <p className="text-sm text-ebony-500">
                  La información se guarda en Supabase.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-dry_sage-200/60 transition-colors flex items-center justify-center"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-charcoal_brown-500" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 p-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={productDraft.name}
                  onChange={(e) => setProductDraft({ ...productDraft, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-khaki_beige-800/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                  placeholder="Nombre del producto"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                  Categoría
                </label>
                <select
                  value={productDraft.category}
                  onChange={(e) => setProductDraft({ ...productDraft, category: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-khaki_beige-800/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                >
                  {categoryNames.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                  Precio (RD$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={productDraft.price}
                  onChange={(e) => setProductDraft({ ...productDraft, price: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-khaki_beige-800/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                  placeholder="100.00"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                  Stock
                </label>
                <input
                  type="number"
                  value={productDraft.stock}
                  onChange={(e) => setProductDraft({ ...productDraft, stock: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-khaki_beige-800/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                  placeholder="0"
                />
              </div>

              <label className="flex items-center gap-3 rounded-lg border border-dry_sage-300/50 bg-khaki_beige-800/70 px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={productDraft.featured}
                  onChange={(e) => setProductDraft({ ...productDraft, featured: e.target.checked })}
                  className="h-4 w-4 accent-toffee_brown-500"
                />
                <span className="text-sm text-charcoal_brown-500">Producto destacado</span>
              </label>

              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                  Descripción
                </label>
                <textarea
                  value={productDraft.description}
                  onChange={(e) => setProductDraft({ ...productDraft, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 text-sm bg-khaki_beige-800/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500 resize-none"
                  placeholder="Descripción del producto"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                  Colores
                </label>
                <input
                  type="text"
                  value={productDraft.colors}
                  onChange={(e) => setProductDraft({ ...productDraft, colors: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-khaki_beige-800/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                  placeholder="#936639, #b6ad90"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                  Imagen del producto
                </label>
                <div className="rounded-xl border border-dry_sage-300/50 bg-khaki_beige-800/70 overflow-hidden">
                  <div className="grid md:grid-cols-[240px_1fr]">
                    <div className="relative aspect-[4/3] bg-dry_sage-200/40">
                      {productDraft.imageUrl ? (
                        <img
                          src={productDraft.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-ebony-400">
                          <Image className="w-8 h-8 mb-2" strokeWidth={1.5} />
                          <span className="text-xs">Sin imagen</span>
                        </div>
                      )}
                      <label className="absolute inset-x-3 bottom-3 cursor-pointer">
                        <span className="flex items-center justify-center gap-2 rounded-full bg-khaki_beige-900/95 px-4 py-2.5 text-sm font-medium text-charcoal_brown-500 shadow-sm backdrop-blur transition-colors hover:bg-dry_sage-200">
                          <UploadCloud className="w-4 h-4" />
                          {uploadingProductImage ? 'Subiendo...' : productDraft.imageUrl ? 'Cambiar imagen' : 'Subir imagen'}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="sr-only"
                          disabled={uploadingProductImage}
                          onChange={(e) => handleProductImageSelect(e.target.files?.[0])}
                        />
                      </label>
                    </div>

                    <div className="p-5 flex flex-col justify-center gap-4">
                      <div>
                        <p className="text-sm font-medium text-charcoal_brown-500">
                          Foto principal
                        </p>
                        <p className="text-xs text-ebony-500 mt-1">
                          Usa una imagen cuadrada o horizontal. Se guardará en isahome/ISAHOME/products/.
                        </p>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest text-ebony-500 mb-1.5 block">
                          URL de imagen
                        </label>
                        <input
                          type="url"
                          value={productDraft.imageUrl}
                          onChange={(e) => setProductDraft({ ...productDraft, imageUrl: e.target.value })}
                          className="w-full px-4 py-2.5 text-sm bg-khaki_beige-900/70 border border-dry_sage-300/50 rounded-lg focus:outline-none focus:border-toffee_brown-500 text-charcoal_brown-500"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {productStatus && (
                <p className="sm:col-span-2 text-sm text-ebony-600">{productStatus}</p>
              )}
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-dry_sage-300/40 bg-khaki_beige-900 px-6 py-5">
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="inline-flex items-center justify-center gap-2 border border-dry_sage-300/60 text-charcoal_brown-500 px-6 py-3 rounded-full text-sm font-medium hover:bg-dry_sage-200/40 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={savingProduct || uploadingProductImage}
                className="inline-flex items-center justify-center gap-2 bg-charcoal_brown-500 text-khaki_beige-900 px-6 py-3 rounded-full text-sm font-medium hover:bg-charcoal_brown-400 transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {savingProduct ? 'Guardando...' : 'Guardar producto'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
