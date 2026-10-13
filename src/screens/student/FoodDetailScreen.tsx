import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Plus, Minus, Check, AlertCircle } from 'lucide-react';
import { useMenuStore } from '../../store/menuStore';
import { useCartStore } from '../../store/cartStore';
import { StarRating } from '../../components/common/StarRating';
import { SelectedCombo, SelectedAddOn } from '../../types';

export const FoodDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const menuItem = useMenuStore((s) => s.getItemById(id || ''));
  const addItemToCart = useCartStore((s) => s.addItem);
  const cartItemCount = useCartStore((s) => s.getItemCount());

  const [quantity, setQuantity] = useState(1);
  const [selectedCombos, setSelectedCombos] = useState<SelectedCombo[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!menuItem) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'var(--text-cream-muted)', marginBottom: '16px' }}>
          Dish not found or no longer available.
        </p>
        <button
          onClick={() => navigate('/student/home')}
          style={{
            background: 'var(--brand-yellow)',
            color: 'var(--text-dark)',
            padding: '10px 20px',
            borderRadius: '999px',
            fontWeight: 700,
          }}
        >
          Back to Food List
        </button>
      </div>
    );
  }

  const isSoldOut = !menuItem.isAvailable || menuItem.availablePortions <= 0;

  // Toggle Combo selection
  const handleToggleCombo = (combo: { id: string; name: string; price: number; options: { id: string; name: string }[] }) => {
    const exists = selectedCombos.some((c) => c.comboId === combo.id);
    if (exists) {
      setSelectedCombos(selectedCombos.filter((c) => c.comboId !== combo.id));
    } else {
      setSelectedCombos([
        ...selectedCombos,
        {
          comboId: combo.id,
          comboName: combo.name,
          price: combo.price,
          selectedOptionIds: combo.options.map((o) => o.id),
        },
      ]);
    }
  };

  // Toggle Add-on
  const handleToggleAddOn = (addon: { id: string; name: string; price: number }) => {
    const exists = selectedAddOns.some((a) => a.id === addon.id);
    if (exists) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  // Price calculations
  const combosPrice = selectedCombos.reduce((sum, c) => sum + c.price, 0);
  const addOnsPrice = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = menuItem.price + combosPrice + addOnsPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = (directCheckout = false) => {
    if (isSoldOut) return;

    addItemToCart(menuItem, quantity, selectedCombos, selectedAddOns);

    if (directCheckout) {
      navigate('/student/cart');
    } else {
      setToastMessage(`Added ${quantity}x ${menuItem.name} to order!`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        paddingBottom: '90px',
      }}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--brand-yellow)',
            color: 'var(--text-dark)',
            padding: '10px 20px',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '13px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check size={16} />
          {toastMessage}
        </div>
      )}

      {/* Top Floating Controls */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="icon-btn"
          style={{ background: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(8px)' }}
          aria-label="Back"
        >
          <ArrowLeft size={20} color="#fff" />
        </button>

        <button
          onClick={() => navigate('/student/cart')}
          className="icon-btn"
          style={{ background: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(8px)' }}
          aria-label="View Cart"
        >
          <ShoppingBag size={20} color="#fff" />
          {cartItemCount > 0 && <span className="badge-counter">{cartItemCount}</span>}
        </button>
      </div>

      {/* Hero Dish Image - Matching UI reference phone 3 bowl presentation */}
      <div
        style={{
          width: '100%',
          height: '290px',
          position: 'relative',
          backgroundColor: '#30180a',
          overflow: 'hidden',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        <img
          src={menuItem.image}
          alt={menuItem.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/food/paneer_tikka.jpg';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(36,20,10,0.8) 100%)',
          }}
        />
      </div>

      {/* Food Details Card - Cream container inspired by Phone 3 */}
      <div style={{ padding: '18px 18px 10px', flex: 1 }}>
        <div
          style={{
            backgroundColor: 'var(--surface-cream-card)',
            borderRadius: '26px',
            padding: '20px',
            color: 'var(--text-dark)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          }}
        >
          {/* Title & Serving Size */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: 'var(--text-dark)',
                  lineHeight: 1.2,
                }}
              >
                {menuItem.name}{' '}
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-dark-secondary)' }}>
                  ({menuItem.servingSize})
                </span>
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-dark-secondary)', marginTop: '2px', fontWeight: 500 }}>
                Campus preparation by {menuItem.originHostel}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: 'var(--text-dark)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                ₹{menuItem.price}
              </span>
            </div>
          </div>

          {/* Rating & Availability */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '12px 0 16px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--surface-cream-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <StarRating rating={menuItem.rating} size={16} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dark)' }}>
                {menuItem.rating} ({menuItem.ratingCount} reviews)
              </span>
            </div>

            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: isSoldOut ? '#dc2626' : '#15803d',
                background: isSoldOut ? '#fee2e2' : '#dcfce7',
                padding: '3px 10px',
                borderRadius: '999px',
              }}
            >
              {isSoldOut ? 'Sold Out' : `${menuItem.availablePortions} portions left`}
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-dark-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
            {menuItem.description}
          </p>

          {/* Combos Selection Section (Identical to UI reference phone 3) */}
          {menuItem.combos && menuItem.combos.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: 'var(--text-dark)',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Meal Combos
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {menuItem.combos.map((combo) => {
                  const isChecked = selectedCombos.some((c) => c.comboId === combo.id);

                  return (
                    <div
                      key={combo.id}
                      onClick={() => handleToggleCombo(combo)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '16px',
                        background: isChecked ? '#fff7ed' : '#f5ecdf',
                        border: isChecked ? '1.5px solid var(--brand-yellow)' : '1px solid #e3d2be',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '6px',
                              border: isChecked ? 'none' : '2px solid #8c6d53',
                              backgroundColor: isChecked ? 'var(--brand-yellow)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-dark)',
                            }}
                          >
                            {isChecked && <Check size={14} strokeWidth={3} />}
                          </div>
                          <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-dark)' }}>
                            {combo.name}
                          </span>
                        </div>

                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>
                          +₹{combo.price}
                        </span>
                      </div>

                      {/* Combo Sub-items breakdown */}
                      <div style={{ paddingLeft: '30px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {combo.options.map((opt) => (
                          <div
                            key={opt.id}
                            style={{
                              fontSize: '13px',
                              color: 'var(--text-dark-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#a08060' }} />
                            <span>{opt.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons Section */}
          {menuItem.addOns && menuItem.addOns.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: 'var(--text-dark)',
                  marginBottom: '10px',
                }}
              >
                Optional Add-ons
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {menuItem.addOns.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addon.id);

                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddOn(addon)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '14px',
                        background: isChecked ? '#fff7ed' : '#f5ecdf',
                        border: isChecked ? '1.5px solid var(--brand-yellow)' : '1px solid #e3d2be',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '5px',
                            border: isChecked ? 'none' : '2px solid #8c6d53',
                            backgroundColor: isChecked ? 'var(--brand-yellow)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-dark)',
                          }}
                        >
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>
                          {addon.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>
                        +₹{addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid var(--surface-cream-border)',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>
              Quantity
            </span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#f2e3cf',
                padding: '4px 10px',
                borderRadius: '999px',
              }}
            >
              <button
                type="button"
                disabled={quantity <= 1 || isSoldOut}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: quantity <= 1 ? '#d6c2ab' : 'var(--brand-yellow)',
                  color: 'var(--text-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <Minus size={14} />
              </button>

              <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', minWidth: '16px', textAlign: 'center' }}>
                {quantity}
              </span>

              <button
                type="button"
                disabled={quantity >= menuItem.availablePortions || isSoldOut}
                onClick={() => setQuantity((q) => Math.min(menuItem.availablePortions, q + 1))}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background:
                    quantity >= menuItem.availablePortions ? '#d6c2ab' : 'var(--brand-yellow)',
                  color: 'var(--text-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  cursor: quantity >= menuItem.availablePortions ? 'not-allowed' : 'pointer',
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Checkout Action - Golden button matching Phone 3 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: '440px',
          margin: '0 auto',
          padding: '12px 18px',
          background: 'rgba(36, 20, 10, 0.96)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(250, 239, 224, 0.1)',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          zIndex: 40,
        }}
      >
        <button
          type="button"
          disabled={isSoldOut}
          onClick={() => handleAddToCart(false)}
          style={{
            padding: '14px 18px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-cream)',
            fontWeight: 700,
            fontSize: '13px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          Add to Cart
        </button>

        <button
          type="button"
          disabled={isSoldOut}
          onClick={() => handleAddToCart(true)}
          style={{
            flex: 1,
            padding: '14px 20px',
            borderRadius: '999px',
            background: isSoldOut ? '#554234' : 'var(--brand-yellow)',
            color: isSoldOut ? '#8d7563' : 'var(--text-dark)',
            fontWeight: 800,
            fontSize: '16px',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: isSoldOut ? 'none' : '0 4px 16px rgba(245, 166, 35, 0.4)',
            cursor: isSoldOut ? 'not-allowed' : 'pointer',
          }}
        >
          <span>{isSoldOut ? 'Sold Out' : 'Checkout >'}</span>
          <span>₹{totalPrice}</span>
        </button>
      </div>
    </div>
  );
};
