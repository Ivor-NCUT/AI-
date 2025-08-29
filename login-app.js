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
        <div className="min-h-screen flex items-center justify-center bg-[#0a0f1f]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-4">We're sorry, but something unexpected happened.</p>
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
    React.useEffect(() => {
      // 检查用户是否已登录，如果已登录则跳转到主页
      checkAuthForLogin();
    }, []);

    return (
      <div className="min-h-screen bg-[#0a0f1f] flex items-center justify-center p-4" data-name="login-app" data-file="login-app.js">
        <div className="login-card">
          <div className="text-center mb-8">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-white mb-1">管订</h1>
              <p className="text-xl text-blue-400 font-semibold">NoSam</p>
            </div>
            <p className="text-gray-400 text-sm">管理你的 AI 产品订阅</p>
          </div>

          <LoginForm />
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