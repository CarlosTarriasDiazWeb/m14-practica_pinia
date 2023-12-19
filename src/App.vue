<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
//import products from "@/data/products.json";

import { useProductStore } from "./stores/ProductsStore";
import { useCartStore } from "./stores/CartStore";
import { storeToRefs } from "pinia";

//Només podem deestructurar les refs i els computed
//Fem el storeToRefs per no perdre la referència a les variables reactives del store.
const productsStore = useProductStore();
const { products } = storeToRefs(useProductStore());

productsStore.fill();
const { addCart } = useCartStore();

const add = (event, product) => {
  console.log(event);
  const newProduct = { name: product.name, count: event, price: product.price };
  addCart(newProduct);
}
</script>

<template>
  <div class="container">
    <TheHeader />
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard v-for="product in products" :key="product.name" :product="product" @addToCart="add($event, product)" />
    </ul>
  </div>
</template>
