class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-black"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    console.log('App component rendering...');
    const [currentUser, setCurrentUser] = React.useState(null);
    const [subscriptions, setSubscriptions] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [theme, setTheme] = React.useState(() => {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    });

    React.useEffect(() => {
      const initApp = async () => {
        try {
          // Check authentication
          const user = requireAuth();
          if (user) {
            setCurrentUser(user);
            await initializeDatabase();
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

    // Initialize database tables if they don't exist
    const initializeDatabase = async () => {
      try {
        // Try to list subscriptions to check if table exists
        await trickleListObjects('subscription', 1, true);
      } catch (error) {
        console.log('Initializing subscription table...');
        // If error occurs, the table might not exist, but that's okay
        // The trickle database will create it when we first add data
      }
    };

    React.useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    React.useEffect(() => {
      const fadeElements = document.querySelectorAll('.fade-in');
      fadeElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('fade-in-active');
        }, index * 100);
      });
    }, []);

    const toggleTheme = () => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const loadUserSubscriptions = async (userId) => {
      try {
        const userSubs = await trickleListObjects('subscription', 100, true);
        if (userSubs && userSubs.items) {
          const filteredSubs = userSubs.items
            .filter(item => item.objectData && item.objectData.userId === userId)
            .map(item => ({
              id: item.objectId,
              name: item.objectData.name,
              plan: item.objectData.plan,
              billingCycle: item.objectData.billingCycle,
              price: parseFloat(item.objectData.price) || 0,
              users: parseInt(item.objectData.users) || 1,
              startDate: item.objectData.startDate?.split('T')[0] || item.objectData.startDate,
              endDate: item.objectData.endDate?.split('T')[0] || item.objectData.endDate,
              status: item.objectData.status || '激活'
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

    const addSubscription = async (subscription) => {
      try {
        const newSubscription = await trickleCreateObject('subscription', {
          ...subscription,
          userId: currentUser.id,
          status: '激活'
        });
        
        const formattedSub = {
          id: newSubscription.objectId,
          name: newSubscription.objectData.name,
          plan: newSubscription.objectData.plan,
          billingCycle: newSubscription.objectData.billingCycle,
          price: parseFloat(newSubscription.objectData.price) || 0,
          users: parseInt(newSubscription.objectData.users) || 1,
          startDate: newSubscription.objectData.startDate?.split('T')[0] || newSubscription.objectData.startDate,
          endDate: newSubscription.objectData.endDate?.split('T')[0] || newSubscription.objectData.endDate,
          status: newSubscription.objectData.status || '激活'
        };
        
        setSubscriptions(prev => [...prev, formattedSub]);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error adding subscription:', error);
      }
    };

    const deleteSubscription = async (id) => {
      try {
        await trickleDeleteObject('subscription', id);
        setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    };

    const stats = calculateStats(subscriptions);

    if (isLoading || !currentUser) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">加载中...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[var(--bg-primary)]" data-name="app" data-file="app.js">
        <Header theme={theme} toggleTheme={toggleTheme} currentUser={currentUser} />
        
        <main className="container mx-auto px-6 py-8">
          <div className="mb-8 fade-in">
            <h1 className="text-4xl font-bold text-gradient mb-2">AI产品订阅管理</h1>
            <p className="text-[var(--text-secondary)]">统一管理企业AI产品订阅，优化成本配置</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="总订阅数" 
              value={stats.totalSubscriptions} 
              icon="package"
              className="fade-in"
            />
            <StatsCard 
              title="月度支出" 
              value={`¥${stats.monthlyCost.toLocaleString()}`} 
              icon="calendar"
              className="fade-in"
            />
            <StatsCard 
              title="年度支出" 
              value={`¥${stats.yearlyCost.toLocaleString()}`} 
              icon="trending-up"
              className="fade-in"
            />
            <StatsCard 
              title="平均单价" 
              value={`¥${stats.averageCost.toLocaleString()}`} 
              icon="dollar-sign"
              className="fade-in"
            />
          </div>

          <div className="flex justify-between items-center mb-6 fade-in">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">订阅列表</h2>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  const sampleSub = {
                    name: "ChatGPT Plus",
                    plan: "个人版", 
                    billingCycle: "月付",
                    price: 20,
                    users: 1,
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: calculateEndDate(new Date().toISOString().split('T')[0], "月付")
                  };
                  addSubscription(sampleSub);
                }}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <div className="icon-zap text-sm"></div>
                快速添加样例
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <div className="icon-plus text-lg"></div>
                添加订阅
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription, index) => (
              <SubscriptionCard 
                key={subscription.id} 
                subscription={subscription} 
                onDelete={deleteSubscription}
                className={`fade-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))}
            
            {subscriptions.length === 0 && (
              <div className="col-span-full text-center py-12 fade-in">
                <div className="icon-inbox text-6xl text-[var(--text-muted)] mb-4 mx-auto w-fit"></div>
                <h3 className="text-xl font-medium text-[var(--text-secondary)] mb-2">暂无订阅</h3>
                <p className="text-[var(--text-muted)]">点击上方按钮添加您的第一个AI产品订阅</p>
              </div>
            )}
          </div>
        </main>

        {isModalOpen && (
          <AddSubscriptionModal 
            onClose={() => setIsModalOpen(false)}
            onSubmit={addSubscription}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);