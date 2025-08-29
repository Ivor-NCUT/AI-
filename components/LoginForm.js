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
          window.location.href = 'index.html';
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
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <div className="icon-alert-circle text-lg"></div>
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            <div className="flex items-center gap-2">
              <div className="icon-user text-base"></div>
              <span>用户名</span>
            </div>
          </label>
          <input
            type="text"
            className="input-field"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="请输入用户名或邮箱"
            required
            disabled={isLoading}
            autoComplete="username"
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">默认账户: admin / 123456</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            <div className="flex items-center gap-2">
              <div className="icon-lock text-base"></div>
              <span>密码</span>
            </div>
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
          <p className="text-xs text-[var(--text-muted)] mt-1">新用户将自动注册</p>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2 group"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>登录中...</span>
              </>
            ) : (
              <>
                <div className="icon-log-in text-lg group-hover:translate-x-1 transition-transform"></div>
                <span>立即登录</span>
              </>
            )}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border-color)]"></div>
            <span className="text-xs text-[var(--text-muted)]">OR</span>
            <div className="flex-1 h-px bg-[var(--border-color)]"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ username: 'admin', password: '123456' })}
              className="px-3 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] rounded-lg text-sm text-[var(--text-secondary)] transition-colors"
            >
              管理员登录
            </button>
            <button
              type="button"
              onClick={() => setFormData({ username: 'user1', password: 'password' })}
              className="px-3 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] rounded-lg text-sm text-[var(--text-secondary)] transition-colors"
            >
              普通用户
            </button>
          </div>
        </div>
      </form>
    );
  } catch (error) {
    console.error('LoginForm component error:', error);
    return null;
  }
}