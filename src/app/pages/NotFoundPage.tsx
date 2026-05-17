import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🤔</div>
        <h1 className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[48px] md:text-[64px] text-[#1c1b1b] mb-4 tracking-[-1.28px]">
          404
        </h1>
        <h2 className="font-['Hanken_Grotesk',sans-serif] font-bold text-[24px] md:text-[32px] text-[#1c1b1b] mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[16px] md:text-[18px] text-[#58413c] mb-8">
          Sepertinya halaman yang kamu cari tidak ada. Yuk, kembali ke home dan mulai obrolan yang bermakna!
        </p>
        <Link
          href="/home"
          className="inline-flex min-h-11 items-center gap-3 bg-[#ff7551] drop-shadow-[4px_4px_0px_#1c1b1b] border-2 border-[#1c1b1b] rounded-xl px-8 py-4 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500] text-lg hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
        >
          <Home className="w-5 h-5" />
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
}
