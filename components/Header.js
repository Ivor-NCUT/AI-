function Header({ theme, toggleTheme, currentUser }) {
  try {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    
    return (
      <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] sticky top-0 z-50 backdrop-blur-xl bg-opacity-90" data-name="header" data-file="components/Header.js">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo和标题 */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg float-animation">
                <div className="icon-zap text-xl sm:text-2xl text-white"></div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">AI订阅管理</h1>
                <p className="hidden sm:block text-sm text-[var(--text-muted)]">企业级订阅管理系统</p>
              </div>
            </div>
            
            {/* 桌面端菜单 */}
            <div className="hidden sm:flex items-center gap-4">
              {currentUser && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] px-3 py-2 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] rounded-full flex items-center justify-center">
                      <div className="icon-user text-sm text-white"></div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{currentUser.username}</p>
                      <p className="text-xs text-[var(--text-muted)]">{currentUser.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="text-[var(--text-secondary)] hover:text-red-500 transition-all duration-200 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    title="退出登录"
                  >
                    <div className="icon-log-out text-lg"></div>
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] px-3 py-2 rounded-lg">
                <div className={`icon-sun text-lg transition-colors duration-300 ${theme === 'light' ? 'text-yellow-500' : 'text-[var(--text-muted)]'}`}></div>
                <div 
                  className="theme-toggle"
                  onClick={toggleTheme}
                  role="button"
                  tabIndex="0"
                  aria-label="Toggle theme"
                ></div>
                <div className={`icon-moon text-lg transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-[var(--text-muted)]'}`}></div>
              </div>
            </div>
            
            {/* 移动端菜单按钮 */}
            <div className="sm:hidden flex items-center gap-2">
              <div 
                className="theme-toggle scale-90"
                onClick={toggleTheme}
              ></div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                <div className={`icon-${mobileMenuOpen ? 'x' : 'menu'} text-xl`}></div>
              </button>
            </div>
          </div>
          
          {/* 移动端下拉菜单 */}
          {mobileMenuOpen && currentUser && (
            <div className="sm:hidden mt-3 pt-3 border-t border-[var(--border-color)] fade-in fade-in-active">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] rounded-full flex items-center justify-center">
                    <div className="icon-user text-sm text-white"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{currentUser.username}</p>
                    <p className="text-xs text-[var(--text-muted)]">{currentUser.role}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-red-500 p-2"
                >
                  <div className="icon-log-out text-lg"></div>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}