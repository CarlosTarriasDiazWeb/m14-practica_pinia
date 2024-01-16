<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
//import products from "@/data/products.json";

import { useProductStore } from "./stores/ProductsStore";
import { useCartStore } from "./stores/CartStore";
import { storeToRefs } from "pinia";

// import { reactive, ref } from "vue";
//Només podem deestructurar les refs i els computed
//Fem el storeToRefs per no perdre la referència a les variables reactives del store.
const productsStore = useProductStore();
const { products } = storeToRefs(useProductStore());
productsStore.fill();
const { addCart } = useCartStore();
const cartStore = useCartStore();




/*La funció subscribe s’executarà, per tant, capturarem l’estat 
afegint-ho a un array reactiu, transformem l’estat a cadena per evitar passar 
l’objecte a l’array, ja que els objectes passen per referència i, per tant, 
no serviria com a foto del moment. També guardarem l’estat inicial del magatzem 
fora de la funció subscribe, això ens permetrà fer el camí de tornada, observem
que podem accedir a l’estat amb la propietat $state*/
// const future = reactive([]);
// const history = reactive([])
// const doingHistory = ref(false);

// //Fem deep copy de l'estat.
// history.push(JSON.stringify(cartStore.$state));

// const undo = () => {
//   //si la longitud és 1 només tinc l'estat inicial i, per tant, no puc fer undo
//   if (history.length === 1) return

//   doingHistory.value = true
//   //en cas contrari trec l'últim estat de l'array i
//   future.push(history.pop());
//   history.pop()
//   //torno a l'estat anterior
//   //at(-1) recupera l'últim element del array
//   cartStore.$state = JSON.parse(history.at(-1));
//   doingHistory.value = false;
// }

// const redo = () => {
//   const latestState = future.pop();
//   console.log(latestState);
//   if (!latestState) return;
//   doingHistory.value = true;
//   history.push(latestState)
//   cartStore.$state = JSON.parse(latestState)
//   doingHistory.value = false;
// }


// En fer això també es llença la funció subscribe i ens 
// afegiria el canvi fet, i no ho volem, per això afegirem una excepció a la funció subscribe.

// cartStore.$subscribe((mutation, state) => {
//   if (!doingHistory.value) {
//     history.push(JSON.stringify(state));
//     // Ara hem de netejar l’array future si ja no tenim més redos que fer:
//     future.splice(0, future.length)
//     //no podem resetejar a zero ja que perdriem la reactivitat
//   }
// })


const add = (event, product) => {

  //Mostra el valor del comptador.
  //console.log(event)

  //Manera antiga 1
  // const count = parseInt(event);
  // useCartStore.$patch(state => {
  //   for (let index = 0; index < count; index++) {
  //     state.products.push(product);
  //   }
  // })


  //Passem un objecte que agrupi les props del producte que ens interessa i el comptador per facilitar la lògica del carro i ens evitem passar el comptador per paràmetre.
  const newProduct = { name: product.name, count: event, price: product.price };
  addCart(newProduct);
}

//Exemple de subscripció a una acció
//rebrà una callback function que rebrà unes opcions
//name: nom de l'acció
//store instace en el nostre cas cartStore
//args : arguments passats a l'action que son count i product
//també afegim un after hook que permet executar qualsevol
//Cosa després que l'acció retorni i resolgui,
//onError hook per saber quan passa una excepció o falla i fer nosaltres alguna acció
cartStore.$onAction(({
  name,
  store,
  args,
  after,
  onError
}) => {
  console.log(store);
  if (name === 'addCart') {
    after(() => {
      console.log(args[0])
    })
    onError((error) => {
      console.log("Hello error:", error.message);
    });

  }
})

//Exemple de suscripció a l'estat.

// cartStore.$subscribe((mutation, state) => {
//   console.log({ mutation })
//   console.log({ state })
// })


</script>

<template>
  <div class="container">
    <TheHeader />
    <div class="mb-5 flex justify-end">
      <AppButton @click="cartStore.undo()">Undo</AppButton>
      <AppButton class="ml-2" @click="cartStore.redo()">Redo</AppButton>
    </div>
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard v-for="product in products" :key="product.name" :product="product" @addToCart="add($event, product)" />
    </ul>
  </div>
</template>
