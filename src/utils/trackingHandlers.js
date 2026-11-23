/**
 * META PIXEL EVENT HANDLERS
 * Insert your fbq('track', ...) and fbq('trackCustom', ...) calls inside these functions.
 * Do not alter the function signatures so UI components remain decoupled.
 */

// ==========================================
// STANDARD EVENTS
// ==========================================

export function trackPageView(url) {
  // fbq('track','PageView');
  if (typeof window !== 'undefined') {
    console.debug('[Event Ready] PageView:', { url });
  }
}

export function trackViewContent(product) {
  // fbq('track', 'ViewContent');
  console.debug('[Event Ready] ViewContent:', {
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    content_type: 'product',
    value: product.price,
    currency: 'USD',
  });
}

export function trackSearch(searchQuery, resultsCount) {
  // fbq('track', 'Search');
  console.debug('[Event Ready] Search:', {
    search_string: searchQuery,
    results_count: resultsCount,
  });
}

export function trackAddToCart(product, quantity = 1, selectedSize = '', selectedColor = '') {
  // fbq('track', 'AddToCart');
  console.debug('[Event Ready] AddToCart:', {
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    content_type: 'product',
    value: product.price * quantity,
    currency: 'USD',
    quantity,
    variant: `${selectedSize} / ${selectedColor}`,
  });
}

export function trackInitiateCheckout(cartItems, totalValue) {
  // fbq('track', 'InitiateCheckout');
  console.debug('[Event Ready] InitiateCheckout:', {
    content_ids: cartItems.map((item) => item.id),
    num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    value: totalValue,
    currency: 'USD',
  });
}

export function trackAddPaymentInfo(paymentMethod, totalValue) {
  fbq('track', 'AddPaymentInfo');
  console.debug('[Event Ready] AddPaymentInfo:', {
    payment_method: paymentMethod,
    value: totalValue,
    currency: 'USD',
  });
}

export function trackPurchase(order) {
  // fbq('track', 'Purchase');
  console.debug('[Event Ready] Purchase:', {
    order_id: order.orderId,
    content_ids: order.items.map((item) => item.id),
    content_type: 'product',
    num_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
    value: order.total,
    currency: 'USD',
  });
}


export function trackAddToWishlist(product) {
  // fbq('track','AddToWishlist');
  console.debug('[Event Ready] AddToWishlist:', {
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    value: product.price,
    currency: 'USD',
  });
}
// ==========================================
// CUSTOM EVENTS
// ==========================================

export function trackRemoveFromCart(item) {
  fbq('trackCustom', 'RemoveFromCart');
  console.debug('[Event Ready] Custom - RemoveFromCart:', {
    content_ids: [item.id],
    content_name: item.name,
    quantity: item.quantity,
    value: item.price * item.quantity,
    currency: 'USD',
  });
}

export function trackApplyFilter(filterData) {
  fbq('trackCustom', 'ApplyFilter');
  console.debug('[Event Ready] Custom - ApplyFilter:', filterData);
}

export function trackApplyCoupon(couponCode, discountAmount, isSuccess) {
  fbq('trackCustom', 'ApplyCoupon');
  console.debug('[Event Ready] Custom - ApplyCoupon:', {
    coupon_code: couponCode,
    discount_amount: discountAmount,
    success: isSuccess,
    currency: 'USD',
  });
}

export function trackNewsletterSubscribe(email) {
  fbq('trackCustom', 'NewsletterSubscribe');
  console.debug('[Event Ready] Custom - NewsletterSubscribe:', {
    subscriber_email: email,
  });
}