// 设置弹窗组件
function SettingsModal({ onClose, onSave }) {
  const [displayCurrency, setDisplayCurrency] = React.useState(getUserDisplayCurrency());
  const [showUpdateTime, setShowUpdateTime] = React.useState(true);
  const [autoUpdateRates, setAutoUpdateRates] = React.useState(true);

  const handleSave = () => {
    setUserDisplayCurrency(displayCurrency);
    localStorage.setItem('showUpdateTime', showUpdateTime);
    localStorage.setItem('autoUpdateRates', autoUpdateRates);
    
    onSave({
      displayCurrency,
      showUpdateTime,
      autoUpdateRates
    });
    
    onClose();
  };

  // 获取汇率更新时间
  const lastUpdateTime = getExchangeRatesUpdateTime();
  const updateTimeStr = lastUpdateTime 
    ? new Date(lastUpdateTime).toLocaleString('zh-CN')
    : '从未更新';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              系统设置
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

        {/* 设置内容 */}
        <div className="p-6 space-y-6">
          {/* 显示货币设置 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              统计显示货币
            </label>
            <select
              value={displayCurrency}
              onChange={(e) => setDisplayCurrency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <optgroup label="常用货币">
                {CURRENCIES.slice(0, 4).map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.name} ({currency.symbol})
                  </option>
                ))}
              </optgroup>
              <optgroup label="其他货币">
                {CURRENCIES.slice(4).map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.name} ({currency.symbol})
                  </option>
                ))}
              </optgroup>
            </select>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              所有统计数据将自动转换为此货币显示
            </p>
          </div>

          {/* 汇率信息 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              汇率信息
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">上次更新时间</span>
                <span className="text-gray-900 dark:text-white">{updateTimeStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">当前基准</span>
                <span className="text-gray-900 dark:text-white">1 USD</span>
              </div>
            </div>
            
            {/* 主要汇率显示 */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['CNY', 'EUR', 'GBP', 'JPY'].map(code => (
                  <div key={code} className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{getCurrency(code).flag} {code}</span>
                    <span>{EXCHANGE_RATES[code]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 其他设置 */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showUpdateTime"
                checked={showUpdateTime}
                onChange={(e) => setShowUpdateTime(e.target.checked)}
                className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="showUpdateTime" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                显示汇率更新时间
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoUpdateRates"
                checked={autoUpdateRates}
                onChange={(e) => setAutoUpdateRates(e.target.checked)}
                className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="autoUpdateRates" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                自动更新汇率（每24小时）
              </label>
            </div>
          </div>

          {/* 说明 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="ml-3 text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">汇率说明</p>
                <p className="text-xs">
                  系统使用固定汇率进行换算，实际汇率可能有所差异。
                  建议定期核对实际支付金额。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}