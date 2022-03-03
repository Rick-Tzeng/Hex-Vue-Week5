export default {
  props: ['products', 'isLoadingItem'],
  data() {
    return {
      labels: ['圖片', '商品名稱', '價格', '商品內容', '加入購物車'],
    };
  },
  template: `
  <table class="table table-striped table-hover align-middle">
    <thead>
      <tr>
        <th class="table-dark" v-for="label in labels" :key="label">{{ label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.id">
        <td>
          <img :src="product.imageUrl" :alt="product.title"
            style="width: 160px; height: 120px; object-fit: cover"/>
        </td>
        <td><span class="fw-bold h5">{{ product.title }}</span></td>
        <td>
          <div v-if="!product.price" class="h5">
            {{ product.origin_price }} 元 / {{ product.unit }}
          </div>
          <div v-else>
            <del class="text-muted">
              原價 {{ product.origin_price }}
              元 / {{ product.unit }}
            </del>
            <div class="h5">
              現在只要<span class="text-danger">{{ product.price }}</span>
              元 / {{ product.unit }}
            </div>
          </div>
        </td>
        <td>
          <button type="button" class="btn btn-outline-primary"
            @click="$emit('check-product', product.id)"
            :disabled="product.id === isLoadingItem">
            <span class="spinner-grow spinner-grow-sm"
            v-show="product.id === isLoadingItem"></span>
            詳細
          </button>
        </td>
        <td>
          <button type="button" class="btn btn-danger"
            @click="$emit('add-to-cart', product.id)"
            :disabled="product.id === isLoadingItem">
            <span class="spinner-grow spinner-grow-sm"
            v-show="product.id === isLoadingItem"></span>
            我要購買
          </button>
        </td>
      </tr>
    </tbody>
  </table>`,
};
