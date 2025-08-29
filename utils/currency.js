// 货币相关工具函数

// 支持的货币列表
const CURRENCIES = [
  { code: 'USD', symbol: '$', name: '美元', flag: '🇺🇸' },
  { code: 'CNY', symbol: '¥', name: '人民币', flag: '🇨🇳' },
  { code: 'HKD', symbol: 'HK$', name: '港币', flag: '🇭🇰' },
  { code: 'EUR', symbol: '€', name: '欧元', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: '英镑', flag: '🇬🇧' },
  { code: 'JPY', symbol: '¥', name: '日元', flag: '🇯🇵' },
  { code: 'KRW', symbol: '₩', name: '韩元', flag: '🇰🇷' },
  { code: 'SGD', symbol: 'S$', name: '新加坡元', flag: '🇸🇬' },
  { code: 'AUD', symbol: 'A$', name: '澳元', flag: '🇦🇺' },
  { code: 'CAD', symbol: 'C$', name: '加元', flag: '🇨🇦' },
  { code: 'CHF', symbol: 'Fr', name: '瑞士法郎', flag: '🇨🇭' },
  { code: 'INR', symbol: '₹', name: '印度卢比', flag: '🇮🇳' },
  { code: 'MYR', symbol: 'RM', name: '马来西亚令吉', flag: '🇲🇾' },
  { code: 'THB', symbol: '฿', name: '泰铢', flag: '🇹🇭' },
  { code: 'NZD', symbol: 'NZ$', name: '新西兰元', flag: '🇳🇿' },
  { code: 'SEK', symbol: 'kr', name: '瑞典克朗', flag: '🇸🇪' },
  { code: 'NOK', symbol: 'kr', name: '挪威克朗', flag: '🇳🇴' },
  { code: 'DKK', symbol: 'kr', name: '丹麦克朗', flag: '🇩🇰' },
  { code: 'RUB', symbol: '₽', name: '俄罗斯卢布', flag: '🇷🇺' },
  { code: 'TWD', symbol: 'NT$', name: '新台币', flag: '🇹🇼' }
];

// 汇率表（以美元为基准，1 USD = X 其他货币）
// 这里使用的是近似汇率，实际应用中应该从API获取实时汇率
const EXCHANGE_RATES = {
  'USD': 1.00,
  'CNY': 7.25,
  'HKD': 7.85,
  'EUR': 0.92,
  'GBP': 0.79,
  'JPY': 149.50,
  'KRW': 1330.00,
  'SGD': 1.35,
  'AUD': 1.52,
  'CAD': 1.36,
  'CHF': 0.88,
  'INR': 83.20,
  'MYR': 4.68,
  'THB': 35.60,
  'NZD': 1.63,
  'SEK': 10.35,
  'NOK': 10.58,
  'DKK': 6.85,
  'RUB': 91.50,
  'TWD': 31.50
};

// 获取货币信息
function getCurrency(code) {
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
}

// 获取货币符号
function getCurrencySymbol(code) {
  const currency = getCurrency(code);
  return currency ? currency.symbol : '$';
}

// 格式化货币显示
function formatCurrency(amount, currencyCode, showCode = false) {
  const currency = getCurrency(currencyCode);
  const symbol = currency ? currency.symbol : '$';
  const formattedAmount = amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  if (showCode) {
    return `${symbol}${formattedAmount} ${currencyCode}`;
  }
  return `${symbol}${formattedAmount}`;
}

// 货币转换（从一种货币转换为另一种货币）
function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  // 先转换为美元
  const usdAmount = amount / EXCHANGE_RATES[fromCurrency];
  
  // 再转换为目标货币
  const targetAmount = usdAmount * EXCHANGE_RATES[toCurrency];
  
  return Math.round(targetAmount * 100) / 100; // 保留两位小数
}

// 转换为基础货币（用于统计）
function convertToBaseCurrency(amount, fromCurrency, baseCurrency = 'CNY') {
  return convertCurrency(amount, fromCurrency, baseCurrency);
}

// 获取用户偏好的显示货币
function getUserDisplayCurrency() {
  const saved = localStorage.getItem('displayCurrency');
  return saved || 'CNY'; // 默认人民币
}

