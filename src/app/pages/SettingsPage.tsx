'use client';

import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Trash2, Info, Heart, HelpCircle, RotateCcw, UserRound, LogIn, LogOut } from 'lucide-react';
import {
  getActiveSession,
  getFavorites,
  getOnboardingPreference,
  getOrCreateAnonymousUser,
  getSessionHistory,
  resetAllData,
  resetFavorites,
  resetOnboarding,
} from '../../utils/storage';
import { AnonymousUser, OnboardingPreference } from '../../types';
import { useFavoriteStore } from '../../stores/favoriteStore';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { apiRequest } from '../../lib/api-client';

type DialogAction = 'onboarding' | 'favorites' | 'all' | null;

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [dialogAction, setDialogAction] = useState<DialogAction>(null);
  const [anonymousUser, setAnonymousUser] = useState<AnonymousUser | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingPreference | null>(null);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [didRequestLink, setDidRequestLink] = useState(false);
  const refreshFavoriteStore = useFavoriteStore((state) => state.refreshFavorites);
  const refreshOnboardingStore = useOnboardingStore((state) => state.refreshPreference);

  const refreshStats = (createUser = true) => {
    setAnonymousUser(createUser ? getOrCreateAnonymousUser() : null);
    setOnboarding(getOnboardingPreference());
    setTotalSessions(getSessionHistory().length + (getActiveSession() ? 1 : 0));
    setTotalFavorites(getFavorites().length);
    refreshFavoriteStore();
    refreshOnboardingStore();
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

  const handleConfirm = () => {
    if (dialogAction === 'onboarding') {
      resetOnboarding();
    }
    if (dialogAction === 'favorites') {
      resetFavorites();
    }
    if (dialogAction === 'all') {
      resetAllData();
    }

    setDialogAction(null);
    refreshStats(dialogAction !== 'all');
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
                Semua data tersimpan di browser kamu dalam Guest Mode. Askara tidak membutuhkan login untuk MVP ini.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-[#f0edec] px-3 py-1 rounded-lg border-2 border-[#1c1b1b] font-['Hanken_Grotesk',sans-serif] font-bold text-sm text-[#1c1b1b]">
                  {totalSessions} sesi
                </div>
                <div className="bg-[#f0edec] px-3 py-1 rounded-lg border-2 border-[#1c1b1b] font-['Hanken_Grotesk',sans-serif] font-bold text-sm text-[#1c1b1b] flex items-center gap-2">
                  <Heart className="w-4 h-4" fill="#a93718" />
                  {totalFavorites} favorit
                </div>
                <div className="bg-[#f0edec] px-3 py-1 rounded-lg border-2 border-[#1c1b1b] font-['Hanken_Grotesk',sans-serif] font-bold text-sm text-[#1c1b1b]">
                  Onboarding {onboarding?.completedOnboarding ? 'selesai' : 'belum selesai'}
                </div>
              </div>
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
                Privacy: data percakapan tidak disimpan. Hanya preferensi, sesi, dan favorit lokal yang tersimpan.
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
                Pilih reset yang kamu butuhkan. Reset onboarding tidak menghapus favorit, dan reset favorit tidak menghapus onboarding.
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
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setDialogAction(null)}
                aria-label="close"
                className="flex-1 min-h-11 bg-[#f0edec] border-2 border-[#1c1b1b] rounded-lg px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-[#1c1b1b] hover:shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[-2px] transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 min-h-11 bg-[#d4183d] border-2 border-[#1c1b1b] rounded-lg px-6 py-3 font-['Hanken_Grotesk',sans-serif] font-bold text-white shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
              >
                Reset
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
