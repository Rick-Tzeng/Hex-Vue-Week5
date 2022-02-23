export default {
  data() {
    return {
      toast: {},
      title: '',
      message: '',
    };
  },
  methods: {
    openToast(res, title, isAdd = true) {
      this.toast.show();
      if (isAdd) {
        this.title = res.data.data.product.title;
        this.message = res.data.message;
      } else {
        this.title = title;
        this.message = res.data.message;
      }
    },
  },
  mounted() {
    this.toast = new bootstrap.Toast(this.$refs.toast, {
      animation: true,
      autoHide: true,
      delay: 3000,
    });
  },
  template: `
  <div class="toast" ref="toast"
    style="position:fixed;top:35px;right:35px">
    <div class="toast-header bg-primary text-white">
      <strong>{{ title }}</strong>
      <button type="button" class="btn-close btn-close-dark me-2 m-auto"
        data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      <strong class="text-danger">{{ message }}</strong>
    </div>
  </div>`,
};
