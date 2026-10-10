'use client';

import { useState, useRef } from 'react';
import { Reference } from '@/lib/types';
import Image from 'next/image';

interface ArchiveAppProps {
  initialReferences: Reference[];
  initialTags: string[];
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

function getFullPath(pathStr: string) {
  if (!pathStr) return '';
  if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) return pathStr;
  const cleanPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;
  return `${basePath}${cleanPath}`;
}

function SafeImage({
  src,
  alt,
  fallbackSvg,
  className,
  objectFit = 'object-cover',
}: {
  src: string;
  alt: string;
  fallbackSvg: string;
  className?: string;
  objectFit?: 'object-cover' | 'object-contain';
}) {
  const fullSrc = getFullPath(src);
  const fullFallback = getFullPath(fallbackSvg);
  const [imgSrc, setImgSrc] = useState(fullSrc);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className={`${objectFit} object-top ${className || ''}`}
      unoptimized
      onError={() => {
        if (imgSrc !== fullFallback) {
          setImgSrc(fullFallback);
        }
      }}
    />
  );
}

function MediaPreviewCard({
  imageUrl,
  videoUrl,
  title,
  id,
}: {
  imageUrl: string;
  videoUrl?: string;
  title: string;
  id: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && !hasVideoError) {
      videoRef.current.play().catch(() => {
        setHasVideoError(true);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      try {
        videoRef.current.currentTime = 0;
      } catch (e) {}
    }
  };

  const fullVideoSrc = videoUrl ? getFullPath(videoUrl) : undefined;
  const showVideo = isHovered && fullVideoSrc && !hasVideoError;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[16/10] bg-white overflow-hidden mb-3"
    >
      <SafeImage
        src={imageUrl}
        alt={title}
        fallbackSvg={`/captures/${id}.svg`}
        objectFit="object-cover"
        className={showVideo ? 'opacity-0' : 'opacity-100'}
      />
      {fullVideoSrc && !hasVideoError && (
        <video
          ref={videoRef}
          src={fullVideoSrc}
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setHasVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover object-top ${
            showVideo ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}
    </div>
  );
}

export default function ArchiveApp({ initialReferences, initialTags }: ArchiveAppProps) {
  const [selectedTag, setSelectedTag] = useState<string>('전체');
  const [activeRef, setActiveRef] = useState<Reference | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'index'>('grid');

  const filteredReferences = selectedTag === '전체'
    ? initialReferences
    : initialReferences.filter((ref) => ref.tags.includes(selectedTag));

  return (
    <main className="min-h-screen bg-white text-black px-6 md:px-10 pb-10 select-none">
      {/* Sticky Top Bar Container: Header + Category Nav */}
      <div className="sticky top-0 z-40 bg-white pt-6 md:pt-10 pb-4 mb-6">
        {/* Line 1: Header + View Toggle */}
        <header className="mb-4 flex justify-between items-center">
          <h1
            onClick={() => setActiveRef(null)}
            className="text-[14px] font-normal tracking-tight cursor-pointer inline-block"
          >
            ref. archive
          </h1>

          {/* View Switcher: Grid / Index */}
          <div className="flex items-center gap-4 text-[14px]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`bg-transparent p-0 border-0 cursor-pointer ${
                viewMode === 'grid' ? 'underline underline-offset-4 font-normal' : 'opacity-40 no-underline'
              }`}
            >
              그리드
            </button>
            <button
              type="button"
              onClick={() => setViewMode('index')}
              className={`bg-transparent p-0 border-0 cursor-pointer ${
                viewMode === 'index' ? 'underline underline-offset-4 font-normal' : 'opacity-40 no-underline'
              }`}
            >
              인덱스
            </button>
          </div>
        </header>

        {/* Line 2: Tags (Flex wrap so all tags are fully visible on mobile & desktop) */}
        <nav>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[14px]">
            {initialTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <li key={tag} className="inline-block">
                  <button
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`bg-transparent p-0 border-0 cursor-pointer text-[14px] ${
                      isSelected ? 'underline underline-offset-4 font-normal' : 'no-underline opacity-70'
                    }`}
                  >
                    {tag}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Line 3: Content View (Grid or Index) */}
      <section>
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
            {filteredReferences.map((refItem) => (
              <article
                key={refItem.id}
                onClick={() => setActiveRef(refItem)}
                className="cursor-pointer block bg-white"
              >
                <MediaPreviewCard
                  imageUrl={refItem.imageUrl}
                  videoUrl={refItem.videoUrl}
                  title={refItem.title}
                  id={refItem.id}
                />

                {/* Underneath Thumbnail: Website Title & Short Description */}
                <div className="text-[14px] leading-tight space-y-1">
                  <div className="font-normal tracking-tight">{refItem.title}</div>
                  <div className="opacity-60">{refItem.shortDesc}</div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Index View */
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-[14px] border-collapse">
              <thead>
                <tr className="opacity-40 font-normal pb-4">
                  <th className="py-2 pr-4 font-normal w-12">#</th>
                  <th className="py-2 pr-6 font-normal w-1/4">제목</th>
                  <th className="py-2 pr-6 font-normal w-1/3">설명</th>
                  <th className="py-2 pr-6 font-normal">태그</th>
                  <th className="py-2 font-normal text-right">링크</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferences.map((refItem, idx) => (
                  <tr
                    key={refItem.id}
                    onClick={() => setActiveRef(refItem)}
                    className="cursor-pointer hover:underline underline-offset-4"
                  >
                    <td className="py-2.5 pr-4 opacity-40 font-normal">
                      {String(idx + 1).padStart(3, '0')}
                    </td>
                    <td className="py-2.5 pr-6 font-normal">{refItem.title}</td>
                    <td className="py-2.5 pr-6 opacity-60 font-normal">{refItem.shortDesc}</td>
                    <td className="py-2.5 pr-6 opacity-60 font-normal">
                      {refItem.tags.join(', ')}
                    </td>
                    <td className="py-2.5 text-right">
                      <a
                        href={refItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-60 hover:opacity-100 underline underline-offset-4"
                      >
                        방문
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Detail Overlay View */}
      {activeRef && (
        <div className="fixed inset-0 z-50 bg-white p-6 md:p-12 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Top Bar inside Detail */}
            <div className="flex justify-between items-center mb-8">
              <span
                onClick={() => setActiveRef(null)}
                className="text-[14px] cursor-pointer"
              >
                ref. archive
              </span>
              <button
                type="button"
                onClick={() => setActiveRef(null)}
                className="text-[14px] bg-transparent border-0 cursor-pointer p-0"
              >
                닫기
              </button>
            </div>

            {/* Title */}
            <h2 className="text-[18px] font-normal mb-8">{activeRef.title}</h2>

            {/* Large Capture */}
            <div className="relative w-full max-w-5xl aspect-[16/10] mb-8 bg-white overflow-hidden">
              <SafeImage
                src={activeRef.imageUrl}
                alt={activeRef.title}
                fallbackSvg={`/captures/${activeRef.id}.svg`}
                objectFit="object-contain"
              />
            </div>

            {/* Detail Details: Summary, Reference, Link */}
            <div className="space-y-4 max-w-3xl text-[14px] leading-relaxed">
              <p>
                <span className="opacity-60">요약: </span>
                {activeRef.anatomy}
              </p>
              <p>
                <span className="opacity-60">참고: </span>
                {activeRef.principle}
              </p>
              <p>
                <span className="opacity-60">링크: </span>
                <a
                  href={activeRef.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  {activeRef.url}
                </a>
              </p>
            </div>
          </div>

          <div className="mt-12 pt-6">
            <button
              type="button"
              onClick={() => setActiveRef(null)}
              className="text-[14px] bg-transparent border-0 cursor-pointer p-0 underline underline-offset-4"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
