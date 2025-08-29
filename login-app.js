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
            <button onClick={() => window.location.reload()} className="btn-primary">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function LoginApp() {
  try {
    const [theme, setTheme] = React.useState(() => {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    });

    React.useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    React.useEffect(() => {
      // 检查用户是否已登录，如果已登录则跳转到主页
      checkAuthForLogin();
    }, []);

    const toggleTheme = () => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden" data-name="login-app" data-file="login-app.js">
        {/* 背景装饰 */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2 float-animation"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[var(--secondary-color)] to-[var(--primary-color)] rounded-full opacity-5 translate-x-1/2 translate-y-1/2 float-animation" style={{ animationDelay: '2s' }}></div>
        
        {/* 主题切换 */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-2 rounded-lg shadow-md">
            <div className={`icon-sun text-lg transition-colors ${theme === 'light' ? 'text-yellow-500' : 'text-[var(--text-muted)]'}`}></div>
            <div 
              className="w-14 h-7 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-[var(--primary-color)] dark:to-[var(--secondary-color)] rounded-full relative cursor-pointer transition-all duration-300 hover:shadow-md"
              onClick={toggleTheme}
            >
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-md transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : ''}`}></div>
            </div>
            <div className={`icon-moon text-lg transition-colors ${theme === 'dark' ? 'text-blue-400' : 'text-[var(--text-muted)]'}`}></div>
          </div>
        </div>

        <div className="login-card relative z-10 fade-in fade-in-active">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl float-animation">
              <div className="icon-zap text-3xl text-white"></div>
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-2">AI订阅管理</h1>
            <p className="text-[var(--text-secondary)]">企业级AI产品订阅管理系统</p>
          </div>

          <LoginForm />

          <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
            <div className="text-center">
              <p className="text-xs text-[var(--text-muted)] mb-3">功能特点</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <div className="icon-check-circle text-[var(--primary-color)]"></div>
                  <span>多计费模式支持</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <div className="icon-check-circle text-[var(--primary-color)]"></div>
                  <span>自动费用计算</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <div className="icon-check-circle text-[var(--primary-color)]"></div>
                  <span>实时数据统计</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <div className="icon-check-circle text-[var(--primary-color)]"></div>
                  <span>多用户管理</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('LoginApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <LoginApp />
  </ErrorBoundary>
);