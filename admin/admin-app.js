// 管订 NoSam - 管理后台应用逻辑
// 管理AI产品、用户和订阅的管理后台

class AdminApp {
  constructor() {
    this.currentPage = 'dashboard';
    this.isAdminLoggedIn = false;
    this.adminCredentials = {
      username: 'admin',
      password: 'admin123'
    };

    // 支持的管理员账号列表
    this.adminUsers = [
      { username: 'admin', password: 'admin123' },
      { username: 'FanHan', password: 'Kobe179008' }
    ];

    this.init();
  }

  async init() {
    this.bindEvents();
    await this.initializeStorage();
    this.loadPage('dashboard');
  }

  // 初始化存储
  async initializeStorage() {
    // 确保管理员账号存在
    const users = await trickleListObjects('user');
    const adminUser = users.items.find(user =>
      user.objectData.username === this.adminCredentials.username
    );

    if (!adminUser) {
      await trickleCreateObject('user', {
        username: this.adminCredentials.username,
        password: this.adminCredentials.password,
        email: 'admin@nosam.com',
        company: '管订 NoSam',
        role: '超级管理员'
      });
    }

    // 初始化AI产品列表（如果不存在）
    const products = await trickleListObjects('ai_product');
    if (products.items.length === 0) {
      await this.initializeDefaultProducts();
    }
  }

  // 初始化默认AI产品
  async initializeDefaultProducts() {
    const defaultProducts = [
      { name: 'ChatGPT Plus', monthlyPrice: 20, yearlyPrice: 200, currency: 'USD', description: 'OpenAI的高级版聊天机器人', status: 'active' },
      { name: 'Claude Pro', monthlyPrice: 20, yearlyPrice: 200, currency: 'USD', description: 'Anthropic的Claude高级版', status: 'active' },
      { name: 'GitHub Copilot', monthlyPrice: 10, yearlyPrice: 100, currency: 'USD', description: 'AI代码助手', status: 'active' },
      { name: 'Midjourney', monthlyPrice: 10, yearlyPrice: 96, currency: 'USD', description: 'AI图像生成工具', status: 'active' },
      { name: 'Notion AI', monthlyPrice: 10, yearlyPrice: 96, currency: 'USD', description: 'Notion AI助手', status: 'active' },
      { name: 'Kimi', monthlyPrice: 79, yearlyPrice: 790, currency: 'CNY', description: 'Kimi智能助手会员', status: 'active' },
      { name: '文心一言', monthlyPrice: 59, yearlyPrice: 590, currency: 'CNY', description: '百度文心一言会员', status: 'active' },
      { name: '通义千问', monthlyPrice: 68, yearlyPrice: 680, currency: 'CNY', description: '阿里通义千问专业版', status: 'active' },
      { name: '讯飞星火', monthlyPrice: 99, yearlyPrice: 990, currency: 'CNY', description: '讯飞星火认知大模型', status: 'active' },
      { name: '智谱清言', monthlyPrice: 49, yearlyPrice: 490, currency: 'CNY', description: '智谱AI助手', status: 'active' }
    ];

    for (const product of defaultProducts) {
      await trickleCreateObject('ai_product', product);
    }
  }

