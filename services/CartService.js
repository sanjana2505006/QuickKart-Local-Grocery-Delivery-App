class CartServiceImpl {
    constructor() {
        this.cart = [];
        this.listeners = [];
    }

    addItems(items) {
        items.forEach(item => {
            const existing = this.cart.find(ci => ci.name === item.name);
            if (existing) {
                existing.quantity = (existing.quantity || 0) + (item.quantity || 1);
            } else {
                this.cart.push({ ...item, quantity: item.quantity || 1 });
            }
        });
        this.notifyListeners();
    }

    addItem(item) {
        const existing = this.cart.find(ci => ci.name === item.name);
        if (existing) {
            existing.quantity = (existing.quantity || 0) + 1;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }
        this.notifyListeners();
    }

    removeItem(itemName) {
        this.cart = this.cart.filter(ci => ci.name !== itemName);
        this.notifyListeners();
    }

    updateQuantity(itemName, qty) {
        const it = this.cart.find(ci => ci.name === itemName);
        if (it) {
            it.quantity = qty;
            if (it.quantity <= 0) {
                this.removeItem(itemName);
            } else {
                this.notifyListeners();
            }
        }
    }

    getCart() {
        return this.cart;
    }

    getTotal() {
        return this.cart.reduce((total, item) => {
            const num = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
            return total + (num * (item.quantity || 0));
        }, 0);
    }

    clearCart() {
        this.cart = [];
        this.notifyListeners();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        // emit initial state
        listener(this.cart);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(l => l(this.cart));
    }

    getItemCount() {
        return this.cart.reduce((c, it) => c + (it.quantity || 0), 0);
    }
}

export const CartService = new CartServiceImpl();
