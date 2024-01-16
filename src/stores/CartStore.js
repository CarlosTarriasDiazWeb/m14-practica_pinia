import { defineStore, acceptHMRUpdate } from 'pinia';
import { groupBy } from "lodash";
import { useAuthUserStore } from "../stores/AuthUserStore";
import { useLocalStorage } from "@vueuse/core";

export const useCartStore = defineStore('cart', {
    historyEnabled: true,
    state: () => ({
        //products:[],
        products: useLocalStorage("CartStore:items", []),
    }),
    getters: {
        size(state) {
            return state.products.length;
        },
        totalSum(state) {
            //La funció reduce "canalitza" tots els items en un sol valor, hem d'indicar com va augmentant el acomulador (acc + product.price * product.count) i el seu valor inicial (0)
            return state.products.reduce((acc, product) => acc + product.price * product.count, 0);
        },
        totalCount(state) {
            return state.size > 0 ? state.products.reduce((acc, product) => acc + product.count, 0) : 0;
        },
        isEmpty() {
            return this.totalCount === 0
        },
        //Agrupem els productes pel seu nom.
        grouped: state => groupBy(state.products, product => product.name),
        //Retornem una funció per poder passar paràmetres.
        //Com que hem afegit la propietat count al item del carro en realitat això ens ho podem estalviar.
        groupCount: () => (name) => this.grouped[name]['count']
    },
    actions: {
        addCart(newProduct) {

            //Manera antiga 2
            // const count = parseInt(newProduct.count);

            // for (let index = 0; index < count; index++) {
            //     state.items.push(newProduct);
            // }

            //Manera nova
            //Podem agrupar directament els productes si mirem si està repetit dins els items del carro.

            //Primer mirem si el producte existeix.

            //Per forçar que al suscribir-nos es mostri l'error.
            //throw new Error("example error");

            if (this.products.length === 0) {
                //Clonem el nou objecte per evitar que es modifiquin tots els productes.
                this.products.push({ ...newProduct });
                return;
            }

            const indexOfProduct = this.products.findIndex((product) => product.name === newProduct.name);
            if (indexOfProduct === -1) { //Si no existeix l'afegim al carro.
                this.products.push({ ...newProduct });
            }
            else { //Si existeix incrementem les unitat d'aquest producte.
                this.products[indexOfProduct].count += newProduct.count;
            }
        },
        setItemCount(newCount, itemName) {
            const indexOfProduct = this.products.findIndex((product) => product.name === itemName);
            if (indexOfProduct !== -1) { //Quan trobem el item actualitzem el seu comptador
                this.products[indexOfProduct].count = newCount;
            }
        },
        removeItem(itemName) {
            this.products = this.products.filter(product => product.name !== itemName);
        },
        checkout() {
            const authUserStore = useAuthUserStore();
            alert(`${authUserStore.username} name just bought ${this.totalCount} items at a total of $${this.totalSum}`)
        }
        // reset() {
        //     this.products.length = 0;
        // }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}
