import { useEffect, useState } from 'react';
import { CartProvider } from './cart';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import {
  categories as defaultCategoryNames,
  defaultHomeContent,
  defaultSiteContact,
  initialMessages,
  products as defaultProducts,
} from './data';
import type { Product, ContactMessage, HomeContent, SiteContact, ProductCategory } from './types';
import { fetchHomeContent } from './services/homeContent';
import { fetchSiteContact } from './services/siteContact';
import { fetchProducts } from './services/products';
import { fetchCategories } from './services/categories';

function App() {
  const [page, setPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [categories, setCategories] = useState<ProductCategory[]>(
    defaultCategoryNames.map((name, index) => ({
      id: name,
      name,
      sortOrder: (index + 1) * 10,
    }))
  );
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [homeContent, setHomeContent] = useState<HomeContent>(defaultHomeContent);
  const [siteContact, setSiteContact] = useState<SiteContact>(defaultSiteContact);

  useEffect(() => {
    let ignore = false;

    fetchHomeContent()
      .then((content) => {
        if (!ignore && content) setHomeContent(content);
      })
      .catch((error) => {
        console.error('No se pudo cargar el contenido del Home:', error);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    fetchCategories()
      .then((remoteCategories) => {
        if (!ignore && remoteCategories && remoteCategories.length > 0) {
          setCategories(remoteCategories);
        }
      })
      .catch((error) => {
        console.error('No se pudieron cargar las categorías:', error);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    fetchProducts()
      .then((remoteProducts) => {
        if (!ignore && remoteProducts) {
          setProducts(remoteProducts);
        }
      })
      .catch((error) => {
        console.error('No se pudieron cargar los productos:', error);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    fetchSiteContact()
      .then((contact) => {
        if (!ignore && contact) setSiteContact(contact);
      })
      .catch((error) => {
        console.error('No se pudo cargar el contacto del sitio:', error);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const navigate = (p: string) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMessageSent = (msg: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) => {
    const newMsg: ContactMessage = {
      id: `m${Date.now()}`,
      name: msg.name,
      email: msg.email,
      phone: msg.phone,
      message: msg.message,
      date: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const markRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const upsertProduct = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists
        ? prev.map((p) => (p.id === product.id ? product : p))
        : [product, ...prev];
    });
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const upsertCategory = (category: ProductCategory) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id);
      const next = exists
        ? prev.map((c) => (c.id === category.id ? category : c))
        : [...prev, category];
      return next.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
    });
  };

  const removeCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-khaki_beige-900">
        <Navbar current={page} onNavigate={navigate} />

        <main className="flex-1">
          {page === 'home' && (
            <HomePage
              content={homeContent}
              products={products}
              onNavigate={navigate}
              onProductClick={setSelectedProduct}
            />
          )}
          {page === 'catalog' && (
            <CatalogPage
              products={products}
              categories={categories.map((category) => category.name)}
              onProductClick={setSelectedProduct}
            />
          )}
          {page === 'contact' && (
            <ContactPage contact={siteContact} onMessageSent={handleMessageSent} />
          )}
          {page === 'admin' && (
            <AdminPage
              messages={messages}
              onMarkRead={markRead}
              onDeleteMessage={deleteMessage}
              products={products}
              categories={categories}
              onProductSaved={upsertProduct}
              onProductDeleted={removeProduct}
              onCategorySaved={upsertCategory}
              onCategoryDeleted={removeCategory}
              homeContent={homeContent}
              onHomeContentChange={setHomeContent}
              siteContact={siteContact}
              onSiteContactChange={setSiteContact}
            />
          )}
        </main>

        <Footer contact={siteContact} onNavigate={navigate} />

        <CartDrawer whatsappPhone={siteContact.phone} />
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </CartProvider>
  );
}

export default App;
