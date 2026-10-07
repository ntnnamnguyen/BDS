'use client';

import {
  ExternalLink,
  LoaderCircle,
  MapPin,
  Route,
  Sparkles,
} from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import type { LocationBlockData } from '@/features/projects/schemas';

interface LocationBlockProps {
  data: LocationBlockData | null;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface NormalizedMapConfig extends Coordinates {
  address: string;
  style: 'luxury-dark' | 'minimal-light' | 'satellite';
  zoom: number;
}

interface NormalizedPoiItem {
  coordinates: Coordinates | null;
  highlight: boolean;
  name: string;
  unit: '' | 'km' | 'm' | 'min';
  value: string;
}

interface NormalizedLocation {
  address: string;
  description: string;
  heading: string;
  highlights: Array<{ content: string; title: string }>;
  mapConfig: NormalizedMapConfig | null;
  poiGroups: Array<{ groupName: string; items: NormalizedPoiItem[] }>;
  tagline: string;
}

type MapStatus = 'error' | 'loading' | 'ready';

const MAP_STYLES: Record<NormalizedMapConfig['style'], string> = {
  'luxury-dark': 'mapbox://styles/mapbox/dark-v11',
  'minimal-light': 'mapbox://styles/mapbox/light-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function boundedNumber(
  value: unknown,
  minimum: number,
  maximum: number,
): number | null {
  return typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum
    ? value
    : null;
}

function normalizeCoordinates(value: unknown): Coordinates | null {
  if (!isRecord(value)) return null;

  const lat = boundedNumber(value.lat, -90, 90);
  const lng = boundedNumber(value.lng, -180, 180);
  return lat === null || lng === null ? null : { lat, lng };
}

function unwrapLocationData(input: unknown): Record<string, unknown> | null {
  if (!isRecord(input)) return null;
  return isRecord(input.data) ? input.data : input;
}

function normalizeLocation(input: unknown): NormalizedLocation | null {
  const raw = unwrapLocationData(input);
  if (!raw) return null;

  const rawMapConfig = isRecord(raw.mapConfig) ? raw.mapConfig : null;
  const coordinates = normalizeCoordinates(rawMapConfig);
  const address = rawMapConfig ? textValue(rawMapConfig.address) : '';
  const rawStyle = rawMapConfig ? textValue(rawMapConfig.style) : '';
  const style: NormalizedMapConfig['style'] =
    rawStyle === 'minimal-light' || rawStyle === 'satellite'
      ? rawStyle
      : 'luxury-dark';
  const rawZoom = rawMapConfig
    ? boundedNumber(rawMapConfig.zoom, 0, 22)
    : null;
  const mapConfig =
    rawMapConfig && coordinates
      ? {
          ...coordinates,
          address,
          style,
          zoom: rawZoom ?? 14,
        }
      : null;

  const poiGroups = Array.isArray(raw.poiGroups)
    ? raw.poiGroups.flatMap((candidate, groupIndex) => {
        if (!isRecord(candidate) || !Array.isArray(candidate.items)) return [];

        const items = candidate.items.flatMap((item): NormalizedPoiItem[] => {
          if (!isRecord(item)) return [];

          const name = textValue(item.name);
          const value = textValue(item.value);
          if (!name && !value) return [];

          const rawUnit = textValue(item.unit);
          const unit: NormalizedPoiItem['unit'] =
            rawUnit === 'min' || rawUnit === 'km' || rawUnit === 'm'
              ? rawUnit
              : '';

          return [
            {
              coordinates: normalizeCoordinates(item.coordinates),
              highlight: item.highlight === true,
              name: name || `Điểm kết nối ${groupIndex + 1}`,
              unit,
              value,
            },
          ];
        });

        if (items.length === 0) return [];
        return [
          {
            groupName:
              textValue(candidate.groupName) || `Kết nối ${groupIndex + 1}`,
            items,
          },
        ];
      })
    : [];

  const highlights = Array.isArray(raw.highlights)
    ? raw.highlights.flatMap((candidate) => {
        if (!isRecord(candidate)) return [];
        const title = textValue(candidate.title);
        const content = textValue(candidate.content);
        return title || content ? [{ title, content }] : [];
      })
    : [];

  const normalized: NormalizedLocation = {
    address,
    description: textValue(raw.description),
    heading: textValue(raw.heading),
    highlights,
    mapConfig,
    poiGroups,
    tagline: textValue(raw.tagline),
  };

  const hasContent =
    normalized.heading ||
    normalized.address ||
    normalized.description ||
    normalized.tagline ||
    normalized.mapConfig ||
    normalized.poiGroups.length > 0 ||
    normalized.highlights.length > 0;

  return hasContent ? normalized : null;
}

function buildExternalMapUrl(location: NormalizedLocation): string | null {
  const query = location.mapConfig
    ? `${location.mapConfig.lat},${location.mapConfig.lng}`
    : '';
  const fallbackQuery = location.address || query;

  return fallbackQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery)}`
    : null;
}

export default function LocationBlock({ data }: LocationBlockProps) {
  const headingId = useId();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const location = useMemo(
    () => normalizeLocation(data),
    [data],
  );
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim() ?? '';
  const hasPublicToken = token.startsWith('pk.');
  const mapIdentity = location?.mapConfig
    ? JSON.stringify({
        heading: location.heading,
        mapConfig: location.mapConfig,
        poiGroups: location.poiGroups,
      })
    : '';
  const [mapState, setMapState] = useState<{
    identity: string;
    status: MapStatus;
  }>({ identity: '', status: 'loading' });

  const canRenderMap = Boolean(
    location?.mapConfig && hasPublicToken && mapIdentity,
  );
  const mapStatus: MapStatus | 'unavailable' = canRenderMap
    ? mapState.identity === mapIdentity
      ? mapState.status
      : 'loading'
    : 'unavailable';

  useEffect(() => {
    const currentLocation = location;
    if (
      !canRenderMap ||
      !currentLocation?.mapConfig ||
      !mapContainerRef.current
    ) {
      return;
    }

    const container = mapContainerRef.current;
    const { heading: locationHeading, mapConfig, poiGroups } = currentLocation;
    let disposed = false;
    let didLoad = false;
    let map: import('mapbox-gl').Map | null = null;
    let resizeObserver: ResizeObserver | null = null;

    async function initializeMap(): Promise<void> {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        if (disposed) return;

        map = new mapboxgl.Map({
          accessToken: token,
          attributionControl: true,
          center: [mapConfig.lng, mapConfig.lat],
          container,
          cooperativeGestures: true,
          style: MAP_STYLES[mapConfig.style],
          zoom: mapConfig.zoom,
        });

        if (disposed) {
          map.remove();
          map = null;
          return;
        }

        map.getCanvas().setAttribute(
          'aria-label',
          `Bản đồ vị trí ${locationHeading || mapConfig.address || 'dự án'}`,
        );
        map.addControl(
          new mapboxgl.NavigationControl({ showCompass: false }),
          'top-right',
        );

        const projectMarker = new mapboxgl.Marker({ color: '#8C7355' })
          .setLngLat([mapConfig.lng, mapConfig.lat])
          .addTo(map);
        projectMarker
          .getElement()
          .setAttribute(
            'aria-label',
            locationHeading || mapConfig.address || 'Vị trí dự án',
          );

        const projectLabel =
          mapConfig.address || locationHeading || 'Vị trí dự án';
        projectMarker.setPopup(
          new mapboxgl.Popup({ offset: 24 }).setText(projectLabel),
        );

        for (const group of poiGroups) {
          for (const item of group.items) {
            if (!item.coordinates) continue;

            const marker = new mapboxgl.Marker({
              color: item.highlight ? '#B8860B' : '#64748B',
              scale: item.highlight ? 0.8 : 0.65,
            })
              .setLngLat([item.coordinates.lng, item.coordinates.lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 18 }).setText(
                  [item.name, [item.value, item.unit].filter(Boolean).join(' ')]
                    .filter(Boolean)
                    .join(' — '),
                ),
              )
              .addTo(map);
            marker.getElement().setAttribute('aria-label', item.name);
          }
        }

        map.once('load', () => {
          didLoad = true;
          if (!disposed) {
            setMapState({ identity: mapIdentity, status: 'ready' });
          }
        });

        map.on('error', (event) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('[Mapbox] Không thể tải tài nguyên bản đồ.', event.error);
          }

          if (!disposed && !didLoad) {
            setMapState({ identity: mapIdentity, status: 'error' });
          }
        });

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => map?.resize());
          resizeObserver.observe(container);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Mapbox] Không thể khởi tạo bản đồ.', error);
        }

        if (!disposed) {
          setMapState({ identity: mapIdentity, status: 'error' });
        }
      }
    }

    void initializeMap();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      map?.remove();
    };
  }, [canRenderMap, location, mapIdentity, token]);

  if (!location) {
    return (
      <section
        aria-live="polite"
        className="border border-luxury-taupe/20 bg-white/50 px-6 py-16 text-center"
      >
        <MapPin aria-hidden="true" className="mx-auto size-8 text-luxury-bronze" />
        <h2 className="mt-5 font-serif text-3xl text-luxury-ink">
          Vị trí đang được cập nhật
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-luxury-stone">
          Thông tin địa chỉ và kết nối khu vực sẽ sớm được bổ sung.
        </p>
      </section>
    );
  }

  const externalMapUrl = buildExternalMapUrl(location);
  const address = location.address;

  return (
    <section aria-labelledby={headingId} className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:items-stretch">
        <div className="space-y-10 lg:col-span-5">
          <header className="space-y-5">
            {location.tagline && (
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-luxury-bronze">
                {location.tagline}
              </p>
            )}
            <h2
              id={headingId}
              className="font-serif text-4xl leading-tight text-luxury-ink md:text-5xl"
            >
              {location.heading || 'Vị trí dự án'}
            </h2>
            {location.description && (
              <p className="text-base font-light leading-8 text-luxury-stone">
                {location.description}
              </p>
            )}
          </header>

          {address && (
            <div className="border-l-2 border-luxury-bronze bg-luxury-base/60 px-5 py-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-luxury-stone">
                Địa chỉ
              </p>
              <p className="mt-2 font-serif text-lg text-luxury-ink">{address}</p>
            </div>
          )}

          {location.poiGroups.length > 0 && (
            <div className="space-y-7" aria-label="Kết nối khu vực">
              {location.poiGroups.map((group, groupIndex) => (
                <div key={`${group.groupName}-${groupIndex}`}>
                  <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-stone">
                    <Route aria-hidden="true" className="size-4 text-luxury-bronze" />
                    {group.groupName}
                  </h3>
                  <ul className="mt-3 divide-y divide-luxury-taupe/20">
                    {group.items.map((item, itemIndex) => (
                      <li
                        key={`${item.name}-${itemIndex}`}
                        className="flex items-center justify-between gap-5 py-3 text-sm"
                      >
                        <span
                          className={
                            item.highlight
                              ? 'font-semibold text-luxury-ink'
                              : 'text-luxury-stone'
                          }
                        >
                          {item.name}
                        </span>
                        {(item.value || item.unit) && (
                          <span className="shrink-0 font-serif text-lg text-luxury-bronze">
                            {[item.value, item.unit].filter(Boolean).join(' ')}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {location.highlights.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2" aria-label="Đặc quyền vị trí">
              {location.highlights.map((highlight, index) => (
                <div
                  key={`${highlight.title}-${index}`}
                  className="border border-luxury-taupe/20 p-5"
                >
                  <Sparkles aria-hidden="true" className="size-4 text-luxury-bronze" />
                  {highlight.title && (
                    <h3 className="mt-3 font-serif text-lg text-luxury-ink">
                      {highlight.title}
                    </h3>
                  )}
                  {highlight.content && (
                    <p className="mt-2 text-xs leading-6 text-luxury-stone">
                      {highlight.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative min-h-[32rem] overflow-hidden bg-slate-900 lg:col-span-7">
          <div className="absolute inset-0">
            <div ref={mapContainerRef} className="h-full w-full" />
          </div>

          {mapStatus !== 'ready' && (
            <div
              aria-live="polite"
              className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900 px-8 text-center text-white"
              role="status"
            >
              <div className="max-w-sm space-y-5">
                {mapStatus === 'loading' ? (
                  <LoaderCircle
                    aria-hidden="true"
                    className="mx-auto size-8 animate-spin text-luxury-bronze"
                  />
                ) : (
                  <MapPin
                    aria-hidden="true"
                    className="mx-auto size-9 text-luxury-bronze"
                  />
                )}
                <div>
                  <p className="font-serif text-2xl">
                    {mapStatus === 'loading'
                      ? 'Đang tải bản đồ'
                      : 'Bản đồ tương tác chưa khả dụng'}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-white/60">
                    {mapStatus === 'unavailable' && !location.mapConfig
                      ? 'Tọa độ dự án đang được cập nhật.'
                      : mapStatus === 'unavailable' && !hasPublicToken
                        ? 'Mapbox chưa được cấu hình bằng public access token.'
                        : mapStatus === 'error'
                          ? 'Không thể tải Mapbox vào lúc này. Bạn vẫn có thể mở vị trí bằng bản đồ ngoài.'
                          : 'Đang chuẩn bị dữ liệu vị trí và các điểm kết nối.'}
                  </p>
                </div>
                {externalMapUrl && mapStatus !== 'loading' && (
                  <a
                    className="inline-flex items-center gap-2 border-b border-luxury-bronze pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-bronze"
                    href={externalMapUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Mở trên Google Maps
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
