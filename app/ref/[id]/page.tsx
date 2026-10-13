import { getReferenceById, getReferences } from '@/lib/data/references';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const references = await getReferences();
  return references.map((ref) => ({
    id: ref.id,
  }));
}

export default async function ReferenceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const refItem = await getReferenceById(resolvedParams.id);

  if (!refItem) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-black p-6 md:p-12 flex flex-col justify-between select-none">
      <div>
        {/* Header */}
        <div className="flex justify-between items-baseline mb-8">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Link href="/" className="text-[14px] no-underline">
              ref-archive
            </Link>
            <a
              href="https://cdj.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] opacity-40 hover:opacity-100 transition-opacity no-underline text-black"
            >
              arranged by studiofluxus™
            </a>
          </div>
          <Link href="/" className="text-[14px] no-underline">
            목록
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-[18px] font-normal mb-8">{refItem.title}</h1>

        {/* Large Capture */}
        {(() => {
          const isPoster = refItem.majorCategory === 'POSTERS' || refItem.aspectRatio === 'portrait';
          return (
            <div
              style={{ aspectRatio: isPoster ? '3 / 4' : '16 / 10' }}
              className={`relative w-full ${isPoster ? 'max-w-xl aspect-[3/4]' : 'max-w-5xl aspect-[16/10]'} mb-8 bg-white overflow-hidden`}
            >
              <Image
                src={refItem.imageUrl}
                alt={refItem.title}
                fill
                sizes="100vw"
                className="object-contain object-top"
                unoptimized
              />
            </div>
          );
        })()}

        {/* Summary, Reference, Link */}
        <div className="space-y-4 max-w-3xl text-[14px] leading-relaxed">
          <p>
            <span className="opacity-60">요약: </span>
            {refItem.anatomy}
          </p>
          <p>
            <span className="opacity-60">참고: </span>
            {refItem.principle}
          </p>
          <p>
            <span className="opacity-60">링크: </span>
            <a
              href={refItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              {refItem.url}
            </a>
          </p>
        </div>
      </div>

      <div className="mt-12 pt-6">
        <Link href="/" className="text-[14px] underline underline-offset-4">
          목록으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
