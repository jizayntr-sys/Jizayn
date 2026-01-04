'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Save, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Product, Availability } from '@/types/product';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Ekleme formu için state
  const [addForm, setAddForm] = useState({
    category: 'decor',
    name: '',
    description: '',
    sku: '',
    price: 0,
    stock: 'InStock' as Availability,
    dimensionLength: '',
    dimensionWidth: '',
    dimensionHeight: '',
    materials: '',
    images: [] as File[],
    imagePreviews: [] as string[],
    altText: '',
    sortOrder: 0,
    metaTitle: '',
    metaDescription: ''
  });
  
  // Düzenleme formu için state
  const [editForm, setEditForm] = useState({
    category: 'decor',
    name: '',
    description: '',
    sku: '',
    price: 0,
    stock: 'InStock' as Availability,
    dimensionLength: '',
    dimensionWidth: '',
    dimensionHeight: '',
    materials: '',
    existingImages: [] as { url: string; alt: string }[],
    newImages: [] as File[],
    newImagePreviews: [] as string[],
    altText: '',
    sortOrder: 0,
    metaTitle: '',
    metaDescription: ''
  });

  // Ürünleri yükle
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Arama filtresi
  const filteredProducts = products.filter(p => 
    p.locales?.tr?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const res = await fetch(`/api/products/${productToDelete}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setProducts(products.filter(p => p.id !== productToDelete));
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        } else {
          alert('Ürün silinirken bir hata oluştu.');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Ürün silinirken bir hata oluştu.');
      }
    }
  };

  const handleAddClick = () => {
    setAddForm({
      category: 'decor',
      name: '',
      description: '',
      sku: '',
      price: 0,
      stock: 'InStock',
      dimensionLength: '',
      dimensionWidth: '',
      dimensionHeight: '',
      materials: '',
      images: [],
      imagePreviews: [],
      altText: '',
      sortOrder: 0,
      metaTitle: '',
      metaDescription: ''
    });
    setIsAddModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 6) {
      alert('En fazla 6 görsel seçebilirsiniz.');
      return;
    }

    // Önizleme URL'leri oluştur
    const previews = files.map(file => URL.createObjectURL(file));
    
    setAddForm({
      ...addForm,
      images: files,
      imagePreviews: previews
    });
  };

  const removeImage = (index: number) => {
    // Önizleme URL'sini temizle
    URL.revokeObjectURL(addForm.imagePreviews[index]);
    
    setAddForm({
      ...addForm,
      images: addForm.images.filter((_, i) => i !== index),
      imagePreviews: addForm.imagePreviews.filter((_, i) => i !== index)
    });
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (addForm.images.length === 0) {
      alert('En az 1 görsel seçmelisiniz.');
      return;
    }

    try {
      // Önce görselleri yükle
      const uploadFormData = new FormData();
      addForm.images.forEach(file => {
        uploadFormData.append('files', file);
      });

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        alert(errorData.error || 'Görseller yüklenirken bir hata oluştu.');
        return;
      }

      const { urls } = await uploadRes.json();

      // Slug oluştur
      const slug = addForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const sku = addForm.sku || `JZN-${Date.now()}`;
      
      // Boyutları birleştir
      const dimensions = [
        addForm.dimensionLength,
        addForm.dimensionWidth,
        addForm.dimensionHeight
      ].filter(Boolean).join(' × ') || '-';
      
      // Görsel objelerini oluştur
      const imageObjects = urls.map((url: string, index: number) => ({
        url,
        alt: addForm.altText || addForm.name + (index > 0 ? ` ${index + 1}` : ''),
      }));
      
      // Yeni ürün objesi oluştur
      const newProduct = {
        category: addForm.category,
        tags: [],
        sortOrder: addForm.sortOrder,
        brand: {
          name: 'Jizayn',
          url: 'https://www.jizayn.com',
          logo: 'https://www.jizayn.com/JizaynLogo.svg',
        },
        locales: {
          tr: {
            slug,
            name: addForm.name,
            description: addForm.description || 'Ürün açıklaması.',
            images: imageObjects,
            dimensions,
            materials: addForm.materials || '-',
            specifications: [],
            sku,
            availability: addForm.stock,
            priceRange: {
              min: addForm.price,
              max: addForm.price,
              currency: 'TRY',
            },
            metaTitle: addForm.metaTitle || addForm.name,
            metaDescription: addForm.metaDescription || '',
            metaKeywords: [],
          },
          en: {
            slug,
            name: addForm.name,
            description: addForm.description || 'New product description.',
            images: imageObjects,
            dimensions,
            materials: addForm.materials || '-',
            specifications: [],
            sku,
            availability: addForm.stock,
            priceRange: {
              min: addForm.price,
              max: addForm.price,
              currency: 'USD',
            },
            metaTitle: addForm.metaTitle || addForm.name,
            metaDescription: addForm.metaDescription || '',
            metaKeywords: [],
          },
        },
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (res.ok) {
        const { product } = await res.json();
        // Sayfayı yenile veya ürün listesini güncelle
        window.location.reload();
        
        // Önizleme URL'lerini temizle
        addForm.imagePreviews.forEach(url => URL.revokeObjectURL(url));
        
        setIsAddModalOpen(false);
      } else {
        alert('Ürün eklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Add error:', error);
      alert('Ürün eklenirken bir hata oluştu.');
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    const productData = product.locales?.tr;
    
    if (!productData) {
      alert('Ürün verisi bulunamadı.');
      return;
    }
    
    // Boyutları ayır (örn: "30 × 20 × 15" -> ["30", "20", "15"])
    const dimensions = (productData.dimensions || '').split('×').map(d => d.trim());
    
    setEditForm({
      category: product.category,
      name: productData.name,
      description: productData.description,
      sku: productData.sku,
      price: productData.priceRange.min,
      stock: productData.availability,
      dimensionLength: dimensions[0] || '',
      dimensionWidth: dimensions[1] || '',
      dimensionHeight: dimensions[2] || '',
      materials: productData.materials,
      existingImages: productData.images,
      newImages: [],
      newImagePreviews: [],
      altText: productData.images[0]?.alt || '',
      sortOrder: product.sortOrder || 0,
      metaTitle: productData.metaTitle,
      metaDescription: productData.metaDescription
    });
    setIsEditModalOpen(true);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (editForm.existingImages.length + files.length > 6) {
      alert('Toplam görsel sayısı 6\'dan fazla olamaz.');
      return;
    }

    const previews = files.map(file => URL.createObjectURL(file));
    
    setEditForm({
      ...editForm,
      newImages: [...editForm.newImages, ...files],
      newImagePreviews: [...editForm.newImagePreviews, ...previews]
    });
  };

  const removeEditExistingImage = (index: number) => {
    setEditForm({
      ...editForm,
      existingImages: editForm.existingImages.filter((_, i) => i !== index)
    });
  };

  const removeEditNewImage = (index: number) => {
    URL.revokeObjectURL(editForm.newImagePreviews[index]);
    setEditForm({
      ...editForm,
      newImages: editForm.newImages.filter((_, i) => i !== index),
      newImagePreviews: editForm.newImagePreviews.filter((_, i) => i !== index)
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      // Yeni görseller varsa yükle
      let newImageUrls: string[] = [];
      if (editForm.newImages.length > 0) {
        const uploadFormData = new FormData();
        editForm.newImages.forEach(file => {
          uploadFormData.append('files', file);
        });

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          alert('Görseller yüklenirken bir hata oluştu.');
          return;
        }

        const { urls } = await uploadRes.json();
        newImageUrls = urls;
      }

      // Tüm görselleri birleştir (mevcut + yeni)
      const allImages = [
        ...editForm.existingImages,
        ...newImageUrls.map((url: string, index: number) => ({
          url,
          alt: editForm.altText || editForm.name + ` ${editForm.existingImages.length + index + 1}`,
        }))
      ];

      // Boyutları birleştir
      const dimensions = [
        editForm.dimensionLength,
        editForm.dimensionWidth,
        editForm.dimensionHeight
      ].filter(Boolean).join(' × ') || '-';

      // Güncelleme objesi
      const updateData = {
        category: editForm.category,
        sortOrder: editForm.sortOrder,
        locales: {
          tr: {
            name: editForm.name,
            description: editForm.description,
            sku: editForm.sku,
            dimensions,
            materials: editForm.materials,
            images: allImages,
            availability: editForm.stock,
            priceRange: {
              min: editForm.price,
              max: editForm.price,
              currency: 'TRY',
            },
            metaTitle: editForm.metaTitle,
            metaDescription: editForm.metaDescription,
          },
        },
      };

      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        window.location.reload();
        editForm.newImagePreviews.forEach(url => URL.revokeObjectURL(url));
        setIsEditModalOpen(false);
        setEditingProduct(null);
      } else {
        alert('Ürün güncellenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Edit error:', error);
      alert('Ürün güncellenirken bir hata oluştu.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Arama Barı */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Ürün adı, SKU veya kategori ara..."
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Ürün Tablosu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Yükleniyor...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Henüz ürün eklenmemiş.</div>
        ) : (
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sıra</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fiyat (TR)</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stok</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => {
              const productData = product.locales?.tr;
              if (!productData) return null;
              
              return (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-700">{product.sortOrder || 0}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      {productData.images?.[0] && (
                        <Image 
                          src={productData.images[0].url} 
                          alt={productData.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{productData.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{productData.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {productData.priceRange?.min || 0} ₺
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    productData.availability === 'InStock' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {productData.availability === 'InStock' ? 'Stokta' : 'Tükendi'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEditClick(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>

      {/* Düzenleme Modalı */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">Ürün Düzenle</h3>
              <button onClick={() => {
                editForm.newImagePreviews.forEach(url => URL.revokeObjectURL(url));
                setIsEditModalOpen(false);
              }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sol Kolon */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-product-category" className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                    <select 
                      id="edit-product-category"
                      name="category"
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                      required
                    >
                      <option value="decor">Dekor</option>
                      <option value="furniture">Mobilya</option>
                      <option value="accessory">Aksesuar</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="edit-product-name" className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı (TR) *</label>
                    <input 
                      type="text" 
                      id="edit-product-name"
                      name="name"
                      autoComplete="off"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-product-sku" className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input 
                      type="text" 
                      id="edit-product-sku"
                      name="sku"
                      autoComplete="off"
                      value={editForm.sku}
                      onChange={(e) => setEditForm({...editForm, sku: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-product-price" className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TRY) *</label>
                    <input 
                      type="number" 
                      id="edit-product-price"
                      name="price"
                      autoComplete="off"
                      min="0"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-product-stock" className="block text-sm font-medium text-gray-700 mb-1">Stok Durumu *</label>
                    <select 
                      id="edit-product-stock"
                      name="stock"
                      value={editForm.stock}
                      onChange={(e) => setEditForm({...editForm, stock: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                      required
                    >
                      <option value="InStock">Stokta Var</option>
                      <option value="OutOfStock">Tükendi</option>
                      <option value="PreOrder">Ön Sipariş</option>
                      <option value="BackOrder">Sipariş Üzerine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Boyutlar (cm)</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="edit-product-dimension-length" className="block text-xs text-gray-500 mb-1">En</label>
                        <input 
                          type="number" 
                          id="edit-product-dimension-length"
                          name="dimensionLength"
                          autoComplete="off"
                          min="0"
                          step="0.1"
                          value={editForm.dimensionLength}
                          onChange={(e) => setEditForm({...editForm, dimensionLength: e.target.value})}
                          placeholder="En"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-product-dimension-width" className="block text-xs text-gray-500 mb-1">Boy</label>
                        <input 
                          type="number" 
                          id="edit-product-dimension-width"
                          name="dimensionWidth"
                          autoComplete="off"
                          min="0"
                          step="0.1"
                          value={editForm.dimensionWidth}
                          onChange={(e) => setEditForm({...editForm, dimensionWidth: e.target.value})}
                          placeholder="Boy"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-product-dimension-height" className="block text-xs text-gray-500 mb-1">Yükseklik</label>
                        <input 
                          type="number" 
                          id="edit-product-dimension-height"
                          name="dimensionHeight"
                          autoComplete="off"
                          min="0"
                          step="0.1"
                          value={editForm.dimensionHeight}
                          onChange={(e) => setEditForm({...editForm, dimensionHeight: e.target.value})}
                          placeholder="Yükseklik"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="edit-product-materials" className="block text-sm font-medium text-gray-700 mb-1">Malzemeler</label>
                    <input 
                      type="text" 
                      id="edit-product-materials"
                      name="materials"
                      autoComplete="off"
                      value={editForm.materials}
                      onChange={(e) => setEditForm({...editForm, materials: e.target.value})}
                      placeholder="Örn: Ahşap, Metal"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-product-alt-text" className="block text-sm font-medium text-gray-700 mb-1">Alt Text (SEO)</label>
                    <input 
                      type="text" 
                      id="edit-product-alt-text"
                      name="altText"
                      autoComplete="off"
                      value={editForm.altText}
                      onChange={(e) => setEditForm({...editForm, altText: e.target.value})}
                      placeholder="Görseller için açıklayıcı metin"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">Boş bırakılırsa ürün adı kullanılır</p>
                  </div>

                  <div>
                    <label htmlFor="edit-product-sort-order" className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                    <input 
                      type="number" 
                      id="edit-product-sort-order"
                      name="sortOrder"
                      autoComplete="off"
                      min="0"
                      value={editForm.sortOrder}
                      onChange={(e) => setEditForm({...editForm, sortOrder: Number(e.target.value)})}
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">Küçük numara önce gösterilir</p>
                  </div>
                </div>

                {/* Sağ Kolon */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-product-images" className="block text-sm font-medium text-gray-700 mb-1">
                      Görseller (Toplam max 6 adet)
                    </label>
                    
                    {/* Mevcut Görseller */}
                    {editForm.existingImages.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Mevcut Görseller:</p>
                        <div className="grid grid-cols-3 gap-4">
                          {editForm.existingImages.map((img, index) => (
                            <div key={index} className="relative group">
                              <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                <Image
                                  src={img.url}
                                  alt={img.alt}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 33vw, 150px"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeEditExistingImage(index)}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Yeni Görsel Ekle */}
                    {editForm.existingImages.length + editForm.newImages.length < 6 && (
                      <>
                        <input 
                          type="file" 
                          id="edit-product-images"
                          name="images"
                          accept="image/*"
                          multiple
                          onChange={handleEditImageChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <p className="mt-1 text-xs text-gray-500">JPG, PNG, GIF formatları desteklenir. Max 5MB per file.</p>
                      </>
                    )}
                    
                    {/* Yeni Görsel Önizlemeleri */}
                    {editForm.newImagePreviews.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-2">Yeni Görseller:</p>
                        <div className="grid grid-cols-3 gap-4">
                          {editForm.newImagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                <Image
                                  src={preview}
                                  alt={`New preview ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 33vw, 150px"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeEditNewImage(index)}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="edit-product-description" className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea 
                      id="edit-product-description"
                      name="description"
                      rows={5}
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      placeholder="Ürün açıklamasını buraya yazın..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-product-meta-title" className="block text-sm font-medium text-gray-700 mb-1">Meta Başlık (SEO)</label>
                    <input 
                      type="text" 
                      id="edit-product-meta-title"
                      name="metaTitle"
                      autoComplete="off"
                      value={editForm.metaTitle}
                      onChange={(e) => setEditForm({...editForm, metaTitle: e.target.value})}
                      placeholder="SEO için meta başlık"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-product-meta-description" className="block text-sm font-medium text-gray-700 mb-1">Meta Açıklama (SEO)</label>
                    <textarea 
                      id="edit-product-meta-description"
                      name="metaDescription"
                      rows={3}
                      value={editForm.metaDescription}
                      onChange={(e) => setEditForm({...editForm, metaDescription: e.target.value})}
                      placeholder="SEO için meta açıklama (150-160 karakter önerilir)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">{editForm.metaDescription.length}/160 karakter</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => {
                    editForm.newImagePreviews.forEach(url => URL.revokeObjectURL(url));
                    setIsEditModalOpen(false);
                  }} 
                  className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  İptal
                </button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  <Save className="w-4 h-4" /> Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ekleme Modalı */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">Yeni Ürün Ekle</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveAdd} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sol Kolon */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="add-product-category" className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                    <select 
                      id="add-product-category"
                      name="category"
                      value={addForm.category}
                      onChange={(e) => setAddForm({...addForm, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                      required
                    >
                      <option value="decor">Dekor</option>
                      <option value="furniture">Mobilya</option>
                      <option value="accessory">Aksesuar</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="add-product-name" className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı (TR) *</label>
                    <input 
                      type="text" 
                      id="add-product-name"
                      name="name"
                      autoComplete="off"
                      value={addForm.name}
                      onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="add-product-sku" className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input 
                      type="text" 
                      id="add-product-sku"
                      name="sku"
                      autoComplete="off"
                      value={addForm.sku}
                      onChange={(e) => setAddForm({...addForm, sku: e.target.value})}
                      placeholder="Otomatik oluşturulacak"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">Boş bırakılırsa otomatik oluşturulur</p>
                  </div>

                  <div>
                    <label htmlFor="add-product-price" className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TRY) *</label>
                    <input 
                      type="number" 
                      id="add-product-price"
                      name="price"
                      autoComplete="off"
                      min="0"
                      step="0.01"
                      value={addForm.price}
                      onChange={(e) => setAddForm({...addForm, price: Number(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="add-product-stock" className="block text-sm font-medium text-gray-700 mb-1">Stok Durumu *</label>
                    <select 
                      id="add-product-stock"
                      name="stock"
                      value={addForm.stock}
                      onChange={(e) => setAddForm({...addForm, stock: e.target.value as any})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                      required
                    >
                      <option value="InStock">Stokta Var</option>
                      <option value="OutOfStock">Tükendi</option>
                      <option value="PreOrder">Ön Sipariş</option>
                      <option value="BackOrder">Sipariş Üzerine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Boyutlar (cm)</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="add-product-dimension-length" className="block text-xs text-gray-500 mb-1">En</label>
                        <input 
                          type="number" 
                          id="add-product-dimension-length"
                          name="dimensionLength"
                          autoComplete="off"
                          min="0"
                          step="0.1"
                          value={addForm.dimensionLength}
                          onChange={(e) => setAddForm({...addForm, dimensionLength: e.target.value})}
                          placeholder="En"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="add-product-dimension-width" className="block text-xs text-gray-500 mb-1">Boy</label>
                        <input 
                          type="number" 
                          id="add-product-dimension-width"
                          name="dimensionWidth"
                          autoComplete="off"
                          min="0"
                          step="0.1"
                          value={addForm.dimensionWidth}
                          onChange={(e) => setAddForm({...addForm, dimensionWidth: e.target.value})}
                          placeholder="Boy"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="add-product-dimension-height" className="block text-xs text-gray-500 mb-1">Yükseklik</label>
                        <input 
                          type="number" 
                          id="add-product-dimension-height"
                          name="dimensionHeight"
                          autoComplete="off"
                          min="0"
                          step="0.1"
                          value={addForm.dimensionHeight}
                          onChange={(e) => setAddForm({...addForm, dimensionHeight: e.target.value})}
                          placeholder="Yükseklik"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="add-product-materials" className="block text-sm font-medium text-gray-700 mb-1">Malzemeler</label>
                    <input 
                      type="text" 
                      id="add-product-materials"
                      name="materials"
                      autoComplete="off"
                      value={addForm.materials}
                      onChange={(e) => setAddForm({...addForm, materials: e.target.value})}
                      placeholder="Örn: Ahşap, Metal"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="add-product-alt-text" className="block text-sm font-medium text-gray-700 mb-1">Alt Text (SEO)</label>
                    <input 
                      type="text" 
                      id="add-product-alt-text"
                      name="altText"
                      autoComplete="off"
                      value={addForm.altText}
                      onChange={(e) => setAddForm({...addForm, altText: e.target.value})}
                      placeholder="Görseller için açıklayıcı metin"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">Boş bırakılırsa ürün adı kullanılır</p>
                  </div>

                  <div>
                    <label htmlFor="add-product-sort-order" className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                    <input 
                      type="number" 
                      id="add-product-sort-order"
                      name="sortOrder"
                      autoComplete="off"
                      min="0"
                      value={addForm.sortOrder}
                      onChange={(e) => setAddForm({...addForm, sortOrder: Number(e.target.value)})}
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">Küçük numara önce gösterilir</p>
                  </div>
                </div>

                {/* Sağ Kolon */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="add-product-images" className="block text-sm font-medium text-gray-700 mb-1">
                      Görseller * (En fazla 6 adet)
                    </label>
                    <input 
                      type="file" 
                      id="add-product-images"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">JPG, PNG, GIF formatları desteklenir. Max 5MB per file.</p>
                    
                    {/* Görsel Önizlemeleri */}
                    {addForm.imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {addForm.imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                              <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 33vw, 150px"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="add-product-description" className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea 
                      id="add-product-description"
                      name="description"
                      rows={5}
                      value={addForm.description}
                      onChange={(e) => setAddForm({...addForm, description: e.target.value})}
                      placeholder="Ürün açıklamasını buraya yazın..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="add-product-meta-title" className="block text-sm font-medium text-gray-700 mb-1">Meta Başlık (SEO)</label>
                    <input 
                      type="text" 
                      id="add-product-meta-title"
                      name="metaTitle"
                      autoComplete="off"
                      value={addForm.metaTitle}
                      onChange={(e) => setAddForm({...addForm, metaTitle: e.target.value})}
                      placeholder="SEO için meta başlık"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">Boş bırakılırsa ürün adı kullanılır</p>
                  </div>

                  <div>
                    <label htmlFor="add-product-meta-description" className="block text-sm font-medium text-gray-700 mb-1">Meta Açıklama (SEO)</label>
                    <textarea 
                      id="add-product-meta-description"
                      name="metaDescription"
                      rows={3}
                      value={addForm.metaDescription}
                      onChange={(e) => setAddForm({...addForm, metaDescription: e.target.value})}
                      placeholder="SEO için meta açıklama (150-160 karakter önerilir)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">{addForm.metaDescription.length}/160 karakter</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">İptal</button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  <Plus className="w-4 h-4" /> Ürün Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Silme Onay Modalı */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ürünü Sil</h3>
            <p className="text-gray-600 mb-6">
              Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                İptal
              </button>
              <button 
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}