// 设置用户偏好的显示货币
function setUserDisplayCurrency(currencyCode) {
  localStorage.setItem('displayCurrency', currencyCode);
}

// 保存汇率更新时间
function saveExchangeRatesUpdateTime() {
  localStorage.setItem('exchangeRatesUpdateTime', new Date().toISOString());
}

// 获取汇率更新时间
function getExchangeRatesUpdateTime() {
  const saved = localStorage.getItem('exchangeRatesUpdateTime');
  return saved ? new Date(saved) : null;
}

// 检查是否需要更新汇率（超过24小时）
function shouldUpdateExchangeRates() {
  const lastUpdate = getExchangeRatesUpdateTime();
  if (!lastUpdate) return true;
  
  const hoursSinceUpdate = (new Date() - lastUpdate) / (1000 * 60 * 60);
  return hoursSinceUpdate > 24;
}

// 获取实时汇率（这里是模拟，实际应该调用API）
async function fetchLatestExchangeRates() {
  // 在实际应用中，这里应该调用汇率API
  // 例如：https://api.exchangerate-api.com/v4/latest/USD
  // 或者：https://api.frankfurter.app/latest?from=USD
  
  // 模拟API调用延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      saveExchangeRatesUpdateTime();
      resolve(EXCHANGE_RATES);
    }, 100);
  });
}

// 批量转换订阅价格到显示货币
function convertSubscriptionPrices(subscriptions, displayCurrency) {
  return subscriptions.map(sub => {
    const convertedPrice = convertCurrency(
      sub.price,
      sub.currency || 'CNY',
      displayCurrency
    );
    
    // 计算月度等价（考虑计费周期）
    let monthlyEquivalent = convertedPrice;
    if (sub.billingCycle === '年付') {
      monthlyEquivalent = convertedPrice / 12;
    } else if (sub.billingCycle === '季付') {
      monthlyEquivalent = convertedPrice / 3;
    }
    
    return {
      ...sub,
      displayPrice: convertedPrice,
      displayMonthly: monthlyEquivalent * (sub.users || 1),
      displayCurrency: displayCurrency
    };
  });
}

// 计算统计数据（支持多币种）
function calculateStatsWithCurrency(subscriptions, displayCurrency) {
  const total = subscriptions.length;
  
  // 转换所有订阅到显示货币并计算
  let monthlyTotal = 0;
  let yearlyTotal = 0;
  
  subscriptions.forEach(sub => {
    const convertedPrice = convertCurrency(
      sub.price,
      sub.currency || 'CNY',
      displayCurrency
    );
    
    const users = sub.users || 1;
    
    // 计算月度费用
    let monthly = convertedPrice * users;
    if (sub.billingCycle === '年付') {
      monthly = monthly / 12;
    } else if (sub.billingCycle === '季付') {
      monthly = monthly / 3;
    }
    
    // 计算年度费用
    let yearly = convertedPrice * users;
    if (sub.billingCycle === '月付') {
      yearly = yearly * 12;
    } else if (sub.billingCycle === '季付') {
      yearly = yearly * 4;
    }
    
    monthlyTotal += monthly;
    yearlyTotal += yearly;
  });
  
  const avgPrice = total > 0 ? monthlyTotal / total : 0;
  
  return {
    total,
    monthlyTotal: Math.round(monthlyTotal),
    yearlyTotal: Math.round(yearlyTotal),
    avgPrice: Math.round(avgPrice),
    currency: displayCurrency
  };
}

// 导出所有函数
if (typeof window !== 'undefined') {
  window.CURRENCIES = CURRENCIES;
  window.EXCHANGE_RATES = EXCHANGE_RATES;
  window.getCurrency = getCurrency;
  window.getCurrencySymbol = getCurrencySymbol;
  window.formatCurrency = formatCurrency;
  window.convertCurrency = convertCurrency;
  window.convertToBaseCurrency = convertToBaseCurrency;
  window.getUserDisplayCurrency = getUserDisplayCurrency;
  window.setUserDisplayCurrency = setUserDisplayCurrency;
  window.fetchLatestExchangeRates = fetchLatestExchangeRates;
  window.convertSubscriptionPrices = convertSubscriptionPrices;
  window.calculateStatsWithCurrency = calculateStatsWithCurrency;
}