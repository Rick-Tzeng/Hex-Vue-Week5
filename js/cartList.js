export default {
  props: ['cartData', 'isLoadingItem'],
  data() {
    return {
      labels: ['取消', '項次', '商品名稱', '數量', '單價／單位', '小計'],
    };
  },
  emits: ['remove-cart-item', 'update-cart-item', 'delete-all-cart'],
  template: `
  <div class="mt-5 mb-2 text-end">
    <button type="button" class="btn btn-outline-danger"
      @click="$emit('delete-all-cart')" :disabled="cartData.carts.length === 0">
      清空購物車
    </button>
  </div>
  <table class="table table-striped table-hover text-center align-middle">
    <thead>
      <tr>
        <th class="table-dark" v-for="label in labels" :key="label">{{ label }}</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="cartData.carts">
        <tr v-for="item in cartData.carts" :key="item.id">
          <td style="width:10%">
            <button type="button" class="btn btn-outline-danger"
              @click="$emit('remove-cart-item', item.id, item.product.title)"
              :disabled="item.id === isLoadingItem">
              <span class="spinner-grow spinner-grow-sm"
              v-show="item.id === isLoadingItem"></span>
              &#x2573
            </button>
          </td>
          <td style="width:15%">{{ cartData.carts.indexOf(item) + 1 }}</td>
          <td style="width:25%">{{ item.product.title }}</td>
          <td style="width:15%">
            <!-- <input type="number" class="form-control fw-bold text-center"
              min="1" v-model.number="item.qty"
              @change="$emit('update-cart-item', item)"
              :disabled="item.id === isLoadingItem"/> -->
            <select class="form-select" v-model="item.qty"
              @change="$emit('update-cart-item', item)"
              :disabled="item.id === isLoadingItem">
              <option :value="num" v-for="num in 99" :key="'num' + item.id">
                {{ num }}
              </option>
            </select>
          </td>
          <td style="width:20%">
            <div v-if="!item.product.price" class="h5">
              {{ item.product.origin_price }} 元 / {{ item.product.unit }}
            </div>
            <div v-else class="h5">
              {{ item.product.price }} 元 / {{ item.product.unit }}
            </div>
          </td>
          <td style="width:15%" class="text-end">
            <div class="h5">{{ item.total }}</div>
          </td>
        </tr>
      </template>
    </tbody>
    <tfoot>
      <tr v-if="cartData.total === cartData.final_total">
        <td colspan="5" class="h4 fw-bold text-end">總計</td>
        <td class="h4 text-end">{{ cartData.total }}</td>
      </tr>
      <tr v-else>
        <td colspan="5" class="h4 fw-bold text-success text-end">折扣價</td>
        <td class="h4 text-success text-end">{{ cartData.final_total }}</td>
      </tr>
    </tfoot>
  </table>`,
};
