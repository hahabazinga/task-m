import Notification from './index.vue';
const Notify = {};

Notify.install = (Vue, options) => {
    const NotificationInstance = Vue.extend(Notification);
    let currentNotify = null;
    const initInstane = () => {
        currentNotify = new NotificationInstance();
        let notifyEl = currentNotify.$mount().$el;
        document.body.appendChild(notifyEl);
    };
    Vue.prototype.$notify = (options) => {

        initInstane();
        if (typeof options === 'string') {
            currentNotify.message = options;
        } else if (typeof options === 'object' && !Array.isArray(options)) {
            Object.assign(currentNotify, options)
        }
        try {
            // 使用setTimeout在下一次事件循环中显示，否则notification的transition动画无效
            setTimeout(() => currentNotify.show(), 0);
        } catch (e) {
            console.error(e.toString())
        }
    }
};
export default Notify;