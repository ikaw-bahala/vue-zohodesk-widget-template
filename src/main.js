import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

const app = createApp(App);

app.use(router);
app.mount("#app");

window.onload = function ()
{
    window.ZOHODESK = ZOHODESK;
    ZOHODESK.extension.onload();
}
