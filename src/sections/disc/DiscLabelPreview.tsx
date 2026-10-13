import { useRef } from 'react';
import { useDiscStore } from '@/store/useDiscStore';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DiscLabelPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const { settings, toggleColorPanel } = useDiscStore();

  const size = settings.discSize === 'standard' ? 520 : 360;
  const holeSize = settings.discSize === 'standard' ? 140 : 95;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = (size / 2) - 8;

  const getBg = () => {
    if (settings.useRainbow) {
      return 'linear-gradient(135deg, #dc2626 0%, #ea580c 20%, #ca8a04 40%, #16a34a 60%, #2563eb 80%, #9333ea 100%)';
    }
    return settings.bgColor;
  };

  const getBadgePath = (path: string | null) => {
    if (!path) return null;
    if (settings.mediaBadgeNoColor) return path;
    return path.replace('.png', '-white.png');
  };

  // Build SVG arc path for FBI warning (upper semicircle)
  const arcPath = `M ${cx - outerR},${cy + 15} A ${outerR},${outerR} 0 0,1 ${cx + outerR},${cy + 15}`;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={toggleColorPanel} className="bg-white hover:bg-slate-50">
          <Palette className="w-4 h-4 mr-1" />
          颜色控制
        </Button>
      </div>

      <div
        ref={ref}
        id="disc-label"
        className="relative rounded-full shadow-2xl overflow-hidden"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: settings.backgroundImage
            ? `url(${settings.backgroundImage}) center/cover`
            : getBg(),
        }}
      >
        {/* Background overlay */}
        {settings.backgroundImage && (
          <div className="absolute inset-0" style={{ background: getBg(), opacity: 0.85 }} />
        )}

        {/* Cover art as background */}
        {settings.coverArt && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${settings.coverArt})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3,
            }}
          />
        )}

        {/* Center hole */}
        <div
          className="absolute rounded-full bg-white"
          style={{
            width: `${holeSize}px`,
            height: `${holeSize}px`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        />

        {/* FBI Warning - curved text along upper outer edge */}
        {settings.showFbiWarning && !settings.hideRules && (
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 6 }}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            <defs>
              <path id="fbiArc" d={arcPath} fill="none" />
            </defs>
            <text
              fill={settings.textColor || '#ffffff'}
              fontSize="6.5"
              fontFamily="Arial, sans-serif"
              opacity="0.7"
            >
              <textPath href="#fbiArc" startOffset="50%" textAnchor="middle">
                警告：联邦法律对未经授权复制、传播或放映受版权保护的电影提供严厉的民事与刑事惩罚。
              </textPath>
            </text>
          </svg>
        )}

        {/* Content area - between hole and disc edge */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            top: `${(holeSize / 2) + 20}px`,
            left: `${(holeSize / 2) + 25}px`,
            right: `${(holeSize / 2) + 25}px`,
            bottom: `${(holeSize / 2) + 12}px`,
            color: settings.textColor || '#ffffff',
            zIndex: 5,
          }}
        >
          {/* Top: Logo */}
          {settings.selectedLogo && !settings.hideAllText && (
            <div className="w-full flex justify-center shrink-0" style={{ height: '88px', marginBottom: '2px' }}>
              <img
                src={settings.selectedLogo}
                alt=""
                crossOrigin="anonymous"
                style={{
                  maxHeight: '100%',
                  maxWidth: '75%',
                  objectFit: 'contain',
                  filter: settings.logoInvert ? 'invert(1)' : 'none',
                }}
              />
            </div>
          )}

          {/* Title area */}
          {!settings.hideAllText && (
            <div className="flex-1 flex flex-col items-center justify-start w-full text-center min-h-0 pt-1">
              {settings.title && (
                <h2
                  className="font-black tracking-tight leading-none"
                  style={{
                    fontSize: settings.title.length > 12 ? '26px' : settings.title.length > 8 ? '32px' : '40px',
                    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {settings.title}
                </h2>
              )}
              {settings.tagline && (
                <p
                  className="font-medium mt-1"
                  style={{
                    fontSize: '8px',
                    opacity: 0.85,
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {settings.tagline}
                </p>
              )}
            </div>
          )}

          {/* Studio logos - in content flow, between title and synopsis */}
          {!settings.hideAllText && settings.selectedStudios.length > 0 && (
            <div className="flex items-center justify-center gap-2 shrink-0 my-1">
              {settings.selectedStudios.slice(0, 2).map((logo, i) => (
                <img
                  key={i}
                  src={logo}
                  alt=""
                  style={{
                    height: `${Math.max(12, settings.studioScale * 0.25)}px`,
                    maxHeight: '32px',
                    objectFit: 'contain',
                    filter: settings.studioColorMode === 'white'
                      ? 'grayscale(100%) brightness(0) invert(1) drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                      : settings.studioColorMode === 'black'
                      ? 'grayscale(100%) brightness(0) drop-shadow(0 1px 2px rgba(255,255,255,0.3))'
                      : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                  }}
                />
              ))}
            </div>
          )}

          {/* Bottom: Synopsis + metadata */}
          {!settings.hideAllText && (
            <div className="w-full flex flex-col items-center shrink-0 mt-auto">
              {settings.synopsis && (
                <p
                  className="text-center w-full"
                  style={{
                    fontSize: `${settings.synopsisSize}px`,
                    lineHeight: 1.5,
                    opacity: 0.85,
                    maxHeight: '38px',
                    overflow: 'hidden',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {settings.synopsis}
                </p>
              )}

              {/* Metadata line */}
              <div
                className="flex items-center justify-center flex-wrap w-full mt-0.5"
                style={{
                  fontSize: `${settings.metadataSize}px`,
                  opacity: 0.8,
                  gap: '3px',
                  lineHeight: 1.3,
                }}
              >
                {settings.year && <span>{settings.year}</span>}
                {settings.source && <span>{settings.source}</span>}
                {settings.runtime && <span>约 {settings.runtime} 分钟</span>}
                {settings.cast.length > 0 && (
                  <span>主演 {settings.cast.slice(0, 3).join(', ')}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right side: Media badge */}
        {!settings.hideAllText && settings.selectedMediaBadge && (
          <div
            className="absolute flex flex-col items-center"
            style={{
              right: `${(holeSize / 2) + 8}px`,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 7,
            }}
          >
            <img
              src={getBadgePath(settings.selectedMediaBadge) || ''}
              alt=""
              crossOrigin="anonymous"
              style={{ height: '81px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
        )}

        {/* Decals */}
        {settings.decals.map((decal) => (
          <img
            key={decal.id}
            src={decal.image}
            alt=""
            crossOrigin="anonymous"
            className="absolute pointer-events-none"
            style={{
              left: `${decal.x}%`,
              top: `${decal.y}%`,
              width: `${decal.scale * 8}%`,
              transform: `translate(-50%, -50%) rotate(${decal.rotation}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
