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
import { defaultHomeContent, defaultSiteContact, initialMessages } from './data';
import type { Product, ContactMessage, HomeContent, SiteContact } from './types';
import { fetchHomeContent } from './services/homeContent';
import { fetchSiteContact } from './services/siteContact';

function App() {
  const [page, setPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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

  const addProduct = (_product: Product) => {
    // Design-only: products are kept in AdminPage local state
  };

  const deleteProduct = (_id: string) => {
    // Design-only: products are kept in AdminPage local state
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-khaki_beige-900">
        <Navbar current={page} onNavigate={navigate} />

        <main className="flex-1">
          {page === 'home' && (
            <HomePage
              content={homeContent}
              onNavigate={navigate}
              onProductClick={setSelectedProduct}
            />
          )}
          {page === 'catalog' && <CatalogPage onProductClick={setSelectedProduct} />}
          {page === 'contact' && (
            <ContactPage contact={siteContact} onMessageSent={handleMessageSent} />
          )}
          {page === 'admin' && (
            <AdminPage
              messages={messages}
              onMarkRead={markRead}
              onDeleteMessage={deleteMessage}
              onAddProduct={addProduct}
              onDeleteProduct={deleteProduct}
              homeContent={homeContent}
              onHomeContentChange={setHomeContent}
              siteContact={siteContact}
              onSiteContactChange={setSiteContact}
            />
          )}
        </main>

        <Footer contact={siteContact} onNavigate={navigate} />

        <CartDrawer onCheckout={() => navigate('contact')} />
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </CartProvider>
  );
}

export default App;
