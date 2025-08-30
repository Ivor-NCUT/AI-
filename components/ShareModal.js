// 分享模态框组件
function ShareModal({ isOpen, onClose, subscriptions, user, displayCurrency }) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [shareImage, setShareImage] = React.useState(null);
  const shareContentRef = React.useRef(null);

  // 计算统计数据
  const stats = React.useMemo(() => {
    const totalSubscriptions = subscriptions.length;
    const totalMonthlySpend = subscriptions.reduce((sum, sub) => {
      const monthlyPrice = sub.billingCycle === '年付' ? sub.price / 12 : sub.price;
      return sum + monthlyPrice;
    }, 0);
    const totalYearlySpend = totalMonthlySpend * 12;
    
    const categories = {};
    subscriptions.forEach(sub => {
      const category = getCategoryByName(sub.productName);
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return {
      totalSubscriptions,
      totalMonthlySpend,
      totalYearlySpend,
      categories
    };
  }, [subscriptions]);

  // 根据产品名称获取分类
  function getCategoryByName(productName) {
    const name = productName.toLowerCase();
    if (name.includes('chatgpt') || name.includes('claude') || name.includes('gemini')) {
      return '对话AI';
    } else if (name.includes('midjourney') || name.includes('dall') || name.includes('stable')) {
      return '图像生成';
    } else if (name.includes('copilot') || name.includes('cursor') || name.includes('tabnine')) {
      return '代码助手';
    } else if (name.includes('notion') || name.includes('jasper') || name.includes('copy')) {
      return '内容创作';
    } else if (name.includes('grammarly') || name.includes('deepl') || name.includes('translate')) {
      return '语言工具';
    }
    return '其他工具';
  }

  // 生成分享图片
  const generateShareImage = async () => {
    if (!shareContentRef.current) return;
    
    setIsGenerating(true);
    try {
      // 这里需要引入html2canvas库
      if (typeof html2canvas === 'undefined') {
        throw new Error('html2canvas库未加载');
      }
      
      const canvas = await html2canvas(shareContentRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: 1200
      });
      
      const imageDataUrl = canvas.toDataURL('image/png');
      setShareImage(imageDataUrl);
    } catch (error) {
      console.error('生成分享图片失败:', error);
      alert('生成分享图片失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  // 下载图片
  const downloadImage = () => {
    if (!shareImage) return;
    
    const link = document.createElement('a');
    link.download = `我的AI订阅_${new Date().toISOString().split('T')[0]}.png`;
    link.href = shareImage;
    link.click();
  };

  // 复制图片到剪贴板
  const copyImage = async () => {
    if (!shareImage) return;
    
    try {
      const response = await fetch(shareImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      alert('图片已复制到剪贴板');
    } catch (error) {
      console.error('复制图片失败:', error);
      alert('复制图片失败，请使用下载功能');
    }
  };

  // 重置状态
  const handleClose = () => {
    setShareImage(null);
    setIsGenerating(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">分享我的AI订阅</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">生成精美的分享图片</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {!shareImage ? (
            <div className="space-y-6">
              {/* 预览区域 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">预览内容</h3>
                
                {/* 分享内容 - 隐藏的用于生成图片 */}
                <div 
                  ref={shareContentRef}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                  style={{ width: '800px', minHeight: '1200px', margin: '0 auto' }}
                >
                  {/* 头部信息 */}
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <img 
                        src="assets/images/管订NoSam_产品图标-透明底.png" 
                        alt="管订NoSam" 
                        className="w-16 h-16"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <svg className="w-12 h-12 text-white" style={{display: 'none'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">我的AI工具订阅</h1>
                    <p className="text-gray-600">分享我正在使用的AI产品</p>
                  </div>

                  {/* 统计卡片 */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalSubscriptions}</div>
                      <div className="text-gray-600">订阅产品</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">¥{Math.round(stats.totalMonthlySpend)}</div>
                      <div className="text-gray-600">月度支出</div>
                    </div>
                  </div>

                  {/* 订阅列表 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">订阅清单</h3>
                    <div className="space-y-3">
                      {subscriptions.slice(0, 8).map((subscription, index) => {
                        const monthlyPrice = subscription.billingCycle === '年付' ? subscription.price / 12 : subscription.price;
                        return (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {subscription.productName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{subscription.productName}</div>
                                <div className="text-sm text-gray-500">{subscription.plan} · {subscription.billingCycle}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">¥{Math.round(monthlyPrice)}/月</div>
                              <div className="text-sm text-gray-500">¥{subscription.price}/{subscription.billingCycle === '年付' ? '年' : '月'}</div>
                            </div>
                          </div>
                        );
                      })}
                      {subscriptions.length > 8 && (
                        <div className="text-center text-gray-500 py-2">
                          还有 {subscriptions.length - 8} 个订阅...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 分类统计 */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">分类统计</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(stats.categories).map(([category, count]) => (
                        <div key={category} className="bg-gray-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-gray-900">{count}</div>
                          <div className="text-sm text-gray-600">{category}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 底部信息 */}
                  <div className="text-center pt-8 border-t border-gray-200">
                    <p className="text-gray-500 mb-2">通过 管订NoSam 管理我的AI订阅</p>
                    <p className="text-sm text-gray-400">让AI工具使用更高效，订阅管理更简单</p>
                  </div>
                </div>
              </div>

              {/* 生成按钮 */}
              <div className="flex justify-center">
                <button
                  onClick={generateShareImage}
                  disabled={isGenerating || subscriptions.length === 0}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      生成中...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      生成分享图片
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* 生成结果 */
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">分享图片已生成</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 inline-block">
                  <img src={shareImage} alt="分享图片" className="max-w-full h-auto rounded-lg shadow-lg" style={{maxHeight: '400px'}} />
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={downloadImage}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  下载图片
                </button>
                
                <button
                  onClick={copyImage}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制图片
                </button>
                
                <button
                  onClick={() => setShareImage(null)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重新生成
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}