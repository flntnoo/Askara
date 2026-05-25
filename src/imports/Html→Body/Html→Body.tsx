import Image from "next/image";
import svgPaths from "./svg-qb52pbrj0u";
import imgImage from "./66a613613943ccc4bb9a7a0a94d3d47d22fb179b.png";
import imgImage1 from "./020d3a901f1034f8d75c81427db8c9fb11ba8923.png";

function Heading1HeadlineBrandLogo() {
  return (
    <div className="h-[52.8px] relative shrink-0 w-[158.27px]" data-name="Heading 1 - Headline / Brand Logo">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Hanken_Grotesk:ExtraBold_Italic',sans-serif] font-extrabold italic justify-center leading-[0] left-0 text-[#a93718] text-[48px] top-[25.5px] tracking-[-2.4px] uppercase whitespace-nowrap">
        <p className="leading-[52.8px]">ASKARA</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="bg-[#ff7551] content-stretch drop-shadow-[4px_4px_0px_#1c1b1b] flex flex-col items-start px-[14px] py-[6px] relative rounded-[8px] shrink-0" data-name="Link">
      <div aria-hidden="true" className="absolute border-2 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#a93718] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Home</p>
      </div>
    </div>
  );
}

function LinkMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[24px] relative shrink-0" data-name="Link:margin">
      <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#58413c] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Decks</p>
      </div>
    </div>
  );
}

function LinkMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[24px] relative shrink-0" data-name="Link:margin">
      <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#58413c] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Favorites</p>
      </div>
    </div>
  );
}

function LinkMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[24px] relative shrink-0" data-name="Link:margin">
      <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#58413c] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Settings</p>
      </div>
    </div>
  );
}

function WebNavigationClusterHiddenOnMobile() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Web Navigation Cluster (Hidden on Mobile)">
      <Link />
      <LinkMargin />
      <LinkMargin1 />
      <LinkMargin2 />
    </div>
  );
}

function WebNavigationClusterHiddenOnMobileMargin() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Web Navigation Cluster (Hidden on Mobile):margin">
      <div className="content-stretch flex flex-col items-start pl-[32px] relative size-full">
        <WebNavigationClusterHiddenOnMobile />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #A93718)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ButtonSearch() {
  return (
    <div className="bg-[#f0edec] content-stretch flex flex-col items-center justify-center p-[10px] relative rounded-[9999px] shrink-0" data-name="Button - Search">
      <div aria-hidden="true" className="absolute border-2 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container1 />
    </div>
  );
}

function Container() {
  return (
    <div className="max-w-[1152px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between max-w-[inherit] py-[16px] relative size-full">
        <Heading1HeadlineBrandLogo />
        <WebNavigationClusterHiddenOnMobileMargin />
        <ButtonSearch />
      </div>
    </div>
  );
}

function HeaderTopAppBar() {
  return (
    <div className="bg-[#fcf9f8] relative shrink-0 w-full z-[2]" data-name="Header - TopAppBar">
      <div aria-hidden="true" className="absolute border-[#1c1b1b] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[2px] pt-[24px] px-[64px] relative size-full">
        <Container />
      </div>
    </div>
  );
}

