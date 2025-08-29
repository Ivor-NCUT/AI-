function Header({ theme, toggleTheme, currentUser }) {
  try {
    return (
      <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] sticky top-0 z-50 backdrop-blur-sm" data-name="header" data-file="components/Header.js">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] rounded-lg flex items-center justify-center">
              <div className="icon-zap text-xl text-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">AI订阅管理</h1>
              <p className="text-sm text-[var(--text-muted)]">企业级订阅管理系统</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{currentUser.username}</p>
                  <p className="text-xs text-[var(--text-muted)]">{currentUser.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="text-[var(--text-secondary)] hover:text-red-500 transition-colors p-2"
                  title="退出登录"
                >
                  <div className="icon-log-out text-lg"></div>
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <div className="icon-sun text-lg text-[var(--text-secondary)]"></div>
              <div 
                className="theme-toggle"
                onClick={toggleTheme}
              ></div>
              <div className="icon-moon text-lg text-[var(--text-secondary)]"></div>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}