// 添加/编辑订阅弹窗组件 - 支持动态AI产品和多币种
function AddEditSubscriptionModal({ subscription, onClose, onSubmit }) {
  const [aiProducts, setAiProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

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

  // 加载AI产品列表
  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getAIProducts();
        setAiProducts(products);
      } catch (error) {
        console.error('加载AI产品失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // 搜索过滤产品
  const filteredProducts = React.useMemo(() => {
    if (!searchTerm) return aiProducts;
    const term = searchTerm.toLowerCase();
    return aiProducts.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }, [searchTerm, aiProducts]);

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
  }, [formData.billingCycle, selectedProduct, customPrice]);

  // 处理表单变化
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // 如果产品名称改变，清空选择的产品
    if (field === 'productName') {
      setSelectedProduct(null);
    }
  };

  // 处理货币切换
  const handleCurrencyChange = (currency) => {
    setFormData(prev => ({ ...prev, currency }));
    setShowCurrencyList(false);
  };

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 验证必填字段
    if (!formData.productName) {
      alert('请选择或输入产品名称');
      return;
    }

    if (!formData.price || formData.price <= 0) {
      alert('请输入有效的价格');
      return;
    }

    try {
      // 如果是编辑模式
      if (subscription) {
        await trickleUpdateObject('subscription', subscription.id, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        // 如果是新增模式
        const currentUser = getCurrentUser();
        if (!currentUser) {
          alert('用户未登录');
          return;
        }

        await trickleCreateObject('subscription', {
          ...formData,
          userId: currentUser.id,
          createdAt: new Date().toISOString()
        });
      }

      onSubmit();
    } catch (error) {
      console.error('保存订阅失败:', error);
      alert('保存失败，请重试');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {subscription ? '编辑订阅' : '添加订阅'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 产品选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI产品
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProductList(!showProductList)}
                className="w-full p-3 border border-gray-300 rounded-lg text-left flex justify-between items-center"
              >
                <span>{formData.productName || '选择AI产品'}</span>
                <i className="fas fa-chevron-down"></i>
              </button>

              {showProductList && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="搜索产品..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredProducts.map(product => (
                      <div
                        key={product.name}
                        onClick={() => selectProduct(product)}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.description}</p>
                            <p className="text-sm text-blue-600 mt-1">
                              ¥{product.monthlyPrice}/月 • ¥{product.yearlyPrice}/年
                            </p>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {product.currency}
                          </span>
                        </div>
                      </div>
                    ))}
                    {filteredProducts.length === 0 && (
                      <div className="p-3 text-center text-gray-500">
                        没有找到相关产品
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 自定义产品名称 */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isCustomProduct}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, isCustomProduct: e.target.checked }));
                  if (e.target.checked) {
                    setSelectedProduct(null);
                  }
                }}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">自定义产品</span>
            </label>

            {formData.isCustomProduct && (
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="输入自定义产品名称"
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
                required
              />
            )}
          </div>

          {/* 套餐 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              套餐
            </label>
            <input
              type="text"
              value={formData.plan}
              onChange={(e) => handleInputChange('plan', e.target.value)}
              placeholder="例如：个人版、团队版"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* 计费周期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              计费周期
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['月付', '季付', '年付'].map(cycle => (
                <label key={cycle} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="billingCycle"
                    value={cycle}
                    checked={formData.billingCycle === cycle}
                    onChange={() => handleInputChange('billingCycle', cycle)}
                    className="rounded"
                  />
                  <span>{cycle}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 货币 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              货币
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCurrencyList(!showCurrencyList)}
                className="w-full p-3 border border-gray-300 rounded-lg text-left flex justify-between items-center"
              >
                <span>{formData.currency}</span>
                <i className="fas fa-chevron-down"></i>
              </button>

              {showCurrencyList && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {['CNY', 'USD', 'EUR'].map(currency => (
                    <div
                      key={currency}
                      onClick={() => handleCurrencyChange(currency)}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      {currency}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 价格 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              价格
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="输入价格"
                className="flex-1 p-3 border border-gray-300 rounded-lg"
                required
                min="0"
                step="0.01"
              />
              <span className="text-gray-600">{formData.currency}</span>

              {selectedProduct && !formData.isCustomProduct && (
                <label className="flex items-center space-x-2 ml-4">
                  <input
                    type="checkbox"
                    checked={customPrice}
                    onChange={(e) => setCustomPrice(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">自定义价格</span>
                </label>
              )}
            </div>
          </div>

          {/* 用户数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户数
            </label>
            <input
              type="number"
              value={formData.users}
              onChange={(e) => handleInputChange('users', e.target.value)}
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* 开始日期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              开始日期
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* 自动续费 */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.autoRenew}
                onChange={(e) => handleInputChange('autoRenew', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">自动续费</span>
            </label>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {subscription ? '更新订阅' : '添加订阅'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}