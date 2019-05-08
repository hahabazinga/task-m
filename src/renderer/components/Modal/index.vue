<template>
    <div class="bg" transition="fade">
        <div class="wrapper" :style="{width: `${width}px`, height: `${height}px`}">
            <div class="modal-close" @click="onCancel"></div>
            <p class="title">{{title}}</p>
            <div class="content" :style="{height: `calc(${height}px - 100px)`}">
                <slot name="content"></slot>
            </div>
            <div class='footer'>
                <button class='modal-button' @click="onCancel">取消</button>
                <button class='modal-button' @click="onOk">确认</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: '通知',
            },
            onCancel: {
                type: Function,
                default: () => {}
            },
            onOk: {
                type: Function,
                default: () => {}
            }
        },
        data() {
            return {
                width: 360,
                height: 280,
            }
        },
        mounted() {
            document.body.classList.add('body-fixed');
        },
        beforeDestroy() {
            document.body.classList.remove('body-fixed');
            
        },
    }
</script>

<style lang="scss" scoped>
    .bg {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 9;
        background: rgba(0, 0, 0, 0.5);
    }
    
    .wrapper {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        padding: 10px 15px;
        width: 100px;
        border-radius: 4px;
        overflow: visible;
    }
    
    .modal-close {
        width: 32px;
        height: 32px;
        position: absolute;
        right: 10px;
        background-color: #fff;
        cursor: pointer;
        background-image: url('../../assets/close.svg')
    }
    
    .title {
        font-size: 14px;
        height: 32px;
        line-height: 32px;
        padding-left: 10px;
        max-width: calc(100% - 40px);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .content{
        font-size: 12px;
        overflow: scroll;
    }
    
    .footer {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: center;
    }
    
    .modal-button {
        font-size: .8em;
        cursor: pointer;
        outline: none;
        padding: 8px 20px;
        border-radius: 2em;
        display: inline-block;
        color: #fff;
        background-color: #4fc08d;
        transition: all 0.15s ease;
        box-sizing: border-box;
        border: 1px solid #4fc08d;
        margin: 0 10px;
    }
    
    .body-fixed {
        position: fiexd;
        overflow: hidden;
    }
</style>
