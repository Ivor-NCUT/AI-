// 认证相关函数

// 用户登录认证（支持自动注册，所有用户都是普通用户）
async function authenticateUser(username, password) {
  try {
    // 初始化默认用户（如果数据库为空）
    let users;
    try {
      users = await trickleListObjects('user', 100, true);
    } catch (error) {
      // 如果获取用户列表失败，可能是数据库尚未初始化
      console.log('Initializing database...');
      users = { items: [] };
    }
    
    // 如果数据库为空且是默认账户，创建默认用户
    if (users.items.length === 0 && username === 'admin') {
      const defaultUser = {
        username: 'admin',
        password: '123456',
        email: 'admin@company.com',
        company: '科技有限公司'
      };
      
      try {
        await trickleCreateObject('user', defaultUser);
      } catch (createError) {
        console.warn('Failed to create default user:', createError);
      }
      
      // 重新获取用户列表
      try {
        users = await trickleListObjects('user', 100, true);
      } catch (listError) {
        console.error('Failed to list users after initialization:', listError);
        users = { items: [] };
      }
    }
    
    const existingUser = users.items.find(item => 
      item.objectData && item.objectData.username === username
    );
    
    if (existingUser) {
      // 用户已存在，验证密码
      if (existingUser.objectData.password === password) {
        return {
          id: existingUser.objectId,
          username: existingUser.objectData.username,
          email: existingUser.objectData.email || `${username}@company.com`,
          company: existingUser.objectData.company || '科技有限公司'
        };
      } else {
        return null; // 密码错误
      }
    } else {
      // 新用户，自动注册
      try {
        const newUser = await trickleCreateObject('user', {
          username: username,
          password: password,
          email: `${username}@company.com`,
          company: '科技有限公司'
        });
        
        return {
          id: newUser.objectId,
          username: newUser.objectData.username,
          email: newUser.objectData.email,
          company: newUser.objectData.company
        };
      } catch (createError) {
        console.error('Failed to create new user:', createError);
        throw new Error('注册失败，请稍后重试');
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.message && error.message.includes('注册失败')) {
      throw error;
    }
    throw new Error('登录服务暂时不可用，请稍后重试');
  }
}

// 设置当前用户
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// 获取当前用户
function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

// 用户登出
function logout() {
  console.log('用户正在退出登录...');
  localStorage.removeItem('currentUser');
  // 清除所有相关数据
  localStorage.removeItem('ai_subscription_subscriptions');
  // 使用 replace 避免后退问题
  window.location.replace('login.html');
}

// 检查用户是否已登录（用于主页面）
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    // 未登录时重定向到登录页
    if (!window.location.pathname.includes('login.html')) {
      console.log('用户未登录，重定向到登录页面...');
      window.location.replace('login.html');
    }
    return null;
  }
  console.log('用户已登录:', user.username);
  return user;
}

// 检查用户是否已登录（用于登录页面）
function checkAuthForLogin() {
  const user = getCurrentUser();
  if (user) {
    // 已登录时重定向到主页
    console.log('用户已登录，重定向到主页面...');
    window.location.replace('index.html');
    return true;
  }
  return false;
}