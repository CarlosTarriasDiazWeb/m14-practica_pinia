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
            //Al importar-lo així el objecte json està embolicat per un pare default, per això accedim al default (el valor són els productes).
            this.products = (await import("@/data/products.json")).default
        }
    }
});