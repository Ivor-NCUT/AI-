// 计算月度等价费用
function calculateMonthlyEquivalent(price, billingCycle) {
  if (billingCycle === '年付') {
    return Math.round(price / 12);
  }
  return price;
}

// 计算总成本 (价格 × 用户数)
function calculateTotalCost(price, billingCycle, users) {
  return price * users;
}

// 计算结束日期
function calculateEndDate(startDate, billingCycle) {
  const start = new Date(startDate);
  const end = new Date(start);
  
  if (billingCycle === '年付') {
    end.setFullYear(start.getFullYear() + 1);
  } else {
    end.setMonth(start.getMonth() + 1);
  }
  
  return end.toISOString().split('T')[0];
}

// 计算剩余天数
function calculateDaysRemaining(endDate) {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// 计算统计数据
function calculateStats(subscriptions) {
  const totalSubscriptions = subscriptions.length;
  
  const monthlyCost = subscriptions.reduce((sum, sub) => {
    const monthlyEquivalent = calculateMonthlyEquivalent(sub.price, sub.billingCycle);
    const totalCost = calculateTotalCost(monthlyEquivalent, '月付', sub.users);
    return sum + totalCost;
  }, 0);
  
  const yearlyCost = monthlyCost * 12;
  
  const averageCost = totalSubscriptions > 0 ? Math.round(monthlyCost / totalSubscriptions) : 0;
  
  return {
    totalSubscriptions,
    monthlyCost: Math.round(monthlyCost),
    yearlyCost: Math.round(yearlyCost),
    averageCost
  };
}