'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import svgPaths from '../../imports/Html→Body/svg-qb52pbrj0u';
import imgImage from '../../imports/Html→Body/66a613613943ccc4bb9a7a0a94d3d47d22fb179b.png';
import imgImage1 from '../../imports/Html→Body/020d3a901f1034f8d75c81427db8c9fb11ba8923.png';
import { getOnboardingPreference, getOrCreateAnonymousUser } from '../../utils/storage';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    getOrCreateAnonymousUser();
    const onboarding = getOnboardingPreference();
    if (onboarding?.completedOnboarding) {
      router.push('/home');
    }
  }, [router]);

  return (
    <div className="content-stretch flex flex-col isolate items-center pb-[24px] md:pb-[32.4px] relative min-h-screen w-full">
      <HeaderTopAppBar />
      <Main />
    </div>
  );
}

function Heading1HeadlineBrandLogo() {
  return (
    <div className="h-[40px] md:h-[52.8px] relative shrink-0 w-[120px] md:w-[158.27px]">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Hanken_Grotesk',sans-serif] font-extrabold italic justify-center leading-[0] left-0 text-[#a93718] text-[32px] md:text-[48px] top-1/2 tracking-[-1.6px] md:tracking-[-2.4px] uppercase whitespace-nowrap">
        <p className="leading-[40px] md:leading-[52.8px]">CONVO</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g id="Container">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #A93718)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ButtonSearch() {
  return (
    <div className="bg-[#f0edec] content-stretch flex flex-col items-center justify-center p-[8px] md:p-[10px] relative rounded-[9999px] shrink-0">
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[9999px]"
      />
      <Container1 />
    </div>
  );
}

function Container() {
  return (
    <div className="max-w-[1152px] relative shrink-0 w-full">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between max-w-[inherit] py-[16px] relative size-full">
        <Heading1HeadlineBrandLogo />
        <div className="flex-1 min-w-px"></div>
        <ButtonSearch />
      </div>
    </div>
  );
}

function HeaderTopAppBar() {
  return (
    <div className="bg-[#fcf9f8] relative shrink-0 w-full z-[2]">
      <div
        aria-hidden="true"
        className="absolute border-[#1c1b1b] border-b-2 border-solid inset-0 pointer-events-none"
      />
      <div className="content-stretch flex flex-col items-start pb-[2px] pt-[16px] md:pt-[24px] px-[16px] md:px-[64px] relative size-full">
        <Container />
      </div>
    </div>
  );
}

function ParagraphBackgroundBorderShadow() {
  return (
    <div className="bg-[#ffe087] content-stretch drop-shadow-[4px_4px_0px_#1c1b1b] flex flex-col items-start px-[8px] md:pl-[10.001px] md:pr-[81.213px] py-[4px] md:py-[6px] relative">
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#1c1b1b] border-solid inset-0 pointer-events-none"
      />
      <div className="flex flex-col font-['Hanken_Grotesk',sans-serif] font-extrabold justify-center leading-[0] mb-[-0.001px] relative shrink-0 text-[#a93718] text-[28px] md:text-[48px] tracking-[-0.56px] md:tracking-[-0.96px] whitespace-nowrap">
        <p className="leading-[36px] md:leading-[60px]">sekarang cukup dari</p>
      </div>
      <div className="flex flex-col font-['Hanken_Grotesk',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#a93718] text-[28px] md:text-[48px] tracking-[-0.56px] md:tracking-[-0.96px] whitespace-nowrap">
        <p className="leading-[36px] md:leading-[60px]">satu kartu.</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-auto md:h-[260px] relative shrink-0 w-full md:w-[520px]">
      <div className="md:-translate-y-1/2 static md:absolute flex flex-col font-['Hanken_Grotesk',sans-serif] font-extrabold justify-center leading-[0] left-0 text-[#1c1b1b] text-[28px] md:text-[48px] md:top-[59.5px] tracking-[-0.56px] md:tracking-[-0.96px]">
        <p className="leading-[36px] md:leading-[60px] mb-0">
          Obrolan yang biasanya
        </p>
        <p className="leading-[36px] md:leading-[60px]">susah dimulai,</p>
      </div>
      <div
        className="static md:absolute flex h-auto md:h-[141.054px] items-center justify-start md:justify-center left-0 md:left-[-1.11px] top-[8px] md:top-[123.47px] w-full md:w-[522.224px] mt-[8px] md:mt-0"
        style={
          {
            '--transform-inner-width': '1200',
            '--transform-inner-height': '43',
          } as React.CSSProperties
        }
      >
        <div className="flex-none rotate-1">
          <ParagraphBackgroundBorderShadow />
        </div>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-full md:max-w-[512px] pt-[8px] relative shrink-0">
      <div className="flex flex-col font-['Hanken_Grotesk',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#58413c] text-[14px] md:text-[16px]">
        <p className="leading-[21px] md:leading-[24px] mb-0">
          Bangun koneksi yang lebih dalam dan bermakna. Pilih deck yang sesuai
        </p>
        <p className="leading-[21px] md:leading-[24px] mb-0">
          dengan suasana hati, dan biarkan pertanyaan membimbing percakapan
        </p>
        <p className="leading-[21px] md:leading-[24px]">Anda.</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[14px] relative shrink-0 w-[11px]">
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 11 14"
      >
        <g id="Container">
          <path d={svgPaths.p30eba500} fill="var(--fill-0, #6B1500)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <Link
      href="/onboarding"
      className="bg-[#ff7551] content-stretch drop-shadow-[4px_4px_0px_#1c1b1b] flex gap-[8px] items-center px-[24px] md:px-[34px] py-[14px] md:py-[18px] relative rounded-[8px] shrink-0 hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1c1b1b] transition-all"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[8px]"
      />
      <div className="flex flex-col font-['Hanken_Grotesk',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#6b1500] text-[18px] md:text-[20px] text-center whitespace-nowrap">
        <p className="leading-[26px] md:leading-[28px]">Mulai Bermain</p>
      </div>
      <Container3 />
    </Link>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0">
      <Button />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col md:flex-[1_0_0] gap-[16px] items-start w-full md:min-w-px relative">
      <Heading />
      <Margin />
      <Margin1 />
    </div>
  );
}

function DecorativeAbstractHeroImageBox() {
  return (
    <div className="bg-[#e2dfff] relative rounded-[12px] size-full">
      <div className="content-stretch flex items-center justify-center overflow-clip p-[4px] relative rounded-[inherit] size-full">
        <div className="flex-[1_0_0] h-full min-w-px mix-blend-multiply opacity-80 relative">
          <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
            <img
              alt=""
              className="absolute h-full left-[-0.39%] max-w-none top-0 w-[100.77%]"
              src={imgImage.src}
            />
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border-4 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[4px_4px_0px_0px_#1c1b1b]"
      />
    </div>
  );
}

function Container4() {
  return (
    <div className="hidden md:flex flex-[1_0_0] h-[400px] min-w-px relative">
      <div
        className="absolute flex inset-[-8.96px_-6.82px_-8.95px_-6.82px] items-center justify-center"
        style={{ containerType: 'size' }}
      >
        <div className="flex-none h-[hypot(-2.61595cqw,95.6575cqh)] rotate-2 w-[hypot(97.384cqw,4.34254cqh)]">
          <DecorativeAbstractHeroImageBox />
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="content-stretch flex flex-col md:flex-row gap-[24px] md:gap-[32px] items-start md:items-center justify-center relative shrink-0 w-full">
      <Container2 />
      <Container4 />
    </div>
  );
}

function SeparatorDivider() {
  return (
    <div className="h-[4px] relative shrink-0 w-full">
      <div
        aria-hidden="true"
        className="absolute border-[#1c1b1b] border-solid border-t-4 inset-0 pointer-events-none"
      />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-auto md:h-[52.8px] relative shrink-0 w-auto md:w-[328.34px]">
      <div className="static md:-translate-y-1/2 md:absolute flex flex-col font-['Hanken_Grotesk',sans-serif] font-extrabold justify-center leading-[0] left-0 text-[#1c1b1b] text-[32px] md:text-[48px] md:top-[25.5px] tracking-[-0.64px] md:tracking-[-0.96px] whitespace-nowrap">
        <p className="leading-[40px] md:leading-[52.8px]">Featured Decks</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="Container">
          <path d={svgPaths.p1a406200} fill="var(--fill-0, #A93718)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <Link
      href="/decks"
      className="content-stretch flex gap-[3.99px] items-center relative shrink-0 hover:opacity-80 transition-opacity"
    >
      <div className="flex flex-col font-['Hanken_Grotesk',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#a93718] text-[16px] md:text-[20px] text-center whitespace-nowrap">
        <p className="leading-[24px] md:leading-[28px]">Lihat Semua</p>
      </div>
      <Container10 />
    </Link>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full">
      <Heading1 />
      <Button1 />
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white content-stretch drop-shadow-[4px_4px_0px_#1c1b1b] flex flex-col items-start pb-[12px] md:pb-[17.89px] pt-[12px] md:pt-[17.5px] px-[14px] md:px-[18px] relative rounded-[6px] md:rounded-[8px] shrink-0">
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[6px] md:rounded-[8px]"
      />
      <div className="flex flex-col font-['Space_Grotesk',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#a93718] text-[11px] md:text-[12px] tracking-[1.1px] md:tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[13.2px] md:leading-[14.4px]">TRENDING</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[6px] md:pb-[8px] relative size-full">
        <BackgroundBorderShadow />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="drop-shadow-[0px_2px_1px_rgba(0,0,0,0.06),0px_4px_1.5px_rgba(0,0,0,0.07)] relative shrink-0 w-full">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Hanken_Grotesk',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[24px] md:text-[32px] text-white tracking-[-0.24px] md:tracking-[-0.32px] whitespace-nowrap">
          <p className="leading-[32px] md:leading-[38.4px]">Pasangan Baru</p>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-full md:max-w-[384px] opacity-90 relative shrink-0 w-full">
      <div className="flex flex-col font-['Hanken_Grotesk',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[13px] md:text-[14px] text-white w-full">
        <p className="leading-[20px] md:leading-[21px] mb-0">
          Kenali pasanganmu lebih dalam dengan pertanyaan-
        </p>
        <p className="leading-[20px] md:leading-[21px]">
          pertanyaan yang tak terduga.
        </p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="max-w-full md:max-w-[384px] relative shrink-0 w-full md:w-[384px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] pt-[4px] relative size-full">
        <Container12 />
      </div>
    </div>
  );
}

function ArticleDeckCard1LargeSpan() {
  return (
    <Link
      href="/decks/pacaran"
      className="bg-[#6863e7] col-[1/span_2] md:col-[1/span_2] justify-self-stretch relative rounded-[12px] row-[1/span_2] md:row-[1/span_2] self-stretch shrink-0 hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1c1b1b] transition-all"
    >
      <div className="flex flex-col justify-end overflow-clip rounded-[inherit] size-full min-h-[300px] md:min-h-0">
        <div className="content-stretch flex flex-col items-start justify-end p-[20px] md:p-[28px] relative size-full">
          <div className="absolute inset-[4px_4.01px_4px_4px] mix-blend-overlay opacity-50">
            <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
              <img
                alt=""
                className="absolute h-full left-[-15.63%] max-w-none top-0 w-[131.26%]"
                src={imgImage1.src}
              />
            </div>
          </div>
          <Margin2 />
          <Heading2 />
          <Margin3 />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border-4 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[4px_4px_0px_0px_#1c1b1b]"
      />
    </Link>
  );
}

function FeaturedDecksSectionBentoGrid() {
  return (
    <div className="content-stretch flex flex-col gap-[23.99px] items-start relative shrink-0 w-full">
      <Container9 />
      <div className="gap-[16px] md:gap-x-[24px] md:gap-y-[24px] grid grid-cols-[repeat(2,minmax(0,1fr))] md:grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[auto] md:grid-rows-[250px_250px] h-auto md:h-[524px] relative shrink-0 w-full">
        <ArticleDeckCard1LargeSpan />
      </div>
    </div>
  );
}

function HowItWorksSection() {
  const steps = [
    { label: 'Pilih Deck', detail: 'Cari tema obrolan yang paling pas untuk situasi kalian.' },
    { label: 'Buka Kartu', detail: 'Ambil satu pertanyaan dan biarkan obrolan berjalan pelan.' },
    { label: 'Simpan Favorit', detail: 'Tandai kartu yang ingin dibahas lagi nanti.' },
  ];

  return (
    <section className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <h2 className="font-['Hanken_Grotesk',sans-serif] font-extrabold text-[32px] md:text-[48px] text-[#1c1b1b] tracking-[-0.96px]">
        Cara Main
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className="bg-white border-2 border-[#1c1b1b] rounded-xl p-6 shadow-[4px_4px_0px_#1c1b1b]"
          >
            <div className="bg-[#ffe087] border-2 border-[#1c1b1b] rounded-lg size-11 flex items-center justify-center font-['Hanken_Grotesk',sans-serif] font-extrabold text-[#a93718] mb-4">
              {index + 1}
            </div>
            <h3 className="font-['Hanken_Grotesk',sans-serif] font-bold text-xl text-[#1c1b1b] mb-2">
              {step.label}
            </h3>
            <p className="font-['Hanken_Grotesk',sans-serif] font-medium text-sm text-[#58413c]">
              {step.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t-4 border-[#1c1b1b] pt-6 w-full font-['Hanken_Grotesk',sans-serif] text-[#58413c] flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
      <p className="font-extrabold text-[#a93718]">CONVO</p>
      <p className="font-medium text-sm">MVP 1.0</p>
      <p className="font-medium text-sm">Guest mode. Data tersimpan di browser kamu.</p>
    </footer>
  );
}

function Main() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] md:gap-[32px] items-start max-w-full md:max-w-[1152px] pt-[24px] md:pt-[32px] px-[16px] md:px-[40px] relative shrink-0 w-full md:w-[1152px] z-[1]">
      <HeroSection />
      <SeparatorDivider />
      <FeaturedDecksSectionBentoGrid />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}
