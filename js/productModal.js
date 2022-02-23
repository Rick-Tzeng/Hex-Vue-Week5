export default {
  props: ['baseUrl', 'path', 'id', 'isLoadingItem'],
  data() {
    return {
      apiBaseUrl: '',
      apiPath: '',
      modal: {},
      product: {},
      qty: 1,
    };
  },
  // 利用 watch 監聽 props 裡的 id 變化, 有變化就觸發 getProduct 方法
  watch: {
    id() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.modal.show();
      this.qty = 1; // reset 購買數量
    },
    closeModal() {
      this.modal.hide();
    },
    getProduct() {
      const apiUrl = `
        ${this.apiBaseUrl}/api/${this.apiPath}/product/${this.id}`;
      axios
        .get(apiUrl)
        .then((res) => {
          this.product = res.data.product;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
  mounted() {
    this.apiBaseUrl = this.baseUrl;
    this.apiPath = this.path;
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      backdrop: 'static',
      keyboard: false,
    });
  },
  template: `
  <div ref="modal" class="modal fade" id="productModal" tabindex="-1"
    aria-labelledby="productModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content border-0">

        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="productModalLabel">
            {{ product.title }}
          </h5>
          <button type="button" class="btn-close btn-light"
            data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">

              <div class="col-6">
                <img :src="product.imageUrl" class="img-fluid img-thumbnail"
                  alt="product.title" />
              </div>

              <div class="col-6">
                <h5><span class="badge bg-primary rounded-pill">{{ product.category }}</span></h5>
                <p>商品描述：{{ product.description }}</p>
                <p>商品內容：{{ product.content }}</p>
                <div v-if="!product.price" class="h4">
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
                <label for="numOfQty" class="form-label mt-3">購買數量</label>
                <input type="number" id="numOfQty" class="form-control 
                  text-center fw-bold" min="1" v-model.number="qty"
                  oninput="this.value = !!this.value && Math.abs(this.value) >= 1 ? Math.abs(this.value) : 1"
                  :disabled="product.id === isLoadingItem"/>
                <div class="text-end mt-3">
                  <button type="button" class="btn btn-danger"
                    @click="$emit('add-to-cart', product.id, qty)"
                    :disabled="product.id === isLoadingItem">
                      加入購物車
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>`,
};
