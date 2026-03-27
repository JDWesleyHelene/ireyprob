export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9990] bg-[#060606] flex flex-col items-center justify-center">
      <div className="absolute inset-0 pointer-events-none flex justify-between px-8 md:px-24">
        <div className="relative w-px h-full bg-white/[0.03] overflow-hidden"><div className="beam beam-d1" /></div>
        <div className="relative w-px h-full bg-white/[0.03] overflow-hidden hidden md:block"><div className="beam beam-d2" /></div>
        <div className="relative w-px h-full bg-white/[0.03] overflow-hidden"><div className="beam beam-d3" /></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <div style={{ animation: "splashLogoIn 0.6s cubic-bezier(0.22,1,0.36,1) both" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ireyprod.com/wp-content/uploads/2026/03/LOGO-PNG.png"
            alt="IREY PROD"
            style={{ height: "110px", width: "auto", objectFit: "contain", animation: "pulseLoader 1.4s ease-in-out infinite" }}
          />
        </div>

        {/* Gold loading bar */}
        <div className="w-32 h-px bg-white/10 overflow-hidden rounded-full">
          <div className="h-full bg-[#D4AF37] rounded-full" style={{ animation: "loadingBar 1.6s cubic-bezier(0.4,0,0.2,1) infinite" }} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes splashLogoIn {
          from { opacity: 0; transform: scale(0.85) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulseLoader {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes loadingBar {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 60%;  margin-left: 20%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}} />
    </div>
  );
}
