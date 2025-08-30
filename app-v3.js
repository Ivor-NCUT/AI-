// 管订 NoSam - 主应用逻辑 v3
// 管理你的AI产品订阅，支持自定义产品、多币种和用户设置

function App() {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [subscriptions, setSubscriptions] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [editingSubscription, setEditingSubscription] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [displayCurrency, setDisplayCurrency] = React.useState(getUserDisplayCurrency());
  const [theme, setTheme] = React.useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  React.useEffect(() => {
    const initApp = async () => {
      try {
        const user = requireAuth();
        if (user) {
          setCurrentUser(user);
          await loadUserSubscriptions(user.id);
        }
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initApp();
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const loadUserSubscriptions = async (userId) => {
    try {
      const userSubs = await trickleListObjects('subscription', 100, true);
      if (userSubs && userSubs.items) {
        const filteredSubs = userSubs.items
          .filter(item => item.objectData && item.objectData.userId === userId)
          .map(item => ({
            id: item.objectId,
            productName: item.objectData.productName || item.objectData.name,
            plan: item.objectData.plan,
            billingCycle: item.objectData.billingCycle,
            currency: item.objectData.currency || 'CNY',
            price: parseFloat(item.objectData.price) || 0,
            users: parseInt(item.objectData.users) || 1,
            startDate: item.objectData.startDate,
            endDate: item.objectData.endDate,
            status: item.objectData.status || 'active',
            autoRenew: item.objectData.autoRenew !== false,
            isCustomProduct: item.objectData.isCustomProduct || false
          }));
        setSubscriptions(filteredSubs);
      } else {
        setSubscriptions([]);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      setSubscriptions([]);
    }
  };

  const addOrUpdateSubscription = async (subscription) => {
    try {
      if (editingSubscription) {
        // 更新现有订阅
        await trickleUpdateObject('subscription', editingSubscription.id, {
          ...subscription,
          userId: currentUser.id
        });
        
        setSubscriptions(prev => 
          prev.map(sub => 
            sub.id === editingSubscription.id 
              ? { ...subscription, id: editingSubscription.id }
              : sub
          )
        );
      } else {
        // 添加新订阅
        const newSubscription = await trickleCreateObject('subscription', {
          ...subscription,
          userId: currentUser.id,
          status: 'active'
        });
        
        const formattedSub = {
          id: newSubscription.objectId,
          ...subscription
        };
        
        setSubscriptions(prev => [...prev, formattedSub]);
      }
      
      setIsModalOpen(false);
      setEditingSubscription(null);
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert('保存失败，请重试');
    }
  };

  const deleteSubscription = async (id) => {
    if (!confirm('确定要删除这个订阅吗？')) return;
    
    try {
      await trickleDeleteObject('subscription', id);
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert('删除失败，请重试');
    }
  };

  const editSubscription = (subscription) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSettingsSave = (settings) => {
    setDisplayCurrency(settings.displayCurrency);
    // 强制重新渲染以更新显示
    setSubscriptions([...subscriptions]);
  };

  // 计算统计数据（支持多币种）
  const stats = React.useMemo(() => {
    return calculateStatsWithCurrency(subscriptions, displayCurrency);
  }, [subscriptions, displayCurrency]);

  // 过滤订阅
  const filteredSubscriptions = React.useMemo(() => {
    if (!searchTerm) return subscriptions;
    
    const term = searchTerm.toLowerCase();
    return subscriptions.filter(sub => 
      sub.productName.toLowerCase().includes(term) ||
      sub.plan.toLowerCase().includes(term) ||
      sub.billingCycle.toLowerCase().includes(term)
    );
  }, [subscriptions, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载系统...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 顶部导航栏 */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="logo-container p-0 overflow-hidden">
                  <img 
                    src="/assets/images/logo.png" 
                    alt="管订 NoSam" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // 如果图片加载失败，使用备用SVG
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <svg viewBox="0 0 24 24" class="w-6 h-6" fill="white">
                          <rect x="4" y="6" width="16" height="14" rx="2" fill="currentColor" opacity="0.9"/>
                          <rect x="4" y="3" width="16" height="4" rx="1" fill="currentColor"/>
                          <circle cx="8" cy="5" r="0.5" fill="white"/>
                          <circle cx="12" cy="5" r="0.5" fill="white"/>
                          <circle cx="16" cy="5" r="0.5" fill="white"/>
                          <path d="M8 11h8M8 14h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                        </svg>
                      `;
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                    管订 NoSam
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    优雅地管理你的 AI 订阅
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2.5 rounded-xl hover:bg-cyan-50 dark:hover:bg-gray-700 transition-all duration-300"
                title="设置"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-cyan-50 dark:hover:bg-gray-700 transition-all duration-300"
                title="切换主题"
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded-xl">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {currentUser.username}
                </span>
                <button
                  onClick={() => {
                    if (confirm('确定要退出登录吗？')) {
                      logout();
                    }
                  }}
                  className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                  title="退出登录"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
            我的 AI 订阅
          </h2>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">总订阅数</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">月度费用</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {formatCurrency(stats.monthlyTotal, displayCurrency)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">年度费用</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {formatCurrency(stats.yearlyTotal, displayCurrency)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">平均单价</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                  {stats.total > 0 ? formatCurrency(stats.monthlyTotal / stats.total, displayCurrency) : formatCurrency(0, displayCurrency)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 操作栏 */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="搜索订阅..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-cyan-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-200/30 dark:focus:ring-cyan-800/30 transition-all duration-300"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <button
              onClick={() => {
                setEditingSubscription(null);
                setIsModalOpen(true);
              }}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              添加订阅
            </button>
          </div>
        </div>

        {/* 订阅列表 */}
        <div className="grid gap-4">
          {filteredSubscriptions.length === 0 ? (
            <div className="card p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-lg">暂无订阅</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">点击"添加订阅"开始管理您的 AI 产品</p>
            </div>
          ) : (
            filteredSubscriptions.map(subscription => (
              <div key={subscription.id} className="card p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {subscription.productName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        subscription.status === 'active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {subscription.status === 'active' ? '活跃' : '已暂停'}
                      </span>
                      {subscription.autoRenew && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          自动续费
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">套餐</p>
                        <p className="text-gray-900 dark:text-white font-medium">{subscription.plan}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">费用</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {formatCurrency(
                            convertCurrency(subscription.price, subscription.currency, displayCurrency),
                            displayCurrency
                          )}/{subscription.billingCycle === 'monthly' ? '月' : '年'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">用户数</p>
                        <p className="text-gray-900 dark:text-white font-medium">{subscription.users}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">到期日</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {new Date(subscription.endDate).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => editSubscription(subscription)}
                      className="p-2.5 rounded-xl hover:bg-cyan-50 dark:hover:bg-gray-700 transition-all duration-300"
                      title="编辑"
                    >
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteSubscription(subscription.id)}
                      className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                      title="删除"
                    >
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* 添加/编辑订阅模态框 */}
      {isModalOpen && (
        <AddEditSubscriptionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSubscription(null);
          }}
          onSave={addOrUpdateSubscription}
          subscription={editingSubscription}
        />
      )}

      {/* 设置模态框 */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSettingsSave}
          currentCurrency={displayCurrency}
        />
      )}
    </div>
  );
}

// 渲染应用
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);