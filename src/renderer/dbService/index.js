const nedb = require('nedb');
const electron = require('electron');
const path = require('path')

const userDataPath = (electron.app || electron.remote.app).getPath('userData');


// build成客户端时文件路径与本地dev不同，需要判断当前模式
const isProductionMode = process.env.NODE_ENV === 'production';

const saveDbPath = isProductionMode ? path.join(userDataPath, 'taskM') : __static ;
const db = new nedb({
  filename: path.join(saveDbPath, "save.db"),
  autoload: true,
});

//json文件以append的形式写入，强制每5秒压缩一次文件
db.persistence.setAutocompactionInterval(5000);

// const task = {
//     id: '',// id
//     name: '',// 名称
//     description: '', // 详细描述
//     deadline: '', // 截止日期
//     priority: '', // 优先级
//     category: '', // 种类
// }

export const getAllTasksFromDB = () => {
    return new Promise((resolve, reject) => {
        db.find({}, (err, docs) => {
            if(err) {
                reject(err);
            }
            resolve(docs)
        });
    });
}
export const updateTask = (id, params) => {
    return new Promise((resolve, reject) => {
        db.update({_id: id}, {$set:params}, {}, (err, numAffected, affectedDocuments, upsert) => {
            if(err){
                reject(err);
            }
            resolve(affectedDocuments);
        })
    });
}
export const addTask = (params) => {
    return new Promise((resolve, reject) => {
        db.insert(params, (err, docs) => {
            if(err){
                reject(err)
            }
            resolve(docs);
        })
    })
    
}
export const removeTask = (id) => {
    return new Promise((resolve, reject) => {
        db.remove({_id: id}, (err, numRemoved) => {
            if(err){
                reject(err)
            }
            resolve(numRemoved);
        })
    })
    
}
