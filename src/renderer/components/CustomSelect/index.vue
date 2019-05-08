<template>
    <div class="custom-select" :style="{width: `${width}px`}">
        <input v-bind:value="displayText" class="select-input" :placeholder="placeholder" readonly @focus="selectInputFocus">
        <img class="arrow" src="../../assets/down.svg" />
        <div v-if="showOptions" class="select-option-list">
            <p class="select-option-item" v-for="option in options" @click="optionClick(option)" :key="option&&option.text">{{option.text}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            placeholder: {
                type: String,
                default: '请选择...'
            },
            width: {
                type: Number,
                default: 320
            },
            value: {
                type: String | Number | undefined,
                default: undefined
            },
            options: {
                type: Array,
                default: () => []
            }
        },
        model: {
            prop: 'value',
            event: 'change',
        },
        data() {
            return {
                showOptions: false,
            }
        },
        computed: {
            displayText: function() {
                const option = this.options.find(item => item.value === this.value);
                return option ? option.text : this.value
            }
        },
        methods: {
            optionClick: function(option) {
                const value = option.value;
                if (this.value !== value) {
                    this.$emit('change', value);
                }
                document.body.removeEventListener('click', this.bodyClickListener);
                this.showOptions = false;
    
            },
    
            // 如果是select内触发的click，则忽略，由optionClick处理；否则，隐藏options，取消body的click监听
            bodyClickListener: function(ev) {
                if (ev.path.find(item => item.className && item.className.includes('custom-select')) === undefined) {
                    document.body.removeEventListener('click', this.bodyClickListener);
                    this.showOptions = false;
                }
            },
    
            // 展示options，并给body添加click监听
            selectInputFocus: function(ev) {
    
                this.showOptions = true;
                document.body.addEventListener('click', this.bodyClickListener)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .custom-select {
        position: relative;
        color: #606266;
        display: inline-block;
    }
    
    .select-input {
        width: 100%;
        outline: none;
        height: 28px;
        line-height: 28px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        padding: 0 12px;
        &:focus {
            border-color: #409eff;
            &+.arrow {
                transform: rotate(180deg);
            }
        }
    }
    
    .arrow {
        position: absolute;
        top: 6px;
        right: -12px;
        transition: transform .5s ease 0.15s;
    }
    
    .select-option-list {
        position: absolute;
        font-size: 12px;
        top: 36px;
        width: 100%;
        transition: all .5s ease 0.15s;
        border: 1px #F2F6FC solid;
        border-radius: 5px;
        z-index: 99;
        background-color: #fff;
    }
    
    .select-option-item {
        height: 20px;
        box-sizing: border-box;
        line-height: 20px;
        width: 100%;
        margin: 5px 0;
        padding: 0 12px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
            background-color: #EBEEF5;
        }
    }
</style>


