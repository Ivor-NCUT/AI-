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
      <form onSubmit={handleSubmit} className="space-y-6" data-name="login-form" data-file="components/LoginForm.js">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            用户名
          </label>
          <input
            type="text"
            className="input-field"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="请输入用户名"
            required
            disabled={isLoading}
            autoComplete="username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            密码
          </label>
          <input
            type="password"
            className="input-field"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="请输入密码"
            required
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? '登录中...' : '登录'}
        </button>

        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            新用户首次登录将自动完成注册
          </p>
          <p className="text-xs text-gray-400">
            添加作者微信（FH01xy），了解更多 AI 产品、行业知识和 AI 行业工作机会
          </p>
        </div>
      </form>
    );
  } catch (error) {
    console.error('LoginForm component error:', error);
    return null;
  }
}