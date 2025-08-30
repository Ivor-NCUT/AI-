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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">出错了</h1>
            <p className="text-gray-600 mb-4">抱歉，发生了意外错误。</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              重新加载
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden" data-name="login-app" data-file="login-app.js">
        {/* 装饰性背景元素 */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-teal-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
        
        <div className="login-card relative z-10">
          <div className="text-center">
            {/* 产品图标 */}
            <div className="logo-icon flex items-center justify-center overflow-hidden">
              {/* 如果有上传的图片，使用图片；否则使用SVG */}
              <img 
                src="/assets/images/管订NoSam_产品图标-透明底.png" 
                alt="管订 NoSam" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // 如果图片加载失败，使用备用SVG
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <svg viewBox="0 0 24 24" className="w-full h-full hidden" fill="none" style={{display: 'none'}}>
                <rect x="3" y="6" width="18" height="15" rx="3" fill="white" fillOpacity="0.9"/>
                <rect x="3" y="3" width="18" height="5" rx="2" fill="currentColor" fillOpacity="0.8"/>
                <circle cx="7" cy="5" r="1" fill="white"/>
                <circle cx="12" cy="5" r="1" fill="white"/>
                <circle cx="17" cy="5" r="1" fill="white"/>
                <path d="M8 12 L10 14 L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                <rect x="8" y="16" width="8" height="1" rx="0.5" fill="currentColor" opacity="0.3"/>
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
              管订 NoSam
            </h1>
            <p className="text-gray-600 text-sm mb-8">优雅地管理你的 AI 订阅</p>
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