function ParagraphBackgroundBorderShadow() {
  return (
    <div className="bg-[#ffe087] content-stretch drop-shadow-[4px_4px_0px_#1c1b1b] flex flex-col items-start pl-[10.001px] pr-[81.213px] py-[6px] relative" data-name="Paragraph+Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border-2 border-[#1c1b1b] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Hanken_Grotesk:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] mb-[-0.001px] relative shrink-0 text-[#a93718] text-[48px] tracking-[-0.96px] whitespace-nowrap">
        <p className="leading-[60px]">sekarang cukup dari</p>
      </div>
      <div className="flex flex-col font-['Hanken_Grotesk:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#a93718] text-[48px] tracking-[-0.96px] whitespace-nowrap">
        <p className="leading-[60px]">satu kartu.</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[260px] relative shrink-0 w-[520px]" data-name="Heading 2">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Hanken_Grotesk:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] left-0 text-[#1c1b1b] text-[48px] top-[59.5px] tracking-[-0.96px] whitespace-nowrap">
        <p className="leading-[60px] mb-0">Obrolan yang biasanya</p>
        <p className="leading-[60px]">susah dimulai,</p>
      </div>
      <div className="absolute flex h-[141.054px] items-center justify-center left-[-1.11px] top-[123.47px] w-[522.224px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "43" } as React.CSSProperties}>
        <div className="flex-none rotate-1">
          <ParagraphBackgroundBorderShadow />
        </div>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[512px] pt-[8px] relative shrink-0" data-name="Margin">
      <div className="flex flex-col font-['Hanken_Grotesk:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#58413c] text-[16px] whitespace-nowrap">
        <p className="leading-[24px] mb-0">Bangun koneksi yang lebih dalam dan bermakna. Pilih deck yang sesuai</p>
        <p className="leading-[24px] mb-0">dengan suasana hati, dan biarkan pertanyaan membimbing percakapan</p>
        <p className="leading-[24px]">Anda.</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[14px] relative shrink-0 w-[11px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 14">
        <g id="Container">
          <path d={svgPaths.p30eba500} fill="var(--fill-0, #6B1500)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#ff7551] content-stretch drop-shadow-[4px_4px_0px_#1c1b1b] flex gap-[8px] items-center px-[34px] py-[18px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#6b1500] text-[20px] text-center whitespace-nowrap">
        <p className="leading-[28px]">Mulai Bermain</p>
      </div>
      <Container3 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0" data-name="Margin">
      <Button />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative" data-name="Container">
      <Heading />
      <Margin />
      <Margin1 />
    </div>
  );
}

function DecorativeAbstractHeroImageBox() {
  return (
    <div className="bg-[#e2dfff] relative rounded-[12px] size-full" data-name="Decorative Abstract Hero Image Box">
      <div className="content-stretch flex items-center justify-center overflow-clip p-[4px] relative rounded-[inherit] size-full">
        <div className="flex-[1_0_0] h-full min-w-px mix-blend-multiply opacity-80 relative" data-name="Image">
          <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
            <Image alt="" className="absolute h-full left-[-0.39%] max-w-none top-0 w-[100.77%]" src={imgImage} />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-4 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[4px_4px_0px_0px_#1c1b1b]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Container">
          <path d={svgPaths.p3d6f6510} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#a93718] h-[128.001px] relative rounded-[4px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border-2 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[2px] relative size-full">
        <Container5 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Space_Grotesk:Bold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1c1b1b] text-[14px] w-full">
          <p className="leading-[16.8px]">Deep Talk</p>
        </div>
      </div>
    </div>
  );
}

function FloatingDeckCardIllustration() {
  return (
    <div className="bg-white content-stretch drop-shadow-[4px_4px_0px_#1c1b1b] flex flex-col gap-[12.006px] items-start p-[18px] relative rounded-[8px] w-[192px]" data-name="Floating Deck Card Illustration">
      <div aria-hidden="true" className="absolute border-2 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <BackgroundBorder />
      <Container6 />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[38px] relative shrink-0 w-[32px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 38">
        <g id="Container">
          <path d={svgPaths.p38897480} fill="var(--fill-0, #1C1B1B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#ffe087] h-[128.006px] relative rounded-[4px] shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border-2 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[2px] relative size-full">
        <Container7 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Space_Grotesk:Bold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1c1b1b] text-[14px] w-full">
          <p className="leading-[16.8px]">Ice Breaker</p>
        </div>
      </div>
    </div>
  );
}

function FloatingDeckCardIllustration1() {
  return (
    <div className="bg-white content-stretch drop-shadow-[4px_4px_0px_#1c1b1b] flex flex-col gap-[11.991px] items-start p-[18px] relative rounded-[8px] w-[192px]" data-name="Floating Deck Card Illustration">
      <div aria-hidden="true" className="absolute border-2 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <BackgroundBorder1 />
      <Container8 />
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] h-[400px] min-w-px relative" data-name="Container">
      <div className="absolute flex inset-[-8.96px_-6.82px_-8.95px_-6.82px] items-center justify-center" style={{ containerType: "size" }}>
        <div className="flex-none h-[hypot(-2.61595cqw,95.6575cqh)] rotate-2 w-[hypot(97.384cqw,4.34254cqh)]">
          <DecorativeAbstractHeroImageBox />
        </div>
      </div>
      <div className="absolute bottom-[30.5px] flex h-[212.02px] items-center justify-center left-[-33.55px] w-[211.123px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "43" } as React.CSSProperties}>
        <div className="-rotate-6 flex-none">
          <FloatingDeckCardIllustration />
        </div>
      </div>
      <div className="absolute flex h-[228.699px] items-center justify-center right-[-33.94px] top-[22.14px] w-[227.931px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "43" } as React.CSSProperties}>
        <div className="flex-none rotate-12">
          <FloatingDeckCardIllustration1 />
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="content-stretch flex gap-[32px] items-center justify-center relative shrink-0 w-full" data-name="Hero Section">
      <Container2 />
      <Container4 />
    </div>
  );
}

