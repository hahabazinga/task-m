<template>
  <div class="content-container">
    <div class="dumpster" @dragover="allowDrop" @drop="dropDelete" >
    </div>
    <div class="content-header">
    </div>
    <div class="content-body">
      <div v-for="([categoryKey, categoryConfig]) in Object.entries(taskCategory)" :key="categoryKey" class="content-body-column" @dragover="allowDrop" @drop="dragDrop($event, categoryKey)">
        <span class="content-column-title" :style="{borderBottom: `5px ${categoryConfig.color} solid`}">{{categoryConfig.text}}</span>
        <div v-for="(task, taskIndex) in filterTaskCategory(categoryKey)" :key="taskIndex + ''" class="content-column-item " draggable="true" @dragstart="dragStart($event, task)">
          <p class="task-item name">{{task.name}}</p>
          <p class="task-item priority" :style="{color: priorityColors[task.priority] || '#595959'}">{{task.priority | priorityFormatter}}</p>
          <p class="task-item description">{{task.description}}</p>
          <p class="task-item deadline">{{task.deadline | dateFormatter}}</p>
        </div>
      </div>
    </div>
    <div class="content-footer"></div>
  </div>
</template>

<script>
  import {
    getAllTasksFromDB,
    updateTask,
    removeTask
  } from '../dbService';
  import moment from 'moment';
  import taskPriorityList from '../config/taskPriorityList';
  
  export default {
    data() {
      return {
        // electron: process.versions.electron,
        // name: this.$route.name,
        // node: process.versions.node,
        // path: this.$route.path,
        // platform: require('os').platform(),
        // vue: require('vue/package.json').version,
        showDescription: false,
        dragEnterColumn: null,
        taskCategory: {
          BEFORE_START: {
            text: '未开始',
            color: '#909399',
          },
          BLOCKED: {
            text: '阻塞中',
            color: '#E6A23C',
          },
          IN_PROGRESS: {
            text: '进行中',
            color: '#409EFF',
          },
          UNDER_REVIEW: {
            text: '待确认',
            color: '#eaff8f',
          },
          DONE: {
            text: '已完成',
            color: '#67C23A',
          },
        },
        taskList: [],
        priorityColors: ['#a0d911', '#faad14', '#fa541c', '#f5222d'],
      }
    },
    created() {
      this.getAllTasks();
      this.$on('new-task', function() {
        this.getAllTasks();
      })
    },
    filters: {
      dateFormatter: function(date) {
        moment.locale('zh-cn')
        return moment(date).format('LL');
      },
      priorityFormatter: function(priority) {
        const priorityItem = taskPriorityList.find(item => item.value === priority);
        return priorityItem ? priorityItem.text : priority;
      },
    },
    methods: {

      //从数据库中获取所有任务
      getAllTasks: function() {
        getAllTasksFromDB().then(docs => {
          if (docs.length === 0) {
            this.$notify({
              title: 'warn',
              message: '暂无数据',
              type: 'warn'
            });
          }
          this.taskList = [...docs];
          console.log('db', docs);
        }).catch(e => {
          this.$notify({
            title: 'error',
            message: e.toString(),
            type: 'error'
          })
          console.error(e);
        })
      },

      // 按照种类过滤任务，并按照优先级和截止日期排序
      filterTaskCategory: function(category) {
        return this.taskList.filter(item => item.category === category).sort((a, b) => {
          if (a.priority === b.priority) {
            console.log('11', a, b, moment(a.deadline).isAfter(moment(b.deadline)))
  
            return moment(a.deadline).isAfter(moment(b.deadline)) ? 1 : -1;
          }
          return b.priority - a.priority;
        });
      },

      // 开始拖动，记录拖动的task数据
      dragStart(e, task) {
        e.dataTransfer.setData('task', JSON.stringify(task));
        },

      // 拖动放置， 根据放置的种类更新任务
      dragDrop(e, dropCategory) {
        const draggedTask = JSON.parse(e.dataTransfer.getData('task'));
        if (draggedTask.category === dropCategory) {
          return;
        }
        updateTask(draggedTask._id, {
          category: dropCategory,
        }).then(affectedDoc => {
          console.log(affectedDoc);
          this.getAllTasks();
        }).catch(e => {
          this.$notify({
            title: 'error',
            message: e.toString(),
            type: 'error'
          })
          console.error(e);
        })
      },

      // allowDrop后drop才能生效
      allowDrop(e) {
        e.preventDefault();
      },

      // 拖动到垃圾桶时删除任务
      dropDelete(e) {
        const draggedTask = JSON.parse(e.dataTransfer.getData('task'));
        removeTask(draggedTask._id).then(numDeleted => {
          console.log(numDeleted);
          this.getAllTasks();
        }).catch(e => {
          this.$notify({
            title: 'error',
            message: e.toString(),
            type: 'error'
          })
          console.error(e);
        })
      }
    }
  }
</script>

<style scoped>
  .content-header {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    margin-bottom: 5px;
  }
  .dumpster{
    width: 32px;
    height: 32px;
    position: absolute;
    right: 16px;
    top: 16px;
    background-image: url('../assets/dumpster.svg');
  }
  
  .content-body {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
  }
  
  .content-body-column {
    flex: 1 1 auto;
    flex-basis: 0;
    margin: 0 5px;
    display: flex;
    flex-direction: column;
  }
  
  .content-column-title {
    text-align: center;
    font-size: 14px;
    padding: 10px 0;
  }
  
  .border-right-left {
    border-left: 1px#DCDFE6 solid;
    border-right: 1px#DCDFE6 solid;
  }
  
  .content-container {
    font-size: 12px;
  }
  
  .content-column-item {
    padding: 5px;
    flex: 0 0 auto;
    border: 2px #E4E7ED solid;
    margin: 5px 0;
  }
  
  .task-item-name {}
  
  .task-item-description {}
</style>
