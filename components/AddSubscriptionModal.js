function AddSubscriptionModal({ onClose, onSubmit }) {
  try {
    const [formData, setFormData] = React.useState({
      name: '',
      plan: '个人版',
      billingCycle: '月付',
      price: '',
      users: 1,
      startDate: new Date().toISOString().split('T')[0]
    });

    const [calculatedValues, setCalculatedValues] = React.useState({
      endDate: '',
      monthlyEquivalent: 0,
      totalCost: 0
    });

    React.useEffect(() => {
      const { price, billingCycle, users, startDate } = formData;
      if (price && startDate) {
        const endDate = calculateEndDate(startDate, billingCycle);
        const monthlyEquivalent = calculateMonthlyEquivalent(parseFloat(price) || 0, billingCycle);
        const totalCost = calculateTotalCost(parseFloat(price) || 0, billingCycle, parseInt(users) || 1);
        
        setCalculatedValues({
          endDate,
          monthlyEquivalent,
          totalCost
        });
      }
    }, [formData]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name || !formData.price) return;
      
      onSubmit({
        name: formData.name,
        plan: formData.plan,
        billingCycle: formData.billingCycle,
        price: parseFloat(formData.price),
        users: parseInt(formData.users),
        startDate: formData.startDate,
        endDate: calculatedValues.endDate
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-name="add-subscription-modal" data-file="components/AddSubscriptionModal.js">
        <div className="bg-[var(--bg-primary)] rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">添加订阅</h2>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <div className="icon-x text-xl"></div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">产品名称</label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="例如: ChatGPT Plus, Claude Pro, Midjourney"
                required
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {['ChatGPT Plus', 'Claude Pro', 'Midjourney', 'GitHub Copilot', 'Notion AI'].map(name => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, name }))}
                    className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded hover:bg-[var(--border-color)] transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">版本类型</label>
                <select
                  className="input-field"
                  value={formData.plan}
                  onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                >
                  <option value="个人版">个人版</option>
                  <option value="团队版">团队版</option>
                  <option value="企业版">企业版</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">计费周期</label>
                <select
                  className="input-field"
                  value={formData.billingCycle}
                  onChange={(e) => setFormData(prev => ({ ...prev, billingCycle: e.target.value }))}
                >
                  <option value="月付">月付</option>
                  <option value="年付">年付</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">价格 (¥)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="例如: 20 (月付) 或 200 (年付)"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">用户数量</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.users}
                  onChange={(e) => setFormData(prev => ({ ...prev, users: e.target.value }))}
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">开始日期</label>
              <input
                type="date"
                className="input-field"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>

            {calculatedValues.endDate && (
              <div className="bg-[var(--bg-secondary)] p-4 rounded-lg space-y-2">
                <h3 className="text-sm font-medium text-[var(--text-primary)]">计算结果预览</h3>
                <div className="text-sm text-[var(--text-secondary)] space-y-1">
                  <div className="flex justify-between">
                    <span>结束日期:</span>
                    <span>{calculatedValues.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>月度等价:</span>
                    <span>¥{calculatedValues.monthlyEquivalent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>总成本:</span>
                    <span className="text-[var(--primary-color)]">¥{calculatedValues.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">
                取消
              </button>
              <button type="submit" className="btn-primary flex-1">
                添加订阅
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AddSubscriptionModal component error:', error);
    return null;
  }
}