function SeparatorDivider() {
  return (
    <div className="h-[4px] relative shrink-0 w-full" data-name="Separator - Divider">
      <div aria-hidden="true" className="absolute border-[#1c1b1b] border-solid border-t-4 inset-0 pointer-events-none" />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[52.8px] relative shrink-0 w-[328.34px]" data-name="Heading 3">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Hanken_Grotesk:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] left-0 text-[#1c1b1b] text-[48px] top-[25.5px] tracking-[-0.96px] whitespace-nowrap">
        <p className="leading-[52.8px]">Featured Decks</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p1a406200} fill="var(--fill-0, #A93718)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex gap-[3.99px] items-center relative shrink-0" data-name="Button">
      <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#a93718] text-[20px] text-center whitespace-nowrap">
        <p className="leading-[28px]">View All</p>
      </div>
      <Container10 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Button1 />
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white content-stretch drop-shadow-[4px_4px_0px_#1c1b1b] flex flex-col items-start pb-[17.89px] pt-[17.5px] px-[18px] relative rounded-[8px] shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border-2 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Space_Grotesk:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#a93718] text-[12px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[14.4px]">TRENDING</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[8px] relative size-full">
        <BackgroundBorderShadow />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="drop-shadow-[0px_2px_1px_rgba(0,0,0,0.06),0px_4px_1.5px_rgba(0,0,0,0.07)] relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[32px] text-white tracking-[-0.32px] whitespace-nowrap">
          <p className="leading-[38.4px]">Pasangan Baru</p>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[384px] opacity-90 relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[14px] text-white w-full">
        <p className="leading-[21px] mb-0">Kenali pasanganmu lebih dalam dengan pertanyaan-</p>
        <p className="leading-[21px]">pertanyaan yang tak terduga.</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="max-w-[384px] relative shrink-0 w-[384px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start max-w-[inherit] pt-[4px] relative size-full">
        <Container12 />
      </div>
    </div>
  );
}

function ArticleDeckCard1LargeSpan() {
  return (
    <div className="bg-[#6863e7] col-[1/span_2] justify-self-stretch relative rounded-[12px] row-[1/span_2] self-stretch shrink-0" data-name="Article - Deck Card 1 (Large Span)">
      <div className="flex flex-col justify-end overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-end p-[28px] relative size-full">
          <div className="absolute inset-[4px_4.01px_4px_4px] mix-blend-overlay opacity-50" data-name="Image">
            <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
              <Image alt="" className="absolute h-full left-[-15.63%] max-w-none top-0 w-[131.26%]" src={imgImage1} />
            </div>
          </div>
          <Margin2 />
          <Heading2 />
          <Margin3 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-4 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[4px_4px_0px_0px_#1c1b1b]" />
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="h-[39px] relative shrink-0 w-[40px]" data-name="Background+Border+Shadow">
      <div className="absolute inset-[0_-10%_-10.26%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 43">
          <g filter="url(#filter0_d_1_118)" id="Background+Border+Shadow">
            <rect fill="var(--fill-0, white)" height="39" rx="19.5" shapeRendering="crispEdges" width="40" />
            <rect height="37" rx="18.5" shapeRendering="crispEdges" stroke="var(--stroke-0, #1C1B1B)" strokeWidth="2" width="38" x="1" y="1" />
            <path d={svgPaths.p1c6ef280} fill="var(--fill-0, #735C00)" id="Icon" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="43" id="filter0_d_1_118" width="44" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="4" dy="4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.109804 0 0 0 0 0.105882 0 0 0 0 0.105882 0 0 0 1 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_118" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_118" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
      <BackgroundBorderShadow1 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="flex-[1_0_0] min-h-[44px] relative w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-h-[inherit] pb-[89px] relative size-full">
        <Container13 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#1c1b1b] text-[20px] w-full">
        <p className="leading-[28px]">Rekan Kerja</p>
      </div>
    </div>
  );
}

function Heading4Margin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[24px] relative size-full">
        <Heading3 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#58413c] text-[14px] w-full">
        <p className="leading-[21px]">Bikin suasana kantor lebih cair.</p>
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative size-full">
        <Container14 />
      </div>
    </div>
  );
}

