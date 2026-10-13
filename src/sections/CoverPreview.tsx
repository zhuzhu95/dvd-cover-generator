import { useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Layout, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CoverPreview() {
  const coverRef = useRef<HTMLDivElement>(null);
  const { coverSettings, layout, movieData, toggleLayoutPanel, toggleColorPanel } = useStore();

  // Calculate display dimensions
  const totalInches = layout.width * 2 + layout.spine;
  const displayWidth = 960;
  const pxPerInch = displayWidth / totalInches;
  const displayHeight = layout.height * pxPerInch;

  const getRainbowGradient = () => {
    if (!coverSettings.useRainbow) return coverSettings.bgColor;
    return 'linear-gradient(135deg, #dc2626 0%, #ea580c 20%, #ca8a04 40%, #16a34a 60%, #2563eb 80%, #9333ea 100%)';
  };

  const getTextColor = () => coverSettings.textColor || '#ffffff';

  const getBadgePath = (path: string | null) => {
    if (!path) return null;
    if (coverSettings.mediaBadgeNoColor) return path;
    return path.replace('.png', '-white.png');
  };

  const backWidth = layout.width / totalInches;
  const spineWidth = layout.spine / totalInches;
  const frontWidth = layout.width / totalInches;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4">
      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={toggleLayoutPanel} className="bg-white hover:bg-slate-50">
          <Layout className="w-4 h-4 mr-1" />
          布局
        </Button>
        <Button variant="outline" size="sm" onClick={toggleColorPanel} className="bg-white hover:bg-slate-50">
          <Palette className="w-4 h-4 mr-1" />
          颜色控制
        </Button>
      </div>

      {/* Cover Container */}
      <div
        ref={coverRef}
        id="dvd-cover"
        className="relative shadow-2xl overflow-hidden w-full"
        style={{ width: `${displayWidth}px`, height: `${displayHeight}px` }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: coverSettings.backgroundImage
              ? `url(${coverSettings.backgroundImage}) center/cover`
              : coverSettings.useRainbow
              ? getRainbowGradient()
              : coverSettings.bgColor,
          }}
        >
          {coverSettings.backgroundImage && (
            <div
              className="absolute inset-0"
              style={{
                background: coverSettings.useRainbow ? getRainbowGradient() : coverSettings.bgColor,
                opacity: 0.85,
              }}
            />
          )}
        </div>

        {/* Texture Overlay */}
        {coverSettings.selectedOverlay && (
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url(${coverSettings.selectedOverlay})`, backgroundSize: 'cover' }}
          />
        )}

        {/* Main Content Grid */}
        <div className="relative w-full h-full flex">
          {/* === BACK PANEL === */}
          <div
            className="relative flex flex-col overflow-hidden"
            style={{
              width: `${backWidth * 100}%`,
              color: getTextColor(),
              padding: `${pxPerInch * 0.18}px`,
            }}
          >
            {/* Back Windows - up to 4, displayed in 2x2 grid */}
            {coverSettings.backWindows.length > 0 && (
              <div
                className="w-full shrink-0 grid grid-cols-2 gap-1 mb-2"
              >
                {coverSettings.backWindows.map((bw, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden"
                    style={{
                      borderRadius: `${coverSettings.backWindowRadius}px`,
                      border: `${coverSettings.backWindowBorder}px solid rgba(255,255,255,0.3)`,
                      aspectRatio: (i === coverSettings.backWindows.length - 1 && coverSettings.backWindows.length % 2 === 1) ? undefined : '16/9',
                      gridColumn: (i === coverSettings.backWindows.length - 1 && coverSettings.backWindows.length % 2 === 1) ? '1 / -1' : undefined,
                      height: (i === coverSettings.backWindows.length - 1 && coverSettings.backWindows.length % 2 === 1) ? '130px' : undefined,
                    }}
                  >
                    <img src={bw} alt={`Back window ${i + 1}`} className="w-full h-full object-cover" />
                    {coverSettings.backWindowShowLogo && coverSettings.selectedLogo && (
                      <img
                        src={coverSettings.selectedLogo}
                        alt="Logo"
                        className="absolute inset-0 w-full h-full object-contain p-2"
                        style={{ filter: coverSettings.logoInvert ? 'invert(1)' : 'none' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="w-full mb-2" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.4)' }} />


            {/* Synopsis + Metadata */}
            {!coverSettings.hideAllText && (
              <div className="flex-1 flex flex-col overflow-hidden" style={{ fontSize: '12px' }}>
                {/* Synopsis */}
                {coverSettings.synopsis && (
                  <p className="leading-tight mb-1.5 opacity-90 flex-1" style={{ fontSize: '12px' }}>{coverSettings.synopsis}</p>
                )}

                {/* Year + Source + Studio Label */}
                {coverSettings.year && (
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <span>{coverSettings.year}</span>
                    {coverSettings.source && <span>({coverSettings.source})</span>}
                    {/* Studio label on the right */}
                    {coverSettings.selectedStudios.length > 0 && (
                    <div className="ml-auto px-1 py-0.5 shrink-0">
                      <img
                        src={coverSettings.selectedStudios[0]}
                        alt="Studio"
                        className="w-full object-contain"
                        style={{
                          maxHeight: `${pxPerInch * 0.15 * (coverSettings.studioScale / 100)}px`,
                          filter: coverSettings.studioColorMode === 'white' ? 'grayscale(100%) brightness(0) invert(1)' : coverSettings.studioColorMode === 'black' ? 'grayscale(100%) brightness(0)' : 'none',
                        }}
                      />
                    </div>
                    )}
                  </div>
                )}

                {/* Rating + Runtime */}
                <div className="flex items-center gap-1.5 mb-1">
                  {coverSettings.certification && (
                    <span className="font-bold border border-current px-1">{coverSettings.certification}</span>
                  )}
                  {coverSettings.runtime && (
                    <span>约 {coverSettings.runtime} 分钟</span>
                  )}
                </div>

                {/* Budget/Revenue */}
                {(coverSettings.budget || coverSettings.revenue) && (
                  <div className="opacity-70 mb-1">
                    预算: {coverSettings.budget || 'N/A'} / 票房: {coverSettings.revenue || 'N/A'}
                  </div>
                )}

                <div className="w-full mt-2 mb-2" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.4)' }} />

                {/* Cast */}
                {coverSettings.cast.length > 0 && (
                  <div className="mb-1" style={{ fontSize: '10px' }}>
                    <span className="font-bold">主演 </span>
                    <span>{coverSettings.cast.join(', ')}</span>
                  </div>
                )}

                {/* Crew */}
                <div className="mb-1 flex-1" style={{ fontSize: '10px' }}>
                  {[
                    { label: '导演', items: coverSettings.director },
                    { label: '编剧', items: coverSettings.writer },
                    { label: '音乐', items: coverSettings.music },
                    { label: '制片人', items: coverSettings.producer },
                  ]
                    .filter((c) => c.items.length > 0)
                    .map((c, i) => (
                      <span key={i}>
                        <span className="font-bold">{c.label} </span>
                        {c.items.join(', ')}
                        {i < 3 ? ' ' : ''}
                      </span>
                    ))}
                </div>

                {/* Bottom section: Warning + FBI Logo + Barcode */}
                <div className="w-full">
                  {/* Three separator lines */}
                  <div className="w-full my-1 space-y-0.5">
                    <div className="w-full" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
                  </div>

                  {/* Bottom row: Warning text left, FBI logo center, Barcode right */}
                  <div className="flex items-start gap-1.5" style={{ paddingTop: `${pxPerInch * 0.06}px` }}>
                    {/* Warning text */}
                    {coverSettings.showFbiWarning && !coverSettings.hideRules && (
                      <div
                        className="flex-1 leading-tight"
                        style={{ fontSize: '9px' }}
                      >
                        <span className="font-bold">警告：</span>
                        联邦法律对未经授权复制、传播或放映受版权保护的电影、录像带或影碟提供严厉的民事与刑事惩罚。刑事版权侵权由
                        <span className="font-bold"> FBI </span>
                        调查，最高可判处五年监禁及/或 25 万美元罚款。
                      </div>
                    )}

                    {/* FBI Logo */}
                    <img
                      src="/badges/fbi-logo.png"
                      alt="FBI"
                      className="object-contain shrink-0"
                      style={{
                        height: `${pxPerInch * 0.45}px`,
                        width: 'auto',
                      }}
                      crossOrigin="anonymous"
                    />

                    {/* SVG Barcode */}
                    <div
                      className="shrink-0"
                      style={{
                        height: `${pxPerInch * 0.55}px`,
                        width: `${pxPerInch * 0.85}px`,
                        backgroundColor: '#fff',
                        borderRadius: '1px',
                        padding: `${pxPerInch * 0.02}px`,
                      }}
                    >
                      <svg
                        viewBox="0 0 130 80"
                        className="w-full h-full"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        {/* White background */}
                        <rect width="130" height="80" fill="white" />
                        {/* ISBN text at top */}
                        <text x="65" y="10" textAnchor="middle" fill="#333" fontSize="7" fontFamily="Arial, sans-serif">
                          ISBN 978-0-{movieData?.id ? String(movieData.id).padStart(6, '0') : '000000'}-0-4
                        </text>
                        {/* Barcode lines - left guard */}
                        <rect x="15" y="14" width="1" height="48" fill="black" />
                        <rect x="17" y="14" width="1" height="48" fill="black" />
                        <rect x="19" y="14" width="1" height="48" fill="black" />
                        {/* Left section bars */}
                        <rect x="22" y="14" width="2" height="44" fill="black" />
                        <rect x="26" y="14" width="1" height="44" fill="black" />
                        <rect x="29" y="14" width="3" height="44" fill="black" />
                        <rect x="34" y="14" width="1" height="44" fill="black" />
                        <rect x="37" y="14" width="2" height="44" fill="black" />
                        <rect x="41" y="14" width="1" height="44" fill="black" />
                        <rect x="44" y="14" width="2" height="44" fill="black" />
                        <rect x="48" y="14" width="1" height="44" fill="black" />
                        <rect x="51" y="14" width="2" height="44" fill="black" />
                        <rect x="55" y="14" width="1" height="44" fill="black" />
                        <rect x="58" y="14" width="2" height="44" fill="black" />
                        <rect x="62" y="14" width="1" height="44" fill="black" />
                        {/* Center guard */}
                        <rect x="65" y="14" width="1" height="48" fill="black" />
                        <rect x="67" y="14" width="1" height="48" fill="black" />
                        <rect x="69" y="14" width="1" height="48" fill="black" />
                        <rect x="71" y="14" width="1" height="48" fill="black" />
                        <rect x="73" y="14" width="1" height="48" fill="black" />
                        {/* Right section bars */}
                        <rect x="76" y="14" width="1" height="44" fill="black" />
                        <rect x="79" y="14" width="2" height="44" fill="black" />
                        <rect x="83" y="14" width="1" height="44" fill="black" />
                        <rect x="86" y="14" width="3" height="44" fill="black" />
                        <rect x="91" y="14" width="1" height="44" fill="black" />
                        <rect x="94" y="14" width="2" height="44" fill="black" />
                        <rect x="98" y="14" width="1" height="44" fill="black" />
                        <rect x="101" y="14" width="2" height="44" fill="black" />
                        <rect x="105" y="14" width="1" height="44" fill="black" />
                        <rect x="108" y="14" width="2" height="44" fill="black" />
                        <rect x="112" y="14" width="1" height="44" fill="black" />
                        {/* Right guard */}
                        <rect x="115" y="14" width="1" height="48" fill="black" />
                        <rect x="117" y="14" width="1" height="48" fill="black" />
                        <rect x="119" y="14" width="1" height="48" fill="black" />
                        {/* Bottom numbers - dynamic from movieData.id */}
                        <text x="40" y="74" textAnchor="middle" fill="black" fontSize="10" fontFamily="Arial, sans-serif">{movieData?.id ? String(movieData.id).slice(0, 3).padEnd(6, '0') : '000000'}</text>
                        <text x="96" y="74" textAnchor="middle" fill="black" fontSize="10" fontFamily="Arial, sans-serif">{movieData?.id ? String(movieData.id).padStart(6, '0') : '000000'}</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* === SPINE === */}
          <div
            className="relative flex flex-col items-center overflow-hidden pt-4"
            style={{
              width: `${spineWidth * 100}%`,
              color: getTextColor(),
              borderLeft: '1px solid rgba(255,255,255,0.2)',
              borderRight: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {/* 1. Spine Label (top) */}
            {!coverSettings.hideSpineLabel && coverSettings.spineLabel && (
              <div className="w-full flex justify-center shrink-0" style={{ padding: `${pxPerInch * 0.05}px 0` }}>
                <span className="font-bold tracking-wider" style={{ fontSize: `${Math.max(7, pxPerInch * 0.15)}px` }}>
                  {coverSettings.spineLabel}
                </span>
              </div>
            )}

            {/* 2. Studio Logo (small) */}
            {coverSettings.selectedStudios.length > 0 && (
              <div className="w-full px-1 py-0.5 shrink-0">
                <img
                  src={coverSettings.selectedStudios[0]}
                  alt="Studio"
                  className="w-full object-contain"
                  style={{
                    maxHeight: `${pxPerInch * 0.15 * (coverSettings.studioScale / 100)}px`,
                    filter: coverSettings.studioColorMode === 'white' ? 'grayscale(100%) brightness(0) invert(1)' : coverSettings.studioColorMode === 'black' ? 'grayscale(100%) brightness(0)' : 'none',
                  }}
                />
              </div>
            )}

            {/* 4. Logo - rotated 90deg clockwise */}
            <div className="flex-1 flex items-center justify-center w-full min-h-0 relative overflow-hidden">
              {coverSettings.selectedLogo ? (
                <img
                  src={coverSettings.selectedLogo}
                  alt="Logo"
                  className="object-contain"
                  style={{
                    maxWidth: '85%',
                    maxHeight: '85%',
                    transform: `${coverSettings.spineLogoRotate ? 'rotate(90deg)' : 'none'} scale(${coverSettings.spineLogoScale})`,
                    filter: coverSettings.logoInvert ? 'invert(1)' : 'none',
                  }}
                  crossOrigin="anonymous"
                />
              ) : (
                <span
                  className="font-bold tracking-widest"
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    fontSize: `${Math.max(8, pxPerInch * 0.18)}px`,
                    lineHeight: 1.1,
                    wordBreak: 'keep-all',
                    overflow: 'hidden',
                    maxHeight: '100%',
                  }}
                >
                  {(coverSettings.title || movieData?.title || 'TITLE').toUpperCase()}
                </span>
              )}
            </div>

            {/* 5. Media Badge (bottom) */}
            {coverSettings.selectedMediaBadge && (
              <div className="w-full shrink-0 flex justify-center items-center mb-6" style={{ padding: `${pxPerInch * 0.04}px ${pxPerInch * 0.04}px` }}>
                <img
                  src={getBadgePath(coverSettings.selectedMediaBadge) || ''}
                  alt="Media Badge"
                  className="object-contain"
                  style={{ maxHeight: `${pxPerInch * 0.55}px`, width: '90%' }}
                  crossOrigin="anonymous"
                />
              </div>
            )}

            {/* 3. Spine Window */}
            {coverSettings.spineWindow && (
              <div className="w-full px-1 shrink-0 mb-1">
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    borderRadius: `${Math.max(1, coverSettings.spineWindowRadius)}px`,
                    border: '1.5px solid rgba(255,255,255,0.8)',
                    aspectRatio: '1/1',
                    height: '5rem',
                  }}
                >
                  <img src={coverSettings.spineWindow} alt="Spine" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
              </div>
            )}

            {/* 6. Rating badge (bottom) */}
            {!coverSettings.hideSpineInfo && coverSettings.certification && (
              <div className="w-full shrink-0 flex justify-center mb-5" style={{ paddingBottom: `${pxPerInch * 0.05}px` }}>
                <span className="font-bold border border-current leading-none" style={{ fontSize: `${Math.max(5, pxPerInch * 0.12)}px`, padding: '1px 2px' }}>
                  {coverSettings.certification}
                </span>
              </div>
            )}
          </div>

          {/* === FRONT PANEL === */}
          <div
            className="relative flex flex-col overflow-hidden"
            style={{ width: `${frontWidth * 100}%`, color: getTextColor() }}
          >
            {/* Logo overlay at top - can be hidden */}
            {/* {coverSettings.selectedLogo && !coverSettings.hideFrontLogo && (
              <div className="absolute top-0 left-0 right-0 z-10" style={{ padding: `${pxPerInch * 0.15}px` }}>
                <img
                  src={coverSettings.selectedLogo}
                  alt="Logo"
                  className="w-full object-contain"
                  style={{ maxHeight: `${pxPerInch * 0.6}px`, filter: coverSettings.logoInvert ? 'invert(1)' : 'none' }}
                  crossOrigin="anonymous"
                />
              </div>
            )} */}

            {/* Cover Art - fills entire panel, no bottom text */}
            <div className="flex-1 relative overflow-hidden">
              {coverSettings.coverArt && (
                <img
                  src={coverSettings.coverArt}
                  alt="Cover"
                  className="w-full h-full"
                  style={{
                    objectFit: coverSettings.coverArtMode === 'fit' ? 'contain' : 'cover',
                    transform: `scale(${coverSettings.coverArtScale})`,
                    borderRadius: `${coverSettings.coverArtBorderRadius}px`,
                    border: coverSettings.coverArtBorderWidth > 0 ? `${coverSettings.coverArtBorderWidth}px solid ${coverSettings.borderColor}` : 'none',
                  }}
                  crossOrigin="anonymous"
                />
              )}

              {/* Mirror effect */}
              {coverSettings.coverArtMode === 'mirror' && coverSettings.coverArt && (
                <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: `linear-gradient(to bottom, transparent, ${coverSettings.bgColor})` }} />
              )}
            </div>
          </div>
        </div>

        {/* Decals Layer */}
        {coverSettings.decals.map((decal) => (
          <img
            key={decal.id}
            src={decal.image}
            alt="Decal"
            className="absolute pointer-events-none"
            style={{ left: `${decal.x}%`, top: `${decal.y}%`, width: `${decal.scale * 10}%`, transform: `rotate(${decal.rotation}deg)` }}
            crossOrigin="anonymous"
          />
        ))}
      </div>
    </div>
  );
}
