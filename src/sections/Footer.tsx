import { Film, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-8 px-4 mt-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Usage Guide */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-center">如何使用 DVD 封面生成器</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-3xl">☝️</div>
              <p className="text-sm text-slate-600">
                使用搜索栏选择一部电影或节目
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🎨</div>
              <p className="text-sm text-slate-600">
                自定义配色方案并从可用徽标中选择
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">⬇️</div>
              <p className="text-sm text-slate-600">
                点击"导出"并导出为 PNG/JPEG/PDF
              </p>
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm">DVD 封面模板尺寸</h4>
          <p className="text-xs text-slate-600">
            标准 DVD 盒内页尺寸:
          </p>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            <li>完整封面: 10.75" x 7.245" (273mm x 183mm)</li>
            <li>正面/背面面板: 各 5.08" x 7.245"</li>
            <li>书脊: 标准盒为 0.55" (14mm)，超薄盒为 0.28" (7mm)</li>
          </ul>
          <p className="text-xs text-slate-600">
            我们的模板以 <strong>6449 x 4347 像素</strong> 导出，可实现高分辨率打印。
          </p>
        </div>

        {/* FAQ */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-center">常见问题</h4>
          <div className="space-y-2">
            {[
              {
                q: '标准 DVD 封面模板的尺寸是多少?',
                a: '完整封面尺寸为 10.75" x 7.245" (273mm x 183mm)，正面和背面各为 5.08" x 7.245"，书脊为 0.55" (14mm)。',
              },
              {
                q: '我可以使用自己的艺术作品创建定制DVD盒内页吗?',
                a: '可以! 你可以上传自己的图片作为封面艺术、背景、标志和贴花。',
              },
              {
                q: '打印DVD封套应该使用什么纸张?',
                a: '建议使用光面照片纸或厚卡纸以获得最佳效果。',
              },
              {
                q: '如何避免打印缩放问题?',
                a: '在打印设置中选择 "实际大小" 或 "100%"，不要使用 "适合页面"。',
              },
            ].map((faq, index) => (
              <details key={index} className="border rounded-lg">
                <summary className="px-4 py-2 text-sm font-medium cursor-pointer hover:bg-slate-50">
                  {faq.q}
                </summary>
                <p className="px-4 py-2 text-xs text-slate-600 border-t">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Attribution */}
        <div className="text-center space-y-2 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            本项目使用 React 与 The Movie Database API 构建。
          </p>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-xs"
          >
            <Film className="w-3 h-3" />
            TMDB
            <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-xs text-slate-400">
            仅供个人及非商业用途。请尊重版权。
          </p>
        </div>
      </div>
    </footer>
  );
}
