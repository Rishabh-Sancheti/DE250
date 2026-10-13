import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Edit2,
  Trash2,
  Search,
  Check,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Package,
} from 'lucide-react';
import { useMenuStore } from '../../store/menuStore';
import { Header } from '../../components/common/Header';
import { BottomNav } from '../../components/common/BottomNav';
import { MenuItem } from '../../types';
import { Modal } from '../../components/common/Modal';

export const StaffInventoryScreen: React.FC = () => {
  const {
    items,
    adjustPortions,
    setPortions,
    toggleAvailability,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  } = useMenuStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newServing, setNewServing] = useState('150g');
  const [newHostel, setNewHostel] = useState('Hostel 4');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Starters' | 'Main Course' | 'Staples' | 'Sides'>('Main Course');
  const [newPrice, setNewPrice] = useState(60);
  const [newStock, setNewStock] = useState(30);

  // Edit Item Modal State
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editPortions, setEditPortions] = useState(0);
  const [editServing, setEditServing] = useState('');

  const categories = ['All', 'Starters', 'Main Course', 'Staples', 'Sides'];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.originHostel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenEdit = (item: MenuItem) => {
    setEditItem(item);
    setEditPrice(item.price);
    setEditPortions(item.availablePortions);
    setEditServing(item.servingSize);
  };

  const handleSaveEdit = () => {
    if (editItem) {
      updateMenuItem(editItem.id, {
        price: Math.max(0, editPrice),
        availablePortions: Math.max(0, editPortions),
        servingSize: editServing.trim() || editItem.servingSize,
        isAvailable: editPortions > 0,
      });
      setEditItem(null);
    }
  };

  const handleCreateDish = () => {
    if (!newName.trim()) return;

    addMenuItem({
      name: newName.trim(),
      servingSize: newServing.trim() || '1 plate',
      originHostel: newHostel.trim() || 'Main Mess',
      description: newDesc.trim() || 'Freshly prepared college mess dish.',
      category: newCategory,
      price: Math.max(1, Number(newPrice)),
      availablePortions: Math.max(0, Number(newStock)),
      isAvailable: Number(newStock) > 0,
      rating: 5.0,
      ratingCount: 1,
      image: '/assets/food/paneer_tikka.jpg',
    });

    // Reset and close
    setNewName('');
    setNewDesc('');
    setIsAddModalOpen(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header title="Menu & Pantry Inventory" showLogo={false} showBack={true} showCart={false} />

      <main className="app-content">
        {/* Search & Add Dish Bar */}
        <div style={{ padding: '14px 18px 8px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(250, 239, 224, 0.08)',
                borderRadius: '999px',
                padding: '8px 14px',
                border: '1px solid rgba(250, 239, 224, 0.15)',
                gap: '8px',
              }}
            >
              <Search size={16} color="var(--text-cream-muted)" />
              <input
                type="text"
                placeholder="Search dish or hostel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-cream)',
                  width: '100%',
                  fontSize: '13px',
                }}
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                background: 'var(--brand-yellow)',
                color: 'var(--text-dark)',
                padding: '8px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              <Plus size={15} /> Add Dish
            </button>
          </div>

          {/* Category Chips */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              padding: '12px 0 4px',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  background:
                    selectedCategory === cat
                      ? 'var(--brand-yellow)'
                      : 'rgba(255, 255, 255, 0.07)',
                  color: selectedCategory === cat ? 'var(--text-dark)' : 'var(--text-cream)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Item Cards */}
        <div style={{ padding: '8px 18px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredItems.map((item) => {
            const isSoldOut = !item.isAvailable || item.availablePortions <= 0;

            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--surface-cream-card)',
                  borderRadius: '20px',
                  padding: '16px',
                  color: 'var(--text-dark)',
                  boxShadow: 'var(--shadow-cream)',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/food/paneer_tikka.jpg';
                    }}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '14px',
                      objectFit: 'cover',
                      background: '#3a2010',
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '16px',
                            fontWeight: 800,
                            color: 'var(--text-dark)',
                          }}
                        >
                          {item.name}
                        </h3>
                        <span style={{ fontSize: '11px', color: '#6e5543' }}>
                          from {item.originHostel} • {item.servingSize}
                        </span>
                      </div>

                      <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)' }}>
                        ₹{item.price}
                      </span>
                    </div>

                    {/* Stock Status Badge */}
                    <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: isSoldOut ? '#fee2e2' : item.availablePortions < 10 ? '#fef3c7' : '#dcfce7',
                          color: isSoldOut ? '#991b1b' : item.availablePortions < 10 ? '#92400e' : '#166534',
                        }}
                      >
                        {isSoldOut ? 'Sold Out' : `${item.availablePortions} portions left`}
                      </span>

                      <button
                        onClick={() => toggleAvailability(item.id)}
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: item.isAvailable ? '#15803d' : '#b91c1c',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          background: 'none',
                          padding: '2px 4px',
                        }}
                      >
                        {item.isAvailable ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        <span>{item.isAvailable ? 'Active' : 'Disabled'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stock Portion Controls & Edit Button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid #ebd9c5',
                  }}
                >
                  {/* Quick Adjust Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#8c6d53' }}>
                      Stock:
                    </span>

                    <button
                      onClick={() => adjustPortions(item.id, -5)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: '#f2e3cf',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--text-dark)',
                      }}
                      title="Remove 5 portions"
                    >
                      -5
                    </button>

                    <button
                      onClick={() => adjustPortions(item.id, -1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#f2e3cf',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: 'var(--text-dark)',
                      }}
                    >
                      <Minus size={12} />
                    </button>

                    <span style={{ fontSize: '14px', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
                      {item.availablePortions}
                    </span>

                    <button
                      onClick={() => adjustPortions(item.id, 1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'var(--brand-yellow)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: 'var(--text-dark)',
                      }}
                    >
                      <Plus size={12} />
                    </button>

                    <button
                      onClick={() => adjustPortions(item.id, 5)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'var(--brand-yellow)',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--text-dark)',
                      }}
                      title="Add 5 portions"
                    >
                      +5
                    </button>
                  </div>

                  {/* Edit details */}
                  <button
                    onClick={() => handleOpenEdit(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(56, 32, 16, 0.08)',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--text-dark)',
                    }}
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Edit Dish Modal */}
      <Modal
        isOpen={!!editItem}
        title={`Edit ${editItem?.name}`}
        onClose={() => setEditItem(null)}
        confirmLabel="Save Changes"
        onConfirm={handleSaveEdit}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-cream-muted)', display: 'block', marginBottom: '4px' }}>
              Price (₹)
            </label>
            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(250, 239, 224, 0.2)',
                color: 'var(--text-cream)',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-cream-muted)', display: 'block', marginBottom: '4px' }}>
              Available Portions Count
            </label>
            <input
              type="number"
              value={editPortions}
              onChange={(e) => setEditPortions(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(250, 239, 224, 0.2)',
                color: 'var(--text-cream)',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-cream-muted)', display: 'block', marginBottom: '4px' }}>
              Serving Size (e.g. 100g, 2 pcs)
            </label>
            <input
              type="text"
              value={editServing}
              onChange={(e) => setEditServing(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(250, 239, 224, 0.2)',
                color: 'var(--text-cream)',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
      </Modal>

      {/* Add New Dish Modal */}
      <Modal
        isOpen={isAddModalOpen}
        title="Add New Mess Dish"
        onClose={() => setIsAddModalOpen(false)}
        confirmLabel="Add to Menu"
        onConfirm={handleCreateDish}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-cream-muted)', display: 'block', marginBottom: '4px' }}>
              Dish Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rajma Chawal"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(250, 239, 224, 0.2)',
                color: 'var(--text-cream)',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-cream-muted)', display: 'block', marginBottom: '4px' }}>
                Price (₹)
              </label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(250, 239, 224, 0.2)',
                  color: 'var(--text-cream)',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-cream-muted)', display: 'block', marginBottom: '4px' }}>
                Initial Stock
              </label>
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(250, 239, 224, 0.2)',
                  color: 'var(--text-cream)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-cream-muted)', display: 'block', marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(250, 239, 224, 0.2)',
                  color: 'var(--text-cream)',
                }}
              >
                <option value="Starters">Starters</option>
                <option value="Main Course">Main Course</option>
                <option value="Staples">Staples</option>
                <option value="Sides">Sides</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-cream-muted)', display: 'block', marginBottom: '4px' }}>
                Origin Hostel
              </label>
              <input
                type="text"
                value={newHostel}
                onChange={(e) => setNewHostel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(250, 239, 224, 0.2)',
                  color: 'var(--text-cream)',
                }}
              />
            </div>
          </div>
        </div>
      </Modal>

      <BottomNav role="staff" />
    </div>
  );
};
