export const emitCartUpdate = () => {
  window.dispatchEvent(new Event('cart-updated'));
};