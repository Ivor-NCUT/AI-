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
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in fade-in-active" data-name="add-subscription-modal" data-file="components/AddSubscriptionModal.js">
        <div className="bg-[var(--bg-primary)] rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[var(--border-color)] slide-in-bottom slide-in-bottom-active">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] rounded-lg flex items-center justify-center">
                <div className="icon-plus text-xl text-white"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">添加新订阅</h2>
                <p className="text-xs text-[var(--text-muted)]">填写AI产品订阅信息</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-all"
            >
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
                {[
                  { name: 'ChatGPT Plus', price: 20, cycle: '月付' },
                  { name: 'Claude Pro', price: 20, cycle: '月付' },
                  { name: 'Midjourney', price: 10, cycle: '月付' },
                  { name: 'GitHub Copilot', price: 10, cycle: '月付' },
                  { name: 'Notion AI', price: 10, cycle: '月付' }
                ].map(item => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      name: item.name,
                      price: item.price.toString(),
                      billingCycle: item.cycle
                    }))}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                      formData.name === item.name 
                        ? 'bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white shadow-md' 
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
                    }`}
                  >
                    {item.name}
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
              <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] p-4 rounded-xl border border-[var(--border-color)] space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="icon-calculator text-sm text-[var(--primary-color)]"></div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">费用计算预览</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--bg-primary)] rounded-lg p-2">
                    <div className="text-xs text-[var(--text-muted)] mb-1">结束日期</div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">{calculatedValues.endDate}</div>
                  </div>
                  <div className="bg-[var(--bg-primary)] rounded-lg p-2">
                    <div className="text-xs text-[var(--text-muted)] mb-1">月度等价</div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">¥{calculatedValues.monthlyEquivalent.toLocaleString()}</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-lg p-3 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">预计总成本</span>
                    <span className="text-xl font-bold">¥{calculatedValues.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <div className="icon-x text-base"></div>
                <span>取消</span>
              </button>
              <button 
                type="submit" 
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={!formData.name || !formData.price}
              >
                <div className="icon-check text-base"></div>
                <span>确认添加</span>
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