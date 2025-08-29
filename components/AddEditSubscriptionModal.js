// 添加/编辑订阅弹窗组件
function AddEditSubscriptionModal({ subscription, onClose, onSubmit }) {
  // 预定义的AI产品列表
  const AI_PRODUCTS = [
    { name: 'ChatGPT Plus', monthlyPrice: 20, yearlyPrice: 200, description: 'OpenAI的高级版聊天机器人' },
    { name: 'ChatGPT Team', monthlyPrice: 30, yearlyPrice: 300, description: 'ChatGPT团队版，支持协作' },
    { name: 'Claude Pro', monthlyPrice: 20, yearlyPrice: 200, description: 'Anthropic的Claude高级版' },
    { name: 'Claude Team', monthlyPrice: 25, yearlyPrice: 250, description: 'Claude团队协作版' },
    { name: 'GitHub Copilot', monthlyPrice: 10, yearlyPrice: 100, description: 'AI代码助手' },
    { name: 'GitHub Copilot Business', monthlyPrice: 19, yearlyPrice: 190, description: '企业版代码助手' },
    { name: 'Midjourney', monthlyPrice: 10, yearlyPrice: 96, description: 'AI图像生成工具' },
    { name: 'Midjourney Pro', monthlyPrice: 30, yearlyPrice: 288, description: 'Midjourney专业版' },
    { name: 'Notion AI', monthlyPrice: 10, yearlyPrice: 96, description: 'Notion AI助手' },
    { name: 'Jasper AI', monthlyPrice: 49, yearlyPrice: 468, description: 'AI内容创作工具' },
    { name: 'Grammarly Premium', monthlyPrice: 12, yearlyPrice: 144, description: '高级语法检查工具' },
    { name: 'DeepL Pro', monthlyPrice: 9, yearlyPrice: 90, description: '专业翻译工具' },
    { name: 'Perplexity Pro', monthlyPrice: 20, yearlyPrice: 200, description: 'AI搜索引擎高级版' },
    { name: 'Runway', monthlyPrice: 15, yearlyPrice: 144, description: 'AI视频编辑工具' },
    { name: 'ElevenLabs', monthlyPrice: 5, yearlyPrice: 50, description: 'AI语音合成' },
    { name: 'Synthesia', monthlyPrice: 30, yearlyPrice: 300, description: 'AI视频生成' },
    { name: 'Copy.ai', monthlyPrice: 49, yearlyPrice: 468, description: 'AI营销文案' },
    { name: 'Writesonic', monthlyPrice: 19, yearlyPrice: 180, description: 'AI写作助手' },
    { name: 'Canva Pro', monthlyPrice: 15, yearlyPrice: 120, description: '设计工具专业版' },
    { name: 'Adobe Firefly', monthlyPrice: 5, yearlyPrice: 50, description: 'Adobe AI创作工具' }
  ];

  const [formData, setFormData] = React.useState({
    productName: subscription?.productName || '',
    plan: subscription?.plan || '个人版',
    billingCycle: subscription?.billingCycle || '月付',
    price: subscription?.price || '',
    users: subscription?.users || 1,
    startDate: subscription?.startDate || new Date().toISOString().split('T')[0],
    endDate: subscription?.endDate || '',
    autoRenew: subscription?.autoRenew !== false
  });

  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [showProductList, setShowProductList] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [customPrice, setCustomPrice] = React.useState(false);

  // 搜索过滤产品
  const filteredProducts = React.useMemo(() => {
    if (!searchTerm) return AI_PRODUCTS;
    const term = searchTerm.toLowerCase();
    return AI_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // 计算结束日期
  React.useEffect(() => {
    if (formData.startDate && formData.billingCycle) {
      const start = new Date(formData.startDate);
      const end = new Date(start);
      
      if (formData.billingCycle === '年付') {
        end.setFullYear(end.getFullYear() + 1);
      } else if (formData.billingCycle === '季付') {
        end.setMonth(end.getMonth() + 3);
      } else {
        end.setMonth(end.getMonth() + 1);
      }
      
      setFormData(prev => ({
        ...prev,
        endDate: end.toISOString().split('T')[0]
      }));
    }
  }, [formData.startDate, formData.billingCycle]);

  // 选择产品
  const selectProduct = (product) => {
    setSelectedProduct(product);
    setFormData(prev => ({
      ...prev,
      productName: product.name,
      price: formData.billingCycle === '年付' ? product.yearlyPrice : product.monthlyPrice
    }));
    setShowProductList(false);
    setCustomPrice(false);
  };

  // 切换计费周期时更新价格
  React.useEffect(() => {
    if (selectedProduct && !customPrice) {
      setFormData(prev => ({
        ...prev,
        price: prev.billingCycle === '年付' ? selectedProduct.yearlyPrice : selectedProduct.monthlyPrice
      }));
    }
  }, [formData.billingCycle, selectedProduct, customPrice]);

  // 计算总成本
  const calculateTotalCost = () => {
    const price = parseFloat(formData.price) || 0;
    const users = parseInt(formData.users) || 1;
    return price * users;
  };

  // 计算月均成本
  const calculateMonthlyCost = () => {
    const totalCost = calculateTotalCost();
    if (formData.billingCycle === '年付') {
      return Math.round(totalCost / 12);
    } else if (formData.billingCycle === '季付') {
      return Math.round(totalCost / 3);
    }
    return totalCost;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.price) {
      alert('请填写产品名称和价格');
      return;
    }

    onSubmit({
      productName: formData.productName,
      plan: formData.plan,
      billingCycle: formData.billingCycle,
      price: parseFloat(formData.price),
      users: parseInt(formData.users),
      startDate: formData.startDate,
      endDate: formData.endDate,
      autoRenew: formData.autoRenew
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {subscription ? '编辑订阅' : '添加新订阅'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 产品选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              产品名称
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, productName: e.target.value }));
                  setSearchTerm(e.target.value);
                  setShowProductList(true);
                  setSelectedProduct(null);
                  setCustomPrice(true);
                }}
                onFocus={() => setShowProductList(true)}
                placeholder="输入产品名称或从列表选择"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              
              {/* 产品下拉列表 */}
              {showProductList && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <button
                      key={product.name}
                      type="button"
                      onClick={() => selectProduct(product)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {product.description}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          ¥{product.monthlyPrice}/月
                        </div>
                      </div>
                    </button>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                      没有找到匹配的产品
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* 快速选择按钮 */}
            <div className="mt-2 flex flex-wrap gap-2">
              {AI_PRODUCTS.slice(0, 5).map(product => (
                <button
                  key={product.name}
                  type="button"
                  onClick={() => selectProduct(product)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    formData.productName === product.name
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>

          {/* 版本和计费周期 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                版本类型
              </label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="个人版">个人版</option>
                <option value="团队版">团队版</option>
                <option value="企业版">企业版</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                计费周期
              </label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData(prev => ({ ...prev, billingCycle: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="月付">月付</option>
                <option value="季付">季付</option>
                <option value="年付">年付</option>
              </select>
            </div>
          </div>

          {/* 价格和用户数 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                价格 (¥)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, price: e.target.value }));
                  setCustomPrice(true);
                }}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                用户数量
              </label>
              <input
                type="number"
                value={formData.users}
                onChange={(e) => setFormData(prev => ({ ...prev, users: e.target.value }))}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* 日期 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                开始日期
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                结束日期
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* 自动续费 */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoRenew"
              checked={formData.autoRenew}
              onChange={(e) => setFormData(prev => ({ ...prev, autoRenew: e.target.checked }))}
              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="autoRenew" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              自动续费
            </label>
          </div>

          {/* 费用预览 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">费用预览</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">单价</span>
                <span className="text-gray-900 dark:text-white">¥{parseFloat(formData.price || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">用户数</span>
                <span className="text-gray-900 dark:text-white">×{formData.users}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-400">总费用</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ¥{calculateTotalCost().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">月均成本</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  ¥{calculateMonthlyCost().toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              {subscription ? '保存更改' : '添加订阅'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}