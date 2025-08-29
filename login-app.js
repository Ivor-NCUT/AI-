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
      // Check if user is already logged in
      const currentUser = getCurrentUser();
      if (currentUser) {
        window.location.href = 'index.html';
      }
    }, []);

    const toggleTheme = () => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-tertiary)] flex items-center justify-center p-6" data-name="login-app" data-file="login-app.js">
        <div className="absolute top-6 right-6">
          <div className="flex items-center gap-2">
            <div className="icon-sun text-lg text-[var(--text-secondary)]"></div>
            <div 
              className="w-12 h-6 bg-[var(--border-color)] rounded-full relative cursor-pointer transition-all duration-300"
              onClick={toggleTheme}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : ''}`}></div>
            </div>
            <div className="icon-moon text-lg text-[var(--text-secondary)]"></div>
          </div>
        </div>

        <div className="login-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="icon-zap text-2xl text-white"></div>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">欢迎使用</h1>
            <p className="text-[var(--text-secondary)]">登录或创建您的AI订阅管理账户</p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-sm text-[var(--text-muted)]">
            <p>新用户首次登录将自动完成注册</p>
            <p>管理员：admin / 123456</p>
            <p>普通用户：user1 / password</p>
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