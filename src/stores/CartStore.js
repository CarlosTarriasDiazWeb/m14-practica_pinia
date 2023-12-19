import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        products: []
    }),
    getters: {
        totalSum(state) {
            return state.products.reduce((acc, product) => acc + product.price * product.count, 0);
        }
    },
    actions: {
        addCart(newProduct) {
            //Primer mirem si el producte existeix.
            if (this.products.length === 0) {
                this.products.push(newProduct);
                return;
            }
            const indexOfProduct = this.products.findIndex((product) => product.name === newProduct.name);
            if (indexOfProduct === -1) { //Si no existeix l'afegim al carro.
                this.products.push(newProduct);
            }
            else { //Si existeix incrementem les unitat d'aquest producte.
                this.products[indexOfProduct].count += newProduct.count;
            }
        },
        removeItem(item) {
            this.products = this.products.filter(product => product.name !== item.name);
        }
    }
});