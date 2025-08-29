function SubscriptionCard({ subscription, onDelete, onEdit, className = "", style = {} }) {
  try {
    const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
    const { 
      name, 
      plan, 
      billingCycle, 
      price, 
      users, 
      startDate, 
      endDate,
      status = '激活'
    } = subscription;

    const monthlyEquivalent = calculateMonthlyEquivalent(price, billingCycle);
    const totalCost = calculateTotalCost(price, billingCycle, users);
    const daysRemaining = calculateDaysRemaining(endDate);
    
    const planColors = {
      '个人版': 'from-blue-400 to-blue-600 shadow-blue-200 dark:shadow-blue-900',
      '团队版': 'from-green-400 to-green-600 shadow-green-200 dark:shadow-green-900', 
      '企业版': 'from-purple-400 to-purple-600 shadow-purple-200 dark:shadow-purple-900'
    };
    
    const statusColors = {
      '激活': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      '已过期': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      '即将过期': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    };
    
    const getStatus = () => {
      if (daysRemaining === 0) return '已过期';
      if (daysRemaining <= 7) return '即将过期';
      return '激活';
    };
    
    const currentStatus = getStatus();

    return (
      <div className={`card group relative overflow-hidden ${className}`} style={style} data-name="subscription-card" data-file="components/SubscriptionCard.js">
        {/* 背景装饰 */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${planColors[plan]?.split(' ')[0] || 'from-gray-400 to-gray-600'} rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500`}></div>
        
        {/* 头部 */}
        <div className="relative flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[currentStatus]}`}>
                {currentStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${planColors[plan]?.split(' ')[0] || 'from-gray-400 to-gray-600'} text-white text-xs font-medium shadow-md ${planColors[plan]?.split(' ')[1] || ''}`}>
                {plan}
              </div>
              <div className="px-2 py-1 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-medium">
                {billingCycle}
              </div>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center gap-1">
            {onEdit && (
              <button 
                onClick={() => onEdit(subscription)}
                className="text-[var(--text-muted)] hover:text-[var(--primary-color)] transition-colors p-1.5 hover:bg-[var(--bg-tertiary)] rounded-lg"
                title="编辑"
              >
                <div className="icon-edit-3 text-base"></div>
              </button>
            )}
            {!showConfirmDelete ? (
              <button 
                onClick={() => setShowConfirmDelete(true)}
                className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                title="删除"
              >
                <div className="icon-trash-2 text-base"></div>
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 rounded-lg p-1">
                <button
                  onClick={() => {
                    onDelete(subscription.id);
                    setShowConfirmDelete(false);
                  }}
                  className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 px-2 py-1 rounded text-xs font-medium transition-colors"
                >
                  确认
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded text-xs font-medium transition-colors"
                >
                  取消
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 费用信息 */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <div className="icon-users text-xs text-[var(--text-muted)]"></div>
                <span className="text-xs text-[var(--text-muted)]">用户数</span>
              </div>
              <span className="text-lg font-bold text-[var(--text-primary)]">{users}</span>
            </div>
            
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <div className="icon-tag text-xs text-[var(--text-muted)]"></div>
                <span className="text-xs text-[var(--text-muted)]">单价</span>
              </div>
              <span className="text-lg font-bold text-[var(--text-primary)]">¥{price.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[var(--bg-tertiary)] to-transparent rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <div className="icon-calendar text-xs text-[var(--text-muted)]"></div>
                  <span className="text-xs text-[var(--text-muted)]">月度等价</span>
                </div>
                <span className="text-lg font-bold text-[var(--primary-color)]">¥{monthlyEquivalent.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1 justify-end">
                  <div className="icon-credit-card text-xs text-[var(--text-muted)]"></div>
                  <span className="text-xs text-[var(--text-muted)]">总成本</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">¥{totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 时间信息 */}
        <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`icon-clock text-sm ${daysRemaining <= 7 ? 'text-red-500' : daysRemaining <= 30 ? 'text-yellow-500' : 'text-[var(--text-muted)]'}`}></div>
                <span className="text-xs text-[var(--text-muted)]">剩余时间</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${daysRemaining <= 7 ? 'text-red-500' : daysRemaining <= 30 ? 'text-yellow-500' : 'text-[var(--text-primary)]'}`}>
                  {daysRemaining}
                </span>
                <span className="text-sm text-[var(--text-muted)]">天</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xs text-[var(--text-muted)] mb-1">有效期</div>
              <div className="text-xs font-medium text-[var(--text-secondary)]">
                {startDate.split('-').join('/')}
              </div>
              <div className="text-xs text-[var(--text-muted)]">至</div>
              <div className="text-xs font-medium text-[var(--text-secondary)]">
                {endDate.split('-').join('/')}
              </div>
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="mt-3">
            <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full bg-gradient-to-r ${
                  daysRemaining <= 7 ? 'from-red-400 to-red-600' : 
                  daysRemaining <= 30 ? 'from-yellow-400 to-yellow-600' : 
                  'from-green-400 to-green-600'
                }`}
                style={{ 
                  width: `${Math.max(5, Math.min(100, ((365 - daysRemaining) / 365) * 100))}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SubscriptionCard component error:', error);
    return null;
  }
}