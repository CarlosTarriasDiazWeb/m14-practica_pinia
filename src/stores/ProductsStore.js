import { defineStore } from 'pinia';
//import products from "@/data/products.json";

export const useProductStore = defineStore('products', {
    state: () => ({
        products: []
    }),
    getters: {
    },
    actions: {
        async fill() {
            //Fem el import dinàmic per simular la petició asíncrona
            this.products = (await import("@/data/products.json")).default
        }
    }
});