function ArticleDeckCard() {
  return (
    <div className="bg-[#ffe087] col-3 justify-self-stretch relative rounded-[12px] row-1 self-stretch shrink-0" data-name="Article - Deck Card 2">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[20px] relative size-full">
          <Margin4 />
          <Heading4Margin />
          <Margin5 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-4 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[4px_4px_0px_0px_#1c1b1b]" />
    </div>
  );
}

function BackgroundBorderShadow2() {
  return (
    <div className="h-[40px] relative shrink-0 w-[40.5px]" data-name="Background+Border+Shadow">
      <div className="absolute inset-[0_-9.88%_-10%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44.5 44">
          <g filter="url(#filter0_d_1_106)" id="Background+Border+Shadow">
            <rect fill="var(--fill-0, #A93718)" height="40" rx="20" shapeRendering="crispEdges" width="40.5" />
            <rect height="38" rx="19" shapeRendering="crispEdges" stroke="var(--stroke-0, #1C1B1B)" strokeWidth="2" width="38.5" x="1" y="1" />
            <path d={svgPaths.p3a6d5280} fill="var(--fill-0, white)" id="Icon" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="44" id="filter0_d_1_106" width="44.5" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="4" dy="4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.109804 0 0 0 0 0.105882 0 0 0 0 0.105882 0 0 0 1 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_106" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_106" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
      <BackgroundBorderShadow2 />
    </div>
  );
}

function Margin6() {
  return (
    <div className="flex-[1_0_0] min-h-[44px] relative w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-h-[inherit] pb-[89px] relative size-full">
        <Container15 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Hanken_Grotesk:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#1c1b1b] text-[20px] w-full">
        <p className="leading-[28px]">Keluarga Besar</p>
      </div>
    </div>
  );
}

function Heading4Margin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[24px] relative size-full">
        <Heading4 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Hanken_Grotesk:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#58413c] text-[14px] w-full">
        <p className="leading-[21px]">Pertanyaan nostalgia untuk kumpul keluarga.</p>
      </div>
    </div>
  );
}

function Margin7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative size-full">
        <Container16 />
      </div>
    </div>
  );
}

function ArticleDeckCard1() {
  return (
    <div className="bg-[#ebe7e7] col-3 justify-self-stretch relative rounded-[12px] row-2 self-stretch shrink-0" data-name="Article - Deck Card 3">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[20px] relative size-full">
          <Margin6 />
          <Heading4Margin1 />
          <Margin7 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-4 border-[#1c1b1b] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[4px_4px_0px_0px_#1c1b1b]" />
    </div>
  );
}

function Container11() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[__250px_250px] h-[524px] relative shrink-0 w-full" data-name="Container">
      <ArticleDeckCard1LargeSpan />
      <ArticleDeckCard />
      <ArticleDeckCard1 />
    </div>
  );
}

function FeaturedDecksSectionBentoGrid() {
  return (
    <div className="content-stretch flex flex-col gap-[23.99px] items-start relative shrink-0 w-full" data-name="Featured Decks Section (Bento Grid)">
      <Container9 />
      <Container11 />
    </div>
  );
}

function Main() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[1152px] pt-[32px] px-[40px] relative shrink-0 w-[1152px] z-[1]" data-name="Main">
      <HeroSection />
      <SeparatorDivider />
      <FeaturedDecksSectionBentoGrid />
    </div>
  );
}

export default function HtmlBody() {
  return (
    <div className="content-stretch flex flex-col isolate items-center pb-[32.4px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(252, 249, 248) 0%, rgb(252, 249, 248) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Html → Body">
      <HeaderTopAppBar />
      <Main />
    </div>
  );
}
