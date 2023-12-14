import { defineStore } from 'pinia';

export const useProductStore = defineStore('products', {
    state: () => ({
        products: [
            {
                "name": "Plain Ol' Pineapple",
                "image": "pineapple-original.jpg",
                "price": 4
            },
            {
                "name": "Dried Pineapple",
                "image": "pineapple-dried.jpg",
                "price": 5
            },
            {
                "name": "Pineapple Gum",
                "image": "pineapple-gum.jpg",
                "price": 3
            },
            {
                "name": "Pineapple T-Shirt",
                "image": "pineapple-tshirt.jpg",
                "price": 12
            }
        ]
    }),
    getters: {
        productCount(state) {
            return state.products.length
        },
        productsCheaperThan(state) {
            return (price) => (
                state.products.filter(product =>
                    product.price < price
                )
            )
        }
    },
    actions: {
        addProduct() {
            this.products.push()
        }
    }
});