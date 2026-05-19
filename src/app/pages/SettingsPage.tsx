'use client';

import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Trash2, Info, HelpCircle, RotateCcw, UserRound, LogIn, LogOut } from 'lucide-react';
import {
  getOrCreateAnonymousUser,
  resetAllData,
} from '../../utils/storage';
import { AnonymousUser } from '../../types';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { apiRequest } from '../../lib/api-client';

type DialogAction = 'onboarding' | 'favorites' | 'all' | null;

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [dialogAction, setDialogAction] = useState<DialogAction>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [anonymousUser, setAnonymousUser] = useState<AnonymousUser | null>(null);
  const [didRequestLink, setDidRequestLink] = useState(false);
  const clearFavoriteStore = useFavoriteStore((state) => state.clearFavorites);
  const resetOnboardingStore = useOnboardingStore((state) => state.resetOnboarding);

  const refreshStats = (createUser = true) => {
    setAnonymousUser(createUser ? getOrCreateAnonymousUser() : null);
  };

  useEffect(() => {
    refreshStats();
  }, []);

  useEffect(() => {
    if (status !== 'authenticated' || didRequestLink) return;

    setDidRequestLink(true);
    void apiRequest('/api/auth/link-anonymous', {
      method: 'POST',
    })
      .then(() => {
        refreshStats();
      })
      .catch((error) => {
        console.error('Failed to link anonymous user:', error);
      });
  }, [didRequestLink, status]);

  const handleGoogleSignIn = () => {
    const user = getOrCreateAnonymousUser();
    document.cookie = `dcc_anonymous_id=${encodeURIComponent(
      user.id,
    )}; path=/; max-age=3600; samesite=lax`;
    void signIn('google');
  };

  const handleConfirm = async () => {
    if (!dialogAction || isResetting) return;

    const action = dialogAction;
    setIsResetting(true);
    setResetError(null);

    try {
      if (action === 'onboarding') {
        await resetOnboardingStore();
      }
      if (action === 'favorites') {
        await clearFavoriteStore();
      }
      if (action === 'all') {
        await Promise.all([clearFavoriteStore(), resetOnboardingStore()]);
        resetAllData();
      }

      setDialogAction(null);
      refreshStats(action !== 'all');
      router.refresh();

      if (action === 'onboarding' || action === 'all') {
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Failed to reset data:', error);
      setResetError('Reset gagal. Coba lagi setelah koneksi atau server tersedia.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="max-w-[1152px] mx-auto w-full px-4 md:px-8 py-6 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[32px] md:text-[48px] text-[#1c1b1b] mb-2 tracking-[-0.96px]">
            Pengaturan
          </h1>
          <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[16px] md:text-[18px] text-[#58413c]">
            Kelola data dan preferensi kamu.
          </p>
        </div>

        <section className="bg-white border-2 border-[#1c1b1b] rounded-xl p-6 shadow-[4px_4px_0px_#1c1b1b] mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-[#a93718] mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-lg text-[#1c1b1b] mb-2">
                Data Kamu
              </h3>
              <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c] mb-4">
                Kelola data aktivitas, favorit, dan preferensi yang tersimpan di Askara.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border-2 border-[#1c1b1b] rounded-xl p-6 shadow-[4px_4px_0px_#1c1b1b] mb-6">
          <div className="flex items-start gap-3">
            <UserRound className="w-5 h-5 text-[#a93718] mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-lg text-[#1c1b1b] mb-2">
                Akun
              </h3>
              {status === 'authenticated' ? (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b]">
                      {session.user?.name ?? 'Google user'}
                    </p>
                    <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c] break-all">
                      {session.user?.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="min-h-11 border-2 border-[#1c1b1b] rounded-lg px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold bg-[#f0edec] text-[#1c1b1b] shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c] mb-2">
                      Login opsional untuk menyimpan data ke akun Google dan siap sync lintas perangkat nanti.
                    </p>
                    <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c] break-all">
                      Anonymous ID: {anonymousUser?.id ?? 'Belum dibuat'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="min-h-11 border-2 border-[#1c1b1b] rounded-lg px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold bg-[#ff7551] text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign in with Google
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white border-2 border-[#1c1b1b] rounded-xl p-6 shadow-[4px_4px_0px_#1c1b1b] mb-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[#a93718] mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-lg text-[#1c1b1b] mb-2">
                Tentang Askara
              </h3>
              <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c] mb-2">
                Askara membantu kamu memulai percakapan lewat kartu pertanyaan interaktif. Data seperti favorit, preferensi, sesi permainan, dan akun digunakan untuk menjaga pengalaman bermain kamu.
              </p>
              <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c] mb-2">
                Kontak: hello@askara.local
              </p>
              <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c]">
                Versi MVP 1.0
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#ffe7e7] border-2 border-[#1c1b1b] rounded-xl p-6 shadow-[4px_4px_0px_#1c1b1b]">
          <div className="flex items-start gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-[#d4183d] mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-lg text-[#1c1b1b] mb-2">
                Reset Data
              </h3>
              <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c] mb-4">
                Reset data tertentu sesuai kebutuhan kamu.
              </p>
              <div className="flex flex-col md:flex-row gap-3">
                <ResetButton label="Reset Onboarding" onClick={() => setDialogAction('onboarding')} />
                <ResetButton label="Reset Favorites" onClick={() => setDialogAction('favorites')} />
                <ResetButton label="Reset All Data" danger onClick={() => setDialogAction('all')} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {dialogAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-[#1c1b1b] rounded-2xl p-8 max-w-md w-full shadow-[8px_8px_0px_#1c1b1b]">
            <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-2xl text-[#1c1b1b] mb-4">
              Konfirmasi Reset
            </h3>
            <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[#58413c] mb-6">
              Tindakan ini akan menjalankan reset yang dipilih dan tidak bisa dibatalkan.
            </p>
            {resetError && (
              <p className="font-['Hanken_Grotesk',sans-serif] font-bold text-sm text-[#d4183d] mb-4">
                {resetError}
              </p>
            )}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setDialogAction(null)}
                disabled={isResetting}
                aria-label="close"
                className="flex-1 min-h-11 bg-[#f0edec] border-2 border-[#1c1b1b] rounded-lg px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b] hover:shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[-2px] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isResetting}
                className="flex-1 min-h-11 bg-[#d4183d] border-2 border-[#1c1b1b] rounded-lg px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-white shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#1c1b1b]"
              >
                {isResetting ? 'Mereset...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResetButton({
  label,
  danger,
  onClick,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 border-2 border-[#1c1b1b] rounded-lg px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all flex items-center justify-center gap-2 ${
        danger ? 'bg-[#d4183d] text-white' : 'bg-[#ff7551] text-[#6b1500]'
      }`}
    >
      <RotateCcw className="w-4 h-4" />
      {label}
    </button>
  );
}
