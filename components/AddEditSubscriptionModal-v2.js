// 添加/编辑订阅弹窗组件 - 支持自定义产品和多币种
function AddEditSubscriptionModal({ subscription, onClose, onSubmit }) {
  // 预定义的AI产品列表
  const AI_PRODUCTS = [
    { name: 'ChatGPT Plus', monthlyPrice: 20, yearlyPrice: 200, currency: 'USD', description: 'OpenAI的高级版聊天机器人' },
    { name: 'ChatGPT Team', monthlyPrice: 30, yearlyPrice: 300, currency: 'USD', description: 'ChatGPT团队版，支持协作' },
    { name: 'Claude Pro', monthlyPrice: 20, yearlyPrice: 200, currency: 'USD', description: 'Anthropic的Claude高级版' },
    { name: 'Claude Team', monthlyPrice: 25, yearlyPrice: 250, currency: 'USD', description: 'Claude团队协作版' },
    { name: 'GitHub Copilot', monthlyPrice: 10, yearlyPrice: 100, currency: 'USD', description: 'AI代码助手' },
    { name: 'GitHub Copilot Business', monthlyPrice: 19, yearlyPrice: 190, currency: 'USD', description: '企业版代码助手' },
    { name: 'Midjourney', monthlyPrice: 10, yearlyPrice: 96, currency: 'USD', description: 'AI图像生成工具' },
    { name: 'Midjourney Pro', monthlyPrice: 30, yearlyPrice: 288, currency: 'USD', description: 'Midjourney专业版' },
    { name: 'Notion AI', monthlyPrice: 10, yearlyPrice: 96, currency: 'USD', description: 'Notion AI助手' },
    { name: 'Jasper AI', monthlyPrice: 49, yearlyPrice: 468, currency: 'USD', description: 'AI内容创作工具' },
    { name: 'Grammarly Premium', monthlyPrice: 12, yearlyPrice: 144, currency: 'USD', description: '高级语法检查工具' },
    { name: 'DeepL Pro', monthlyPrice: 9, yearlyPrice: 90, currency: 'EUR', description: '专业翻译工具' },
    { name: 'Perplexity Pro', monthlyPrice: 20, yearlyPrice: 200, currency: 'USD', description: 'AI搜索引擎高级版' },
    { name: 'Runway', monthlyPrice: 15, yearlyPrice: 144, currency: 'USD', description: 'AI视频编辑工具' },
    { name: 'ElevenLabs', monthlyPrice: 5, yearlyPrice: 50, currency: 'USD', description: 'AI语音合成' },
    { name: 'Kimi', monthlyPrice: 79, yearlyPrice: 790, currency: 'CNY', description: 'Kimi智能助手会员' },
    { name: '文心一言', monthlyPrice: 59, yearlyPrice: 590, currency: 'CNY', description: '百度文心一言会员' },
    { name: '通义千问', monthlyPrice: 68, yearlyPrice: 680, currency: 'CNY', description: '阿里通义千问专业版' },
    { name: '讯飞星火', monthlyPrice: 99, yearlyPrice: 990, currency: 'CNY', description: '讯飞星火认知大模型' },
    { name: '智谱清言', monthlyPrice: 49, yearlyPrice: 490, currency: 'CNY', description: '智谱AI助手' }
  ];

  const [formData, setFormData] = React.useState({
    productName: subscription?.productName || '',
    plan: subscription?.plan || '个人版',
    billingCycle: subscription?.billingCycle || '月付',
    currency: subscription?.currency || 'CNY',
    price: subscription?.price || '',
    users: subscription?.users || 1,
    startDate: subscription?.startDate || new Date().toISOString().split('T')[0],
    endDate: subscription?.endDate || '',
    autoRenew: subscription?.autoRenew !== false,
    isCustomProduct: subscription?.isCustomProduct || false
  });

  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [showProductList, setShowProductList] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [customPrice, setCustomPrice] = React.useState(false);
  const [showCurrencyList, setShowCurrencyList] = React.useState(false);

  // 获取用户显示货币
  const displayCurrency = getUserDisplayCurrency();

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

  // 选择预设产品
  const selectProduct = (product) => {
    setSelectedProduct(product);
    setFormData(prev => ({
      ...prev,
      productName: product.name,
      currency: product.currency,
      price: formData.billingCycle === '年付' ? product.yearlyPrice : product.monthlyPrice,
      isCustomProduct: false
    }));
    setShowProductList(false);
    setCustomPrice(false);
  };

  // 切换计费周期时更新价格
  React.useEffect(() => {
    if (selectedProduct && !customPrice && !formData.isCustomProduct) {
      setFormData(prev => ({
        ...prev,
        price: prev.billingCycle === '年付' ? selectedProduct.yearlyPrice : selectedProduct.monthlyPrice
      }));
    }
  }, [formData.billingCycle, selectedProduct, customPrice, formData.isCustomProduct]);

  // 计算总成本（原币种）
  const calculateTotalCost = () => {
    const price = parseFloat(formData.price) || 0;
    const users = parseInt(formData.users) || 1;
    return price * users;
  };

  // 计算月均成本（原币种）
  const calculateMonthlyCost = () => {
    const totalCost = calculateTotalCost();
    if (formData.billingCycle === '年付') {
      return Math.round(totalCost / 12);
    } else if (formData.billingCycle === '季付') {
      return Math.round(totalCost / 3);
    }
    return totalCost;
  };

  // 计算显示货币的费用
  const calculateDisplayCost = () => {
    const totalCost = calculateTotalCost();
    const monthlyCost = calculateMonthlyCost();
    
    const displayTotal = convertCurrency(totalCost, formData.currency, displayCurrency);
    const displayMonthly = convertCurrency(monthlyCost, formData.currency, displayCurrency);
    
    return {
      total: displayTotal,
      monthly: displayMonthly
    };
  };

  const displayCost = calculateDisplayCost();

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
      currency: formData.currency,
      price: parseFloat(formData.price),
      users: parseInt(formData.users),
      startDate: formData.startDate,
      endDate: formData.endDate,
      autoRenew: formData.autoRenew,
      isCustomProduct: formData.isCustomProduct
    });
  };

  // 关闭所有下拉菜单
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.product-dropdown')) {
        setShowProductList(false);
      }
      if (!e.target.closest('.currency-dropdown')) {
        setShowCurrencyList(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
            <div className="relative product-dropdown">
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({ 
                    ...prev, 
                    productName: value,
                    isCustomProduct: true 
                  }));
                  setSearchTerm(value);
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
                  <div className="sticky top-0 bg-blue-50 dark:bg-blue-900 p-2 border-b border-gray-200 dark:border-gray-600">
                    <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                      💡 提示：您可以选择预设产品或输入自定义产品名称
                    </div>
                  </div>
                  
                  {filteredProducts.map(product => (
                    <button
                      key={product.name}
                      type="button"
                      onClick={() => selectProduct(product)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
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
                          {getCurrencySymbol(product.currency)}{product.monthlyPrice}/月
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  {filteredProducts.length === 0 && searchTerm && (
                    <div className="px-4 py-6 text-center">
                      <div className="text-gray-500 dark:text-gray-400 mb-2">
                        未找到 "{searchTerm}"
                      </div>
                      <div className="text-sm text-gray-400 dark:text-gray-500">
                        将作为自定义产品添加
                      </div>
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
                    formData.productName === product.name && !formData.isCustomProduct
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {product.name}
                </button>
              ))}
            </div>
            
            {/* 自定义产品标记 */}
            {formData.isCustomProduct && formData.productName && (
              <div className="mt-2 inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
                自定义产品
              </div>
            )}
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

          {/* 币种和价格 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                币种
              </label>
              <div className="relative currency-dropdown">
                <button
                  type="button"
                  onClick={() => setShowCurrencyList(!showCurrencyList)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-left flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <span className="mr-2">{getCurrency(formData.currency).flag}</span>
                    <span>{getCurrency(formData.currency).code}</span>
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showCurrencyList && (
                  <div className="absolute z-10 w-48 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {CURRENCIES.map((currency, index) => (
                      <button
                        key={currency.code}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, currency: currency.code }));
                          setShowCurrencyList(false);
                        }}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-between ${
                          index < 4 ? 'border-b-2 border-gray-200 dark:border-gray-600 font-medium' : ''
                        }`}
                      >
                        <span className="flex items-center">
                          <span className="mr-2">{currency.flag}</span>
                          <span>{currency.name}</span>
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {currency.symbol}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                价格
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">
                  {getCurrencySymbol(formData.currency)}
                </span>
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
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* 用户数量 */}
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
            
            {/* 原币种费用 */}
            <div className="space-y-2 pb-3 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">单价</span>
                <span className="text-gray-900 dark:text-white">
                  {getCurrencySymbol(formData.currency)}{parseFloat(formData.price || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">用户数</span>
                <span className="text-gray-900 dark:text-white">×{formData.users}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">总费用 ({formData.currency})</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {getCurrencySymbol(formData.currency)}{calculateTotalCost().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">月均成本 ({formData.currency})</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {getCurrencySymbol(formData.currency)}{calculateMonthlyCost().toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* 显示货币费用（如果不同） */}
            {formData.currency !== displayCurrency && (
              <div className="space-y-2 pt-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  按显示货币 ({displayCurrency}) 计算：
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">总费用</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(displayCost.total, displayCurrency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">月均成本</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(displayCost.monthly, displayCurrency)}
                  </span>
                </div>
              </div>
            )}
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