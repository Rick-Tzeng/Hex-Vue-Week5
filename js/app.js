import productList from './productList.js';
import cartList from './cartList.js';
import pagination from './pagination.js';
import productModal from './productModal.js';
import toast from './toast.js';

const app = Vue.createApp({
  data() {
    return {
      apiBaseUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'rick917jp6-api',
      pagination: {},
      loader: {},
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      productId: '', // 綁定給 productModal props 使用
      cartData: {
        // 儲存購物車列表資料
        carts: [],
      },
      isLoadingItem: '',
      // form 表單驗證
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    };
  },
  // 區域註冊元件
  components: {
    productList,
    cartList,
    pagination,
  },
  methods: {
    // 取得產品列表 v
    getProducts(page = 1) {
      this.loader = this.$loading.show();
      const apiUrl = `${this.apiBaseUrl}/api/${this.apiPath}/products/?page=${page}`;
      axios
        .get(apiUrl)
        .then((res) => {
          const { products, pagination } = res.data;
          this.products = products;
          this.pagination = pagination;
          this.loader.hide();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 取得購物車列表 v
    getCart() {
      const apiUrl = `${this.apiBaseUrl}/api/${this.apiPath}/cart`;
      axios
        .get(apiUrl)
        .then((res) => {
          this.cartData = res.data.data;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 加入產品至購物車 v
    addToCart(id, qty = 1) {
      this.loader = this.$loading.show();
      const data = {
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      const apiUrl = `${this.apiBaseUrl}/api/${this.apiPath}/cart`;
      axios
        .post(apiUrl, { data })
        .then((res) => {
          this.getCart();
          this.loader.hide();
          this.isLoadingItem = '';
          this.$refs.productModal.closeModal();
          this.$refs.toast.openToast(res);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 刪除購物車物品 v
    removeCartItem(id, title) {
      this.loader = this.$loading.show();
      this.isLoadingItem = id;
      const apiUrl = `${this.apiBaseUrl}/api/${this.apiPath}/cart/${id}`;
      axios
        .delete(apiUrl)
        .then((res) => {
          this.getCart();
          this.loader.hide();
          this.isLoadingItem = '';
          this.$refs.toast.openToast(res, title, false);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 清空購物車 v
    deleteAllCart() {
      this.loader = this.$loading.show();
      const apiUrl = `${this.apiBaseUrl}/api/${this.apiPath}/carts`;
      axios
        .delete(apiUrl)
        .then((res) => {
          this.getCart();
          this.loader.hide();
          this.$refs.toast.openToast(res, '購物車', false);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 更新購物車 v
    updateCartItem(item) {
      this.loader = this.$loading.show();
      const data = {
        product_id: item.product_id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      const apiUrl = `${this.apiBaseUrl}/api/${this.apiPath}/cart/${item.id}`;
      axios
        .put(apiUrl, { data })
        .then((res) => {
          this.getCart();
          this.loader.hide();
          this.isLoadingItem = '';
          this.$refs.productModal.closeModal();
          this.$refs.toast.openToast(res, item.product.title, false);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 建立訂單 v
    createOrder() {
      this.loader = this.$loading.show();
      const apiUrl = `${this.apiBaseUrl}/api/${this.apiPath}/order`;
      const order = this.form;
      axios
        .post(apiUrl, { data: order })
        .then((res) => {
          this.$refs.form.resetForm();
          this.form.message = '';
          this.getCart(); // 建立訂單完成後必須重新抓取購物車的資料庫
          this.loader.hide();
          this.$refs.toast.openToast(res, '訂單訊息', false);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    openModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

// 使用 vue loading overlay plugin
app.use(VueLoading.Plugin);

// 全域註冊 productModal, toast, 表單驗證 元件
app.component('product-modal', productModal);
app.component('toast', toast);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true,
});

app.mount('#app');
