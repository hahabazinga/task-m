<template>
  <div id="wrapper">
    <button class="button" @click="createBtnClick">新建</button>
    <drag-content ref='child'></drag-content>
    <modal v-model="task" v-if="showCreateModal" :onOk="modalOnOk" :onCancel="modalOnCancel" title="新建" v-slot:content>
      <div class='modal-create-item'>
        <span>名称</span>
        <input v-model="task.name">
      </div>
      <div class='modal-create-item'>
        <span>优先级</span>
        <custom-select v-model="task.priority" :options="taskPriorityList" :width="128" />
      </div>
      <div class='modal-create-item'>
        <span>描述</span>
        <textarea v-model="task.description" />
      </div>
  
      <div class='modal-create-item'>
        <span>deadline</span>
  
        <v-date-picker class='modal-item-deadline' width='200' mode='single' v-model='task.deadline'>
  
          <input type='text' :value="displayDeadline" expanded>
          <input>
  
        </v-date-picker>
  
      </div>
    </modal>
  </div>
</template>

<script>
  import DragContent from './DragContent';
  import taskPriorityList from '../config/taskPriorityList';
  import Modal from './Modal';
  import CustomSelect from './CustomSelect';
  import moment from 'moment';
  import {
    addTask
  } from '../dbService'
  
  export default {
    name: 'landing-page',
    components: {
      DragContent,
      Modal,
      CustomSelect,
  
    },
    data() {
      return {
        showCreateModal: false,
        task: {
          name: '',
          description: '',
          deadline: new Date(),
          priority: 1,
        },
        taskPriorityList: taskPriorityList,
      }
    },
    computed: {
      displayDeadline: function() {
        moment.locale('zh-cn');
        return moment(this.task.deadline).format('LL');
      }
    },
    methods: {

      // 新建按钮点击
      createBtnClick: function() {
        this.showCreateModal = true;
      },
      // 弹窗->取消按钮点击
      modalOnCancel: function() {
        this.showCreateModal = false;
      },

      // 弹窗->确认按钮点击，新建一个任务
      modalOnOk: function() {
        addTask({ ...this.task,
          category: 'BEFORE_START'
        }).then((docs) => {
          this.$notify({
            title: 'success',
            message: '添加成功',
            type: 'success'
          });
          this.showCreateModal = false;
          this.task = {
              name: '',
              description: '',
              deadline: new Date(),
              priority: 1,
            },
            this.$refs.child.$emit('new-task');
        }).catch(e => {
          this.$notify({
            title: 'success',
            message: '添加成功',
            type: 'success'
          })
        })
      }
    },
  
  }
</script>

<style lang='scss' scoped>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  #wrapper {
    background: radial-gradient( ellipse at top left, rgba(255, 255, 255, 1) 40%, rgba(229, 229, 229, .9) 100%);
    padding: 10px 20px;
    width: 100vw;
  }
  
  .imgsvg {
    width: 24px;
    height: 24px;
  }
  
  .button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }
  
  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
  
  .modal-create-item {
    margin: 5px;
    * {
      vertical-align: middle;
    }
    span {
      display: inline-block;
      width: 48px;
    }
  }
  
  input {
    outline: none;
    height: 28px;
    width: calc(100% - 60px);
    line-height: 28px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding: 0 12px;
  }
  
  textarea {
    outline: none;
    display: inline;
    height: 28px;
    width: calc(100% - 60px);
    line-height: 28px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    padding: 0 12px;
  }
  
  textarea:focus {
    border-color: #409eff;
  }
  
  input:focus {
    border-color: #409eff;
  }
  
  .modal-item-deadline {
    &>input {
      width: 150px;
    }
  }
</style>
