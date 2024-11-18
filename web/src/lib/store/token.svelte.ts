export let token = $state({
  value: window.localStorage.getItem("token") || "",
  set(value: string) {
    this.value = value;
    window.localStorage.setItem("token", value);
  },
  reset() {
    this.value = "";
    window.localStorage.removeItem("token");
  },
});
