<template>
    <div class="notification-wrapper" :style="{borderLeft: `5px ${color[type] || '#909399'} solid`, right: `${right}px`}">
        <p class="title">{{title}}</p>
        <p class="message">{{message}}</p>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: '通知',
            },
            message: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'info'
            },
            timeout: {
                type: Number,
                default: 2000
            }
        },
        data() {
            return {
                color: {
                    info: '#909399',
                    success: '#67C23A',
                    warn: '#E6A23C',
                    error: '#F56C6C'
                },
                right: -110,
            }
        },
        methods: {
            show() {
                this.right = 10;
                setTimeout(() => {
                    this.right = -110;
                }, this.timeout);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .notification-wrapper {
        position: absolute;
        top: 30px;
        background-color: #fff;
        width: 100px;
        transition: right 1s ease 0.5s;
    }
    
    .title {
        font-size: 12px;
        margin: 5px 10px;
    }
    
    .message {
        font-size: 14px;
        margin: 5px 10px;
    }
</style>
