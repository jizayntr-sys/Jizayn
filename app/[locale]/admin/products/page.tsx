'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Save, AlertTriangle } from 'lucide-react';
import { products as initialProducts } from '@/data/products';
import Image from 'next/image';
import { Product, Availability } from '@/types/product';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  
  // Ekleme formu için state
  const [addForm, setAddForm] = useState({
    name: '',
    price: 0,
    stock: 'InStock' as Availability
  });
  
  // Düzenleme formu için geçici state'ler
  const [editForm, setEditForm] = useState({
    name: '',
    price: 0,
    stock: 'InStock' as Availability
  });

  // Arama filtresi
  const filteredProducts = products.filter(p => 
    p.locales.tr.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleAddClick = () => {
    setAddForm({
      name: '',
      price: 0,
      stock: 'InStock'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Yeni ID oluştur (Mevcut en büyük ID + 1)
    const newId = (Math.max(...products.map(p => parseInt(p.id) || 0), 0) + 1).toString();

    // Yeni ürün objesi oluştur (Demo verisi)
    const newProduct: Product = {
      id: newId,
      category: 'decor', // Varsayılan kategori
      tags: [],
      brand: {
        name: 'Jizayn',
        url: 'https://www.jizayn.com',
        logo: 'https://www.jizayn.com/JizaynLogo.svg',
      },
      locales: {
        tr: {
          slug: addForm.name.toLowerCase().replace(/\s+/g, '-'),
          name: addForm.name,
          description: 'Yeni eklenen ürün açıklaması.',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop', // Placeholder görsel
              alt: addForm.name,
            },
          ],
          dimensions: '-',
          materials: '-',
          specifications: [],
          sku: `JZN-${newId}`,
          availability: addForm.stock,
          priceRange: {
            min: addForm.price,
            max: addForm.price,
            currency: 'TRY',
          },
          metaTitle: addForm.name,
          metaDescription: '',
          metaKeywords: [],
        },
        en: { // İngilizce için de varsayılan değerler (zorunlu alanlar)
             slug: addForm.name.toLowerCase().replace(/\s+/g, '-'),
             name: addForm.name,
             description: 'New product description.',
             images: [
               {
                 url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=1000&auto=format&fit=crop',
                 alt: addForm.name,
               },
             ],
             dimensions: '-',
             materials: '-',
             specifications: [],
             sku: `JZN-${newId}`,
             availability: addForm.stock,
             priceRange: {
               min: addForm.price,
               max: addForm.price,
               currency: 'USD',
             },
             metaTitle: addForm.name,
             metaDescription: '',
             metaKeywords: [],
        }
      },
    };

    setProducts([newProduct, ...products]);
    setIsAddModalOpen(false);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.locales.tr.name,
      price: product.locales.tr.priceRange.min,
      stock: product.locales.tr.availability
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProducts(products.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          locales: {
            ...p.locales,
            tr: { ...p.locales.tr, name: editForm.name, priceRange: { ...p.locales.tr.priceRange, min: editForm.price }, availability: editForm.stock }
          }
        };
      }
      return p;
    }));
    setIsEditModalOpen(false);
    setEditingProduct(null);
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
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <Image 
                        src={product.locales.tr.images[0].url} 
                        alt={product.locales.tr.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.locales.tr.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{product.locales.tr.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.locales.tr.priceRange.min} ₺
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.locales.tr.availability === 'InStock' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {product.locales.tr.availability === 'InStock' ? 'Stokta' : 'Tükendi'}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Düzenleme Modalı */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Ürün Düzenle</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label htmlFor="edit-product-name" className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı (TR)</label>
                <input 
                  type="text" 
                  id="edit-product-name"
                  name="name"
                  autoComplete="off"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label htmlFor="edit-product-price" className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TRY)</label>
                <input 
                  type="number" 
                  id="edit-product-price"
                  name="price"
                  autoComplete="off"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="edit-product-stock" className="block text-sm font-medium text-gray-700 mb-1">Stok Durumu</label>
                <select 
                  id="edit-product-stock"
                  name="stock"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({...editForm, stock: e.target.value as any})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="InStock">Stokta Var</option>
                  <option value="OutOfStock">Tükendi</option>
                  <option value="PreOrder">Ön Sipariş</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">İptal</button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <Save className="w-4 h-4" /> Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ekleme Modalı */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Yeni Ürün Ekle</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveAdd} className="p-6 space-y-4">
              <div>
                <label htmlFor="add-product-name" className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı (TR)</label>
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
                <label htmlFor="add-product-price" className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TRY)</label>
                <input 
                  type="number" 
                  id="add-product-price"
                  name="price"
                  autoComplete="off"
                  value={addForm.price}
                  onChange={(e) => setAddForm({...addForm, price: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="add-product-stock" className="block text-sm font-medium text-gray-700 mb-1">Stok Durumu</label>
                <select 
                  id="add-product-stock"
                  name="stock"
                  value={addForm.stock}
                  onChange={(e) => setAddForm({...addForm, stock: e.target.value as any})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="InStock">Stokta Var</option>
                  <option value="OutOfStock">Tükendi</option>
                  <option value="PreOrder">Ön Sipariş</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">İptal</button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <Plus className="w-4 h-4" /> Ekle
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