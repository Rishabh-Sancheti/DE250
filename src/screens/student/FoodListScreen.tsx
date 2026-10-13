import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { useMenuStore } from '../../store/menuStore';
import { Header } from '../../components/common/Header';
import { BottomNav } from '../../components/common/BottomNav';
import { StarRating } from '../../components/common/StarRating';

export const FoodListScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showAvailableOnly,
    setShowAvailableOnly,
  } = useMenuStore();

  const categories = ['All', 'Starters', 'Main Course', 'Staples', 'Sides'];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.originHostel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchesAvail = !showAvailableOnly || (item.isAvailable && item.availablePortions > 0);

      return matchesSearch && matchesCat && matchesAvail;
    });
  }, [items, searchQuery, selectedCategory, showAvailableOnly]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      {/* Top Header matching reference */}
      <Header title="Food List" showLogo={true} showCart={true} />

      <main className="app-content">
        {/* Search Bar & Filters */}
        <div style={{ padding: '14px 18px 8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(250, 239, 224, 0.08)',
              borderRadius: '999px',
              padding: '8px 16px',
              border: '1px solid rgba(250, 239, 224, 0.15)',
              gap: '10px',
            }}
          >
            <Search size={18} color="var(--text-cream-muted)" />
            <input
              type="text"
              placeholder="Search paneer, soyabean, chapati..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-cream)',
                width: '100%',
                fontSize: '14px',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ color: 'var(--text-cream-muted)', fontSize: '13px' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              padding: '12px 0 6px',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background:
                    selectedCategory === cat
                      ? 'var(--brand-yellow)'
                      : 'rgba(255, 255, 255, 0.07)',
                  color: selectedCategory === cat ? 'var(--text-dark)' : 'var(--text-cream)',
                  border:
                    selectedCategory === cat
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Live stock count filter bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px',
              color: 'var(--text-cream-muted)',
              padding: '4px 2px 8px',
            }}
          >
            <span>Showing {filteredItems.length} menu dishes</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                style={{ accentColor: 'var(--brand-yellow)' }}
              />
              <span>In stock only</span>
            </label>
          </div>
        </div>

        {/* Menu Items List - Matches UI reference phone 2 */}
        <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredItems.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-cream-muted)',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '16px',
                marginTop: '10px',
              }}
            >
              <AlertCircle size={36} color="var(--brand-yellow)" style={{ marginBottom: '10px' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-cream)', marginBottom: '4px' }}>
                No dishes match your filter
              </p>
              <p style={{ fontSize: '12px' }}>Try resetting search or viewing all categories</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSoldOut = !item.isAvailable || item.availablePortions <= 0;

              return (
                <div
                  key={item.id}
                  onClick={() => !isSoldOut && navigate(`/student/item/${item.id}`)}
                  style={{
                    backgroundColor: 'var(--surface-cream-card)',
                    borderRadius: '22px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    color: 'var(--text-dark)',
                    cursor: isSoldOut ? 'not-allowed' : 'pointer',
                    boxShadow: 'var(--shadow-cream)',
                    position: 'relative',
                    opacity: isSoldOut ? 0.6 : 1,
                    transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSoldOut) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-cream)';
                  }}
                >
                  {/* Left: Food Image in circular / rounded rim */}
                  <div
                    style={{
                      width: '76px',
                      height: '76px',
                      minWidth: '76px',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      position: 'relative',
                      background: '#382010',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        // Fallback image in case of load failure
                        (e.target as HTMLImageElement).src = '/assets/food/paneer_tikka.jpg';
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {isSoldOut && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.65)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                        }}
                      >
                        Sold Out
                      </div>
                    )}
                  </div>

                  {/* Right Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '16px',
                            fontWeight: 700,
                            color: 'var(--text-dark)',
                            lineHeight: 1.2,
                          }}
                        >
                          {item.name}
                        </h3>
                        <p
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-dark-secondary)',
                            fontWeight: 500,
                            marginTop: '2px',
                          }}
                        >
                          (from {item.originHostel})
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            fontSize: '17px',
                            fontWeight: 800,
                            color: 'var(--text-dark)',
                            fontFamily: 'var(--font-heading)',
                          }}
                        >
                          ₹{item.price}
                        </span>
                        <div style={{ fontSize: '11px', color: 'var(--text-dark-secondary)' }}>
                          {item.servingSize}
                        </div>
                      </div>
                    </div>

                    {/* Star Rating & Portions info */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <StarRating rating={item.rating} size={14} />
                        <span style={{ fontSize: '11px', color: 'var(--text-dark-secondary)', fontWeight: 600 }}>
                          ({item.ratingCount})
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: isSoldOut
                            ? '#fee2e2'
                            : item.availablePortions < 10
                            ? '#fef3c7'
                            : '#dcfce7',
                          color: isSoldOut
                            ? '#991b1b'
                            : item.availablePortions < 10
                            ? '#92400e'
                            : '#166534',
                        }}
                      >
                        {isSoldOut ? 'Sold out' : `${item.availablePortions} left`}
                      </span>
                    </div>
                  </div>

                  {!isSoldOut && (
                    <ChevronRight size={18} color="var(--text-dark-secondary)" style={{ opacity: 0.6 }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      <BottomNav role="student" />
    </div>
  );
};