  // 绑定事件
  bindEvents() {
    // 登录表单
    document.getElementById('admin-login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    // 侧边栏导航
    document.querySelectorAll('.sidebar-item[data-page]').forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        this.loadPage(page);
      });
    });

    // 退出登录
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      this.handleLogout();
    });

    // 添加产品
    document.getElementById('add-product-btn')?.addEventListener('click', () => {
      this.openProductModal();
    });

    // 产品表单提交
    document.getElementById('product-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveProduct();
    });

    // 关闭弹窗
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeModal('product-modal');
      });
    });

    // 搜索功能
    document.getElementById('product-search')?.addEventListener('input', (e) => {
      this.searchProducts(e.target.value);
    });

    document.getElementById('user-search')?.addEventListener('input', (e) => {
      this.searchUsers(e.target.value);
    });

    document.getElementById('subscription-search')?.addEventListener('input', (e) => {
      this.searchSubscriptions(e.target.value);
    });

    // 数据导出导入
    document.getElementById('export-data-btn')?.addEventListener('click', () => {
      this.exportData();
    });

    document.getElementById('import-data-btn')?.addEventListener('click', () => {
      document.getElementById('import-file-input').click();
    });

    document.getElementById('import-file-input')?.addEventListener('change', (e) => {
      this.importData(e.target.files[0]);
    });
  }

  // 处理登录
  async handleLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    const validUser = this.adminUsers.find(user =>
      user.username === username && user.password === password
    );

    if (validUser) {
      this.isAdminLoggedIn = true;
      this.currentUser = validUser;
      document.getElementById('login-section').classList.add('hidden');
      document.getElementById('admin-section').classList.remove('hidden');
      await this.loadDashboardData();
    } else {
      this.showNotification('用户名或密码错误', 'error');
    }
  }

  // 处理退出登录
  handleLogout() {
    this.isAdminLoggedIn = false;
    this.currentUser = null;
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('admin-section').classList.add('hidden');
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
  }

  // 加载页面
  async loadPage(page) {
    this.currentPage = page;

    // 更新侧边栏状态
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => {
      p.classList.add('hidden');
    });

    // 显示当前页面
    document.getElementById(`${page}-page`)?.classList.remove('hidden');

    // 加载页面数据
    switch (page) {
      case 'dashboard':
        await this.loadDashboardData();
        break;
      case 'products':
        await this.loadProductsData();
        break;
      case 'users':
        await this.loadUsersData();
        break;
      case 'subscriptions':
        await this.loadSubscriptionsData();
        break;
    }
  }

  // 加载仪表盘数据
  async loadDashboardData() {
    const users = await trickleListObjects('user');
    const subscriptions = await trickleListObjects('subscription');
    const products = await trickleListObjects('ai_product');

    // 更新统计数据
    document.getElementById('total-users').textContent = users.items.length;
    document.getElementById('total-subscriptions').textContent = subscriptions.items.length;
    document.getElementById('total-products').textContent = products.items.filter(p => p.objectData.status === 'active').length;

    // 计算月收入
    const monthlyRevenue = subscriptions.items.reduce((total, sub) => {
      const price = parseFloat(sub.objectData.price) || 0;
      const cycle = sub.objectData.billingCycle;
      if (cycle === '年付') {
        return total + (price / 12);
      } else if (cycle === '季付') {
        return total + (price / 3);
      } else {
        return total + price;
      }
    }, 0);
    document.getElementById('monthly-revenue').textContent = `¥${monthlyRevenue.toFixed(2)}`;

    // 显示最近用户
    this.displayRecentUsers(users.items.slice(0, 5));

    // 显示热门产品
    this.displayPopularProducts(subscriptions.items, products.items);
  }

  // 显示最近用户
  displayRecentUsers(users) {
    const container = document.getElementById('recent-users');
    container.innerHTML = users.map(user => `
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
        <div>
          <p class="font-medium">${user.objectData.username}</p>
          <p class="text-sm text-gray-600">${user.objectData.email}</p>
        </div>
        <span class="text-xs text-gray-500">${new Date(user.createdAt).toLocaleDateString()}</span>
      </div>
    `).join('');
  }

  // 显示热门产品
  displayPopularProducts(subscriptions, products) {
    const productCounts = {};
    subscriptions.forEach(sub => {
      const productName = sub.objectData.productName;
      productCounts[productName] = (productCounts[productName] || 0) + 1;
    });

    const sortedProducts = Object.entries(productCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const container = document.getElementById('popular-products');
    container.innerHTML = sortedProducts.map(([name, count]) => `
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
        <div>
          <p class="font-medium">${name}</p>
          <p class="text-sm text-gray-600">订阅次数</p>
        </div>
        <span class="text-sm font-bold text-blue-600">${count}</span>
      </div>
    `).join('');

    if (sortedProducts.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center">暂无订阅数据</p>';
    }
  }

  // 加载产品数据
  async loadProductsData() {
    const products = await trickleListObjects('ai_product');
    this.displayProductsTable(products.items);
  }

  // 显示产品表格
  displayProductsTable(products) {
    const container = document.getElementById('products-table');
    container.innerHTML = `
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b">
            <th class="text-left p-3">产品名称</th>
            <th class="text-left p-3">描述</th>
            <th class="text-left p-3">月付价格</th>
            <th class="text-left p-3">年付价格</th>
            <th class="text-left p-3">货币</th>
            <th class="text-left p-3">状态</th>
            <th class="text-left p-3">操作</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(product => `
            <tr class="border-b hover:bg-gray-50">
              <td class="p-3 font-medium">${product.objectData.name}</td>
              <td class="p-3">${product.objectData.description}</td>
              <td class="p-3">${product.objectData.monthlyPrice} ${product.objectData.currency}</td>
              <td class="p-3">${product.objectData.yearlyPrice} ${product.objectData.currency}</td>
              <td class="p-3">${product.objectData.currency}</td>
              <td class="p-3">
                <span class="px-2 py-1 rounded text-xs ${
                  product.objectData.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }">
                  ${product.objectData.status === 'active' ? '启用' : '禁用'}
                </span>
              </td>
              <td class="p-3">
                <button onclick="adminApp.editProduct('${product.objectId}')"
                        class="text-blue-600 hover:text-blue-800 mr-2">
                  <i class="fas fa-edit"></i>
                </button>
                <button onclick="adminApp.deleteProduct('${product.objectId}')"
                        class="text-red-600 hover:text-red-800">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // 打开产品弹窗
  openProductModal(product = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');
    const form = document.getElementById('product-form');

    if (product) {
      title.textContent = '编辑AI产品';
      document.getElementById('product-name').value = product.objectData.name;
      document.getElementById('product-description').value = product.objectData.description;
      document.getElementById('product-monthly-price').value = product.objectData.monthlyPrice;
      document.getElementById('product-yearly-price').value = product.objectData.yearlyPrice;
      document.getElementById('product-currency').value = product.objectData.currency;
      document.getElementById('product-status').value = product.objectData.status;
      form.dataset.editingId = product.objectId;
    } else {
      title.textContent = '添加AI产品';
      form.reset();
      delete form.dataset.editingId;
    }

    modal.classList.add('show');
  }

  // 关闭弹窗
  closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
  }

  // 保存产品
  async saveProduct() {
    const form = document.getElementById('product-form');
    const editingId = form.dataset.editingId;

    const productData = {
      name: document.getElementById('product-name').value,
      description: document.getElementById('product-description').value,
      monthlyPrice: parseFloat(document.getElementById('product-monthly-price').value),
      yearlyPrice: parseFloat(document.getElementById('product-yearly-price').value),
      currency: document.getElementById('product-currency').value,
      status: document.getElementById('product-status').value
    };

    try {
      if (editingId) {
        await trickleUpdateObject('ai_product', editingId, productData);
        this.showNotification('产品更新成功', 'success');
      } else {
        await trickleCreateObject('ai_product', productData);
        this.showNotification('产品添加成功', 'success');
      }

      this.closeModal('product-modal');
      await this.loadProductsData();
    } catch (error) {
      this.showNotification('操作失败: ' + error.message, 'error');
    }
  }

  // 编辑产品
  async editProduct(productId) {
    const product = await trickleGetObject('ai_product', productId);
    this.openProductModal(product);
  }

  // 删除产品
  async deleteProduct(productId) {
    if (confirm('确定要删除这个AI产品吗？')) {
      try {
        await trickleDeleteObject('ai_product', productId);
        this.showNotification('产品删除成功', 'success');
        await this.loadProductsData();
      } catch (error) {
        this.showNotification('删除失败: ' + error.message, 'error');
      }
    }
  }

  // 搜索产品
  async searchProducts(query) {
    if (!query) {
      await this.loadProductsData();
      return;
    }

    const result = await trickleSearchObjects('ai_product', query, 'name');
    this.displayProductsTable(result.items);
  }

  // 加载用户数据
  async loadUsersData() {
    const users = await trickleListObjects('user');
    this.displayUsersTable(users.items);
  }

  // 显示用户表格
  displayUsersTable(users) {
    const container = document.getElementById('users-table');
    container.innerHTML = `
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b">
            <th class="text-left p-3">用户名</th>
            <th class="text-left p-3">邮箱</th>
            <th class="text-left p-3">公司</th>
            <th class="text-left p-3">角色</th>
            <th class="text-left p-3">注册时间</th>
            <th class="text-left p-3">订阅数</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr class="border-b hover:bg-gray-50">
              <td class="p-3 font-medium">${user.objectData.username}</td>
              <td class="p-3">${user.objectData.email}</td>
              <td class="p-3">${user.objectData.company || '-'}</td>
              <td class="p-3">
                <span class="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  ${user.objectData.role}
                </span>
              </td>
              <td class="p-3">${new Date(user.createdAt).toLocaleDateString()}</td>
              <td class="p-3">
                <span class="font-medium text-blue-600">
                  ${user.objectData.subscriptionCount || 0}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // 搜索用户
  async searchUsers(query) {
    if (!query) {
      await this.loadUsersData();
      return;
    }

    const result = await trickleSearchObjects('user', query, 'username');
    this.displayUsersTable(result.items);
  }

  // 加载订阅数据
  async loadSubscriptionsData() {
    const subscriptions = await trickleListObjects('subscription');
    this.displaySubscriptionsTable(subscriptions.items);
  }

  // 显示订阅表格
  displaySubscriptionsTable(subscriptions) {
    const container = document.getElementById('subscriptions-table');
    container.innerHTML = `
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b">
            <th class="text-left p-3">用户</th>
            <th class="text-left p-3">产品</th>
            <th class="text-left p-3">套餐</th>
            <th class="text-left p-3">计费周期</th>
            <th class="text-left p-3">价格</th>
            <th class="text-left p-3">开始时间</th>
            <th class="text-left p-3">状态</th>
          </tr>
        </thead>
        <tbody>
          ${subscriptions.map(sub => `
            <tr class="border-b hover:bg-gray-50">
              <td class="p-3 font-medium">${sub.objectData.userId || '未知'}</td>
              <td class="p-3">${sub.objectData.productName}</td>
              <td class="p-3">${sub.objectData.plan || '-'}</td>
              <td class="p-3">${sub.objectData.billingCycle || '-'}</td>
              <td class="p-3">${sub.objectData.price} ${sub.objectData.currency || 'CNY'}</td>
              <td class="p-3">${new Date(sub.objectData.startDate).toLocaleDateString()}</td>
              <td class="p-3">
                <span class="px-2 py-1 rounded text-xs ${
                  sub.objectData.autoRenew
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }">
                  ${sub.objectData.autoRenew ? '自动续费' : '手动续费'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // 搜索订阅
  async searchSubscriptions(query) {
    if (!query) {
      await this.loadSubscriptionsData();
      return;
    }

    const result = await trickleSearchObjects('subscription', query, 'productName');
    this.displaySubscriptionsTable(result.items);
  }

  // 导出数据
  exportData() {
    const data = storageManager.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nosam-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showNotification('数据导出成功', 'success');
  }

  // 导入数据
  importData(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const result = storageManager.importData(data);

        if (result.success) {
          this.showNotification('数据导入成功', 'success');
          await this.loadDashboardData();
        } else {
          this.showNotification('数据导入失败: ' + result.error, 'error');
        }
      } catch (error) {
        this.showNotification('文件格式错误', 'error');
      }
    };
    reader.readAsText(file);
  }

  // 显示通知
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// 全局变量，供HTML中的onclick事件使用
let adminApp;

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  adminApp = new AdminApp();
});