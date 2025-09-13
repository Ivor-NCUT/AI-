// AI产品管理工具
// 从存储中获取AI产品列表

// 获取启用的AI产品列表
async function getAIProducts() {
  try {
    const result = await trickleListObjects('ai_product', 100, true);
    return result.items
      .filter(item => item.objectData.status === 'active')
      .map(item => item.objectData);
  } catch (error) {
    console.error('获取AI产品列表失败:', error);
    // 如果数据库中没有产品，返回默认产品列表作为备用
    return getFallbackProducts();
  }
}

// 备用产品列表（当数据库不可用时使用）
function getFallbackProducts() {
  return [
    { name: 'ChatGPT Plus', monthlyPrice: 20, yearlyPrice: 200, currency: 'USD', description: 'OpenAI的高级版聊天机器人' },
    { name: 'Claude Pro', monthlyPrice: 20, yearlyPrice: 200, currency: 'USD', description: 'Anthropic的Claude高级版' },
    { name: 'GitHub Copilot', monthlyPrice: 10, yearlyPrice: 100, currency: 'USD', description: 'AI代码助手' },
    { name: 'Midjourney', monthlyPrice: 10, yearlyPrice: 96, currency: 'USD', description: 'AI图像生成工具' },
    { name: 'Notion AI', monthlyPrice: 10, yearlyPrice: 96, currency: 'USD', description: 'Notion AI助手' },
    { name: 'Kimi', monthlyPrice: 79, yearlyPrice: 790, currency: 'CNY', description: 'Kimi智能助手会员' },
    { name: '文心一言', monthlyPrice: 59, yearlyPrice: 590, currency: 'CNY', description: '百度文心一言会员' },
    { name: '通义千问', monthlyPrice: 68, yearlyPrice: 680, currency: 'CNY', description: '阿里通义千问专业版' },
    { name: '讯飞星火', monthlyPrice: 99, yearlyPrice: 990, currency: 'CNY', description: '讯飞星火认知大模型' },
    { name: '智谱清言', monthlyPrice: 49, yearlyPrice: 490, currency: 'CNY', description: '智谱AI助手' }
  ];
}

// 搜索AI产品
async function searchAIProducts(query) {
  try {
    const result = await trickleSearchObjects('ai_product', query, 'name');
    return result.items
      .filter(item => item.objectData.status === 'active')
      .map(item => item.objectData);
  } catch (error) {
    console.error('搜索AI产品失败:', error);
    const fallback = getFallbackProducts();
    return fallback.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// 获取产品详情
async function getProductDetails(productName) {
  try {
    const result = await trickleSearchObjects('ai_product', productName, 'name');
    const product = result.items.find(item => item.objectData.name === productName);
    return product ? product.objectData : null;
  } catch (error) {
    console.error('获取产品详情失败:', error);
    const fallback = getFallbackProducts();
    return fallback.find(p => p.name === productName) || null;
  }
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAIProducts,
    searchAIProducts,
    getProductDetails,
    getFallbackProducts
  };
}

// 确保函数在全局可用
if (typeof window !== 'undefined') {
  window.getAIProducts = getAIProducts;
  window.searchAIProducts = searchAIProducts;
  window.getProductDetails = getProductDetails;
}