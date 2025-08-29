// 认证相关函数

// 用户登录认证（支持自动注册）
async function authenticateUser(username, password) {
  try {
    // 初始化默认用户（如果数据库为空）
    let users;
    try {
      users = await trickleListObjects('user', 100, true);
    } catch (error) {
      // 如果获取用户列表失败，可能是数据库尚未初始化，创建默认用户
      console.log('Initializing database with default users...');
      users = { items: [] };
    }
    
    // 如果数据库为空且是默认账户，创建默认用户
    if (users.items.length === 0 && (username === 'admin' || username === 'user1')) {
      const defaultUsers = [
        { username: 'admin', password: '123456', email: 'admin@company.com', company: '科技有限公司', role: '管理员' },
        { username: 'user1', password: 'password', email: 'user1@company.com', company: '科技有限公司', role: '普通用户' }
      ];
      
      for (const userData of defaultUsers) {
        try {
          await trickleCreateObject('user', userData);
        } catch (createError) {
          console.warn('Failed to create default user:', userData.username, createError);
        }
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
          company: existingUser.objectData.company || '科技有限公司',
          role: existingUser.objectData.role || '普通用户'
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
          company: '科技有限公司',
          role: '普通用户'
        });
        
        return {
          id: newUser.objectId,
          username: newUser.objectData.username,
          email: newUser.objectData.email,
          company: newUser.objectData.company,
          role: newUser.objectData.role
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
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// 检查用户是否已登录
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('login.html')) {
      window.location.href = 'login.html';
    }
    return null;
  }
  return user;
}
