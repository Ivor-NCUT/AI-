// 数据存储层 - 使用 localStorage 作为持久化存储
// 提供与 Trickle API 兼容的接口

class StorageManager {
  constructor() {
    this.prefix = 'ai_subscription_';
    this.initializeStorage();
  }

  initializeStorage() {
    // 初始化存储结构
    if (!localStorage.getItem(this.prefix + 'initialized')) {
      localStorage.setItem(this.prefix + 'initialized', 'true');
      localStorage.setItem(this.prefix + 'users', JSON.stringify([]));
      localStorage.setItem(this.prefix + 'subscriptions', JSON.stringify([]));
      
      // 创建默认用户
      const defaultUsers = [
        {
          objectId: this.generateId(),
          objectData: {
            username: 'admin',
            password: '123456',
            email: 'admin@company.com',
            company: '科技有限公司',
            role: '管理员'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          objectId: this.generateId(),
          objectData: {
            username: 'user1',
            password: 'password',
            email: 'user1@company.com',
            company: '科技有限公司',
            role: '普通用户'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      localStorage.setItem(this.prefix + 'users', JSON.stringify(defaultUsers));
    }
  }

  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getCollection(collectionName) {
    const data = localStorage.getItem(this.prefix + collectionName + 's');
    return data ? JSON.parse(data) : [];
  }

  setCollection(collectionName, data) {
    localStorage.setItem(this.prefix + collectionName + 's', JSON.stringify(data));
  }

  async listObjects(objectType, limit = 100, includeData = true) {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const collection = this.getCollection(objectType);
          const items = collection.slice(0, limit);
          resolve({
            items: includeData ? items : items.map(item => ({ objectId: item.objectId })),
            total: collection.length,
            hasMore: collection.length > limit
          });
        } catch (error) {
          console.error('Error listing objects:', error);
          resolve({ items: [], total: 0, hasMore: false });
        }
      }, 10);
    });
  }

  async createObject(objectType, objectData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const collection = this.getCollection(objectType);
          const newObject = {
            objectId: this.generateId(),
            objectData: { ...objectData },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          collection.push(newObject);
          this.setCollection(objectType, collection);
          
          resolve(newObject);
        } catch (error) {
          console.error('Error creating object:', error);
          reject(error);
        }
      }, 10);
    });
  }

  async updateObject(objectType, objectId, updates) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const collection = this.getCollection(objectType);
          const index = collection.findIndex(item => item.objectId === objectId);
          
          if (index === -1) {
            reject(new Error('Object not found'));
            return;
          }
          
          collection[index].objectData = {
            ...collection[index].objectData,
            ...updates
          };
          collection[index].updatedAt = new Date().toISOString();
          
          this.setCollection(objectType, collection);
          resolve(collection[index]);
        } catch (error) {
          console.error('Error updating object:', error);
          reject(error);
        }
      }, 10);
    });
  }

  async deleteObject(objectType, objectId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const collection = this.getCollection(objectType);
          const filteredCollection = collection.filter(item => item.objectId !== objectId);
          
          if (collection.length === filteredCollection.length) {
            reject(new Error('Object not found'));
            return;
          }
          
          this.setCollection(objectType, filteredCollection);
          resolve({ success: true, objectId });
        } catch (error) {
          console.error('Error deleting object:', error);
          reject(error);
        }
      }, 10);
    });
  }

  async getObject(objectType, objectId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const collection = this.getCollection(objectType);
          const object = collection.find(item => item.objectId === objectId);
          
          if (!object) {
            reject(new Error('Object not found'));
            return;
          }
          
          resolve(object);
        } catch (error) {
          console.error('Error getting object:', error);
          reject(error);
        }
      }, 10);
    });
  }

  // 批量操作
  async batchCreate(objectType, objects) {
    const results = [];
    for (const obj of objects) {
      try {
        const created = await this.createObject(objectType, obj);
        results.push(created);
      } catch (error) {
        console.error('Error in batch create:', error);
      }
    }
    return results;
  }

  // 搜索功能
  async searchObjects(objectType, query, field = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const collection = this.getCollection(objectType);
          const results = collection.filter(item => {
            if (field) {
              return item.objectData[field] && 
                     item.objectData[field].toString().toLowerCase().includes(query.toLowerCase());
            } else {
              // 搜索所有字段
              return Object.values(item.objectData).some(value => 
                value && value.toString().toLowerCase().includes(query.toLowerCase())
              );
            }
          });
          
          resolve({
            items: results,
            total: results.length,
            hasMore: false
          });
        } catch (error) {
          console.error('Error searching objects:', error);
          resolve({ items: [], total: 0, hasMore: false });
        }
      }, 10);
    });
  }

  // 清空集合
  async clearCollection(objectType) {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          this.setCollection(objectType, []);
          resolve({ success: true });
        } catch (error) {
          console.error('Error clearing collection:', error);
          resolve({ success: false, error: error.message });
        }
      }, 10);
    });
  }

  // 导出数据
  exportData(objectType = null) {
    if (objectType) {
      return this.getCollection(objectType);
    }
    
    // 导出所有数据
    return {
      users: this.getCollection('user'),
      subscriptions: this.getCollection('subscription')
    };
  }

  // 导入数据
  importData(data, objectType = null) {
    try {
      if (objectType) {
        this.setCollection(objectType, data);
      } else {
        // 导入所有数据
        if (data.users) {
          this.setCollection('user', data.users);
        }
        if (data.subscriptions) {
          this.setCollection('subscription', data.subscriptions);
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Error importing data:', error);
      return { success: false, error: error.message };
    }
  }
}

// 创建全局存储管理器实例
const storageManager = new StorageManager();

// Trickle API 兼容层
async function trickleListObjects(objectType, limit = 100, includeData = true) {
  return storageManager.listObjects(objectType, limit, includeData);
}

async function trickleCreateObject(objectType, objectData) {
  return storageManager.createObject(objectType, objectData);
}

async function trickleUpdateObject(objectType, objectId, updates) {
  return storageManager.updateObject(objectType, objectId, updates);
}

async function trickleDeleteObject(objectType, objectId) {
  return storageManager.deleteObject(objectType, objectId);
}

async function trickleGetObject(objectType, objectId) {
  return storageManager.getObject(objectType, objectId);
}

async function trickleBatchCreate(objectType, objects) {
  return storageManager.batchCreate(objectType, objects);
}

async function trickleSearchObjects(objectType, query, field = null) {
  return storageManager.searchObjects(objectType, query, field);
}

async function trickleClearCollection(objectType) {
  return storageManager.clearCollection(objectType);
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    storageManager,
    trickleListObjects,
    trickleCreateObject,
    trickleUpdateObject,
    trickleDeleteObject,
    trickleGetObject,
    trickleBatchCreate,
    trickleSearchObjects,
    trickleClearCollection
  };
}

// 确保函数在全局可用
if (typeof window !== 'undefined') {
  window.trickleUpdateObject = trickleUpdateObject;
}