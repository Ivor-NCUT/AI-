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
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">用户名</label>
          <input
            type="text"
            className="input-field"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="请输入用户名"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">密码</label>
          <input
            type="password"
            className="input-field"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="请输入密码"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              登录中...
            </div>
          ) : (
            '登录'
          )}
        </button>
      </form>
    );
  } catch (error) {
    console.error('LoginForm component error:', error);
    return null;
  }
}