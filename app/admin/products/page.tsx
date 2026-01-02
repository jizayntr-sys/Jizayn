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
    metaTitle: '',
    metaDescription: ''
  });

  // Arama filtresi
  const filteredProducts = products.filter(p => 
    p.locales?.tr?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  // Ürünleri yükle
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products?locale=tr');
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error('Invalid products data:', data);
          setProducts([]);
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Fetch products error:', errorData);
        alert('Ürünler yüklenirken bir hata oluştu.');
        setProducts([]);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      alert('Ürünler yüklenirken bir hata oluştu.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
          await fetchProducts(); // Listeyi yeniden yükle
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

    const previews = files.map(file => URL.createObjectURL(file));
    
    setAddForm({
      ...addForm,
      images: files,
      imagePreviews: previews
    });
  };

  const removeImage = (index: number) => {
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
      const slug = addForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const sku = addForm.sku || `JZN-${Date.now()}`;
      
      const dimensions = [
        addForm.dimensionLength,
        addForm.dimensionWidth,
        addForm.dimensionHeight
      ].filter(Boolean).join(' × ') || '-';
      
      const imageObjects = urls.map((url: string, index: number) => ({
        url,
        alt: addForm.name + (index > 0 ? ` ${index + 1}` : ''),
      }));
      
      const newProduct = {
        category: addForm.category,
        tags: [],
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
        addForm.imagePreviews.forEach(url => URL.revokeObjectURL(url));
        setIsAddModalOpen(false);
        await fetchProducts(); // Listeyi yeniden yükle
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Ürün eklenirken bir hata oluştu.');
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
          const errorData = await uploadRes.json();
          alert(errorData.error || 'Yeni görseller yüklenirken bir hata oluştu.');
          return;
        }

        const { urls } = await uploadRes.json();
        newImageUrls = urls;
      }

      const slug = editForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      const dimensions = [
        editForm.dimensionLength,
        editForm.dimensionWidth,
        editForm.dimensionHeight
      ].filter(Boolean).join(' × ') || '-';
      
      const allImageObjects = [
        ...editForm.existingImages.map(img => ({ url: img.url, alt: img.alt })),
        ...newImageUrls.map((url: string, index: number) => ({
          url,
          alt: editForm.name + ` ${editForm.existingImages.length + index + 1}`,
        }))
      ];

      const updatedProduct = {
        category: editForm.category,
        tags: editingProduct.tags,
        brand: editingProduct.brand,
        locales: {
          tr: {
            slug,
            name: editForm.name,
            description: editForm.description || 'Ürün açıklaması.',
            images: allImageObjects,
            dimensions,
            materials: editForm.materials || '-',
            specifications: editingProduct.locales.tr.specifications || [],
            sku: editForm.sku,
            gtin: editingProduct.locales.tr.gtin,
            availability: editForm.stock,
            priceRange: {
              min: editForm.price,
              max: editForm.price,
              currency: 'TRY',
            },
            metaTitle: editForm.metaTitle || editForm.name,
            metaDescription: editForm.metaDescription || '',
            metaKeywords: editingProduct.locales.tr.metaKeywords || [],
          },
          en: editingProduct.locales.en ? {
            ...editingProduct.locales.en,
            name: editForm.name,
            images: allImageObjects,
          } : undefined,
        },
      };

      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (res.ok) {
        editForm.newImagePreviews.forEach(url => URL.revokeObjectURL(url));
        setIsEditModalOpen(false);
        await fetchProducts(); // Listeyi yeniden yükle
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Ürün güncellenirken bir hata oluştu.');
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
      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fiyat (TR)</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'Aradığınız kriterlere uygun ürün bulunamadı.' : 'Henüz ürün eklenmemiş.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const productData = product.locales?.tr;
                  if (!productData) return null;
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
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
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Düzenleme ve Ekleme Modalları - mevcut kodlarınız burada olacak */}
      {/* ... (diğer modal kodları aynı kalacak, sadece handleSaveEdit'te fetchProducts çağrısı eklendi) ... */}
    </div>
  );
}

