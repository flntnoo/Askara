'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrCreateAnonymousUser } from '../../utils/storage';
import { OnboardingPreference, PreferredTone, RelationshipStage, RelationshipType } from '../../types';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboardingStore';

export default function OnboardingPage() {
  const router = useRouter();
  const savePreference = useOnboardingStore((state) => state.savePreference);
  const hydrateOnboarding = useOnboardingStore((state) => state.hydrateOnboarding);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingPreference>>({});

  const needsRelationshipStage =
    data.relationshipType === 'partner' || data.relationshipType === 'pdkt';
  const totalSteps = needsRelationshipStage ? 3 : 2;
  const displayStep = needsRelationshipStage ? step : step > 1 ? step - 1 : step;

  useEffect(() => {
    let isCurrent = true;

    async function checkOnboardingStatus() {
      getOrCreateAnonymousUser();
      const preference = await hydrateOnboarding();

      if (!isCurrent) return;

      if (preference?.completedOnboarding) {
        router.replace('/home');
        return;
      }

      setIsCheckingOnboarding(false);
    }

    void checkOnboardingStatus();

    return () => {
      isCurrent = false;
    };
  }, [hydrateOnboarding, router]);

  const saveAndGoHome = (completedOnboarding: boolean) => {
    savePreference({
      relationshipType: data.relationshipType,
      relationshipStage: needsRelationshipStage ? data.relationshipStage : undefined,
      preferredTone: data.preferredTone,
      completedOnboarding,
    });
    router.push('/home');
  };

  const handleNext = () => {
    if (step === 1 && !needsRelationshipStage) {
      setStep(3);
      return;
    }

    if (step < 3) {
      setStep((currentStep) => currentStep + 1);
    } else {
      saveAndGoHome(true);
    }
  };

  const handleBack = () => {
    if (step === 3 && !needsRelationshipStage) {
      setStep(1);
    } else if (step > 1) {
      setStep((currentStep) => currentStep - 1);
    } else {
      router.push('/');
    }
  };

  const handleSkip = () => {
    saveAndGoHome(true);
  };

  if (isCheckingOnboarding) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            aria-label="back"
            className="flex items-center gap-2 min-h-11 text-[#58413c] hover:text-[#a93718] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-['Hanken_Grotesk',sans-serif] font-medium">
              Kembali
            </span>
          </button>
          <div className="text-[#58413c] font-['Hanken_Grotesk',sans-serif] font-medium">
            {displayStep}/{totalSteps}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#f0edec] rounded-full mb-12 border-2 border-[#1c1b1b]">
          <div
            className="h-full bg-[#ff7551] rounded-full transition-all duration-300 border-r-2 border-[#1c1b1b]"
            style={{ width: `${(displayStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        {step === 1 && (
          <Step1
            selected={data.relationshipType}
            onSelect={(value) => setData({ ...data, relationshipType: value })}
          />
        )}
        {step === 2 && needsRelationshipStage && (
          <Step2
            selected={data.relationshipStage}
            onSelect={(value) => setData({ ...data, relationshipStage: value })}
          />
        )}
        {step === 3 && (
          <Step3
            selected={data.preferredTone}
            onSelect={(value) => setData({ ...data, preferredTone: value })}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-12">
          {step === 3 && (
            <button
              onClick={handleSkip}
              className="flex-1 min-h-11 bg-[#f0edec] drop-shadow-[4px_4px_0px_#1c1b1b] border-2 border-[#1c1b1b] rounded-lg px-6 py-4 font-['Hanken_Grotesk',sans-serif] font-bold text-[#58413c] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
            >
              Lewati
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={(step === 1 && !data.relationshipType) || (step === 2 && needsRelationshipStage && !data.relationshipStage)}
            className="flex-1 min-h-11 bg-[#ff7551] drop-shadow-[4px_4px_0px_#1c1b1b] border-2 border-[#1c1b1b] rounded-lg px-6 py-4 font-['Hanken_Grotesk',sans-serif] font-bold text-[#6b1500] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#1c1b1b] flex items-center justify-center gap-2"
          >
            {step === 3 ? 'Selesai' : 'Lanjut'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Step1({
  selected,
  onSelect,
}: {
  selected?: RelationshipType;
  onSelect: (value: RelationshipType) => void;
}) {
  const options: Array<{
    value: RelationshipType;
    label: string;
    icon: string;
  }> = [
      { value: 'partner', label: 'Pasangan', icon: '❤️' },
      { value: 'pdkt', label: 'Gebetan / PDKT', icon: '💕' },
      { value: 'friend', label: 'Sahabat', icon: '🤝' },
      { value: 'family', label: 'Keluarga', icon: '👨‍👩‍👧‍👦' },
      { value: 'self', label: 'Diri Sendiri', icon: '🪞' },
    ];

  return (
    <div>
      <h2 className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[32px] md:text-[48px] text-[#1c1b1b] mb-4 tracking-[-0.96px]">
        Kamu ingin bermain dengan siapa?
      </h2>
      <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[16px] md:text-[18px] text-[#58413c] mb-8">
        Pilih satu yang paling sesuai dengan situasi kamu sekarang.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`p-6 rounded-lg border-2 border-[#1c1b1b] font-['Hanken_Grotesk',sans-serif] font-bold text-left transition-all ${selected === option.value
                ? 'bg-[#ff7551] text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b]'
                : 'bg-white text-[#1c1b1b] hover:shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[-2px]'
              }`}
          >
            <div className="text-3xl mb-2">{option.icon}</div>
            <div className="text-lg">{option.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2({
  selected,
  onSelect,
}: {
  selected?: RelationshipStage;
  onSelect: (value: RelationshipStage) => void;
}) {
  const options: Array<{
    value: RelationshipStage;
    label: string;
    icon: string;
  }> = [
      { value: 'new', label: 'Baru Dekat', icon: '🌱' },
      { value: 'dating', label: 'Pacaran', icon: '💑' },
      { value: 'ldr', label: 'LDR', icon: '✈️' },
      { value: 'engaged', label: 'Tunangan', icon: '💍' },
      { value: 'married', label: 'Menikah', icon: '👰' },
    ];

  return (
    <div>
      <h2 className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[32px] md:text-[48px] text-[#1c1b1b] mb-4 tracking-[-0.96px]">
        Situasi kalian sekarang?
      </h2>
      <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[16px] md:text-[18px] text-[#58413c] mb-8">
        Ini akan membantu kami merekomendasikan deck yang tepat.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`p-6 rounded-lg border-2 border-[#1c1b1b] font-['Hanken_Grotesk',sans-serif] font-bold text-left transition-all ${selected === option.value
                ? 'bg-[#ff7551] text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b]'
                : 'bg-white text-[#1c1b1b] hover:shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[-2px]'
              }`}
          >
            <div className="text-3xl mb-2">{option.icon}</div>
            <div className="text-lg">{option.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step3({
  selected,
  onSelect,
}: {
  selected?: PreferredTone;
  onSelect: (value: PreferredTone) => void;
}) {
  const options: Array<{
    value: PreferredTone;
    label: string;
    icon: string;
    description: string;
  }> = [
      {
        value: 'casual',
        label: 'Santai',
        icon: '☕',
        description: 'Obrolan ringan dan menyenangkan',
      },
      {
        value: 'honest',
        label: 'Jujur',
        icon: '💬',
        description: 'Terbuka dan apa adanya',
      },
      {
        value: 'fun',
        label: 'Seru',
        icon: '🎉',
        description: 'Penuh tawa dan energi',
      },
      {
        value: 'serious',
        label: 'Serius',
        icon: '🤔',
        description: 'Mendalam dan bermakna',
      },
    ];

  return (
    <div>
      <h2 className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[32px] md:text-[48px] text-[#1c1b1b] mb-4 tracking-[-0.96px]">
        Mau mulai dari obrolan seperti apa?
      </h2>
      <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[16px] md:text-[18px] text-[#58413c] mb-2">
        Pilih vibes yang kamu mau. Atau lewati kalau belum yakin.
      </p>
      <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-[14px] text-[#a93718] mb-8">
        ✨ Opsional
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`p-6 rounded-lg border-2 border-[#1c1b1b] font-['Hanken_Grotesk',sans-serif] font-bold text-left transition-all ${selected === option.value
                ? 'bg-[#ff7551] text-[#6b1500] shadow-[4px_4px_0px_#1c1b1b]'
                : 'bg-white text-[#1c1b1b] hover:shadow-[4px_4px_0px_#1c1b1b] hover:translate-y-[-2px]'
              }`}
          >
            <div className="text-3xl mb-2">{option.icon}</div>
            <div className="text-lg mb-1">{option.label}</div>
            <div className="text-sm font-normal opacity-75">
              {option.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
