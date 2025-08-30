function LoginForm() {
  try {
    const [formData, setFormData] = React.useState({
      username: '',
      password: ''
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      if (!formData.username.trim() || !formData.password.trim()) {
        setError('请输入用户名和密码');
        setIsLoading(false);
        return;
      }

      try {
        const result = await authenticateUser(formData.username.trim(), formData.password);
        if (result) {
          setCurrentUser(result);
          console.log('登录成功，正在跳转到主页...');
          // 使用 replace 避免后退问题
          setTimeout(() => {
            window.location.replace('index.html');
          }, 100);
        } else {
          setError('密码错误，请检查后重试');
        }
      } catch (error) {
        console.error('Login error:', error);
        setError(error.message || '登录失败，请重试');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-5" data-name="login-form" data-file="components/LoginForm.js">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
            用户名
          </label>
          <div className="relative">
            <input
              type="text"
              className="input-field pl-12"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="请输入用户名"
              required
              disabled={isLoading}
              autoComplete="username"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
            密码
          </label>
          <div className="relative">
            <input
              type="password"
              className="input-field pl-12"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="请输入密码"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>登录中...</span>
            </>
          ) : (
            <>
              <span>立即登录</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>

        <div className="pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center mb-2">
            新用户首次登录将自动完成注册
          </p>
          <p className="text-xs text-gray-400 text-center">
            添加作者微信（FH01xy）<br/>
            了解更多 AI 产品、行业知识和 AI 行业工作机会
          </p>
        </div>
      </form>
    );
  } catch (error) {
    console.error('LoginForm component error:', error);
    return null;
  }
}