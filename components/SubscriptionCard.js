function SubscriptionCard({ subscription, onDelete, className = "", style = {} }) {
  try {
    const { 
      name, 
      plan, 
      billingCycle, 
      price, 
      users, 
      startDate, 
      endDate 
    } = subscription;

    const monthlyEquivalent = calculateMonthlyEquivalent(price, billingCycle);
    const totalCost = calculateTotalCost(price, billingCycle, users);
    const daysRemaining = calculateDaysRemaining(endDate);
    
    const planColors = {
      '个人版': 'bg-blue-100 text-blue-800',
      '团队版': 'bg-green-100 text-green-800', 
      '企业版': 'bg-purple-100 text-purple-800'
    };

    return (
      <div className={`card ${className}`} style={style} data-name="subscription-card" data-file="components/SubscriptionCard.js">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${planColors[plan] || 'bg-gray-100 text-gray-800'}`}>
              {plan}
            </span>
          </div>
          <button 
            onClick={() => onDelete(subscription.id)}
            className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-1"
          >
            <div className="icon-trash-2 text-lg"></div>
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">计费周期</span>
            <span className="text-sm font-medium text-[var(--text-primary)]">{billingCycle}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">用户数量</span>
            <span className="text-sm font-medium text-[var(--text-primary)]">{users}人</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">单价</span>
            <span className="text-sm font-medium text-[var(--text-primary)]">¥{price.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">月度等价</span>
            <span className="text-sm font-medium text-[var(--primary-color)]">¥{monthlyEquivalent.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]">
            <span className="text-sm text-[var(--text-secondary)]">总成本</span>
            <span className="text-lg font-bold text-[var(--primary-color)]">¥{totalCost.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">剩余天数</span>
            <span className={`font-medium ${daysRemaining <= 30 ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
              {daysRemaining}天
            </span>
          </div>
          <div className="mt-2 text-xs text-[var(--text-muted)]">
            {startDate} 至 {endDate}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SubscriptionCard component error:', error);
    return null;
  }
}