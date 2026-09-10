import React from 'react';

interface FooterProps {
  onOpenApiModal: () => void;
  onOpenNodesModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenApiModal,
  onOpenNodesModal,
}) => {
  return (
    <footer className="w-full bg-[#0d0e13] border-t border-[#1e1f25] py-8 mt-16 transition-colors">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Left branding */}
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm text-[#e3e1e9]">CryptoTrail</span>
          <span className="font-mono text-[11px] text-[#c2c6d7] px-1.5 py-0.5 bg-[#1a1b21] border border-[#292a2f] rounded">
            v2.4.0-core
          </span>
        </div>

        {/* Center navigation */}
        <div className="flex items-center gap-6">
          <button
            id="footer-api-link"
            type="button"
            onClick={onOpenApiModal}
            className="font-mono text-xs text-[#c2c6d7] hover:text-[#ffb693] transition-colors uppercase tracking-wider cursor-pointer"
          >
            API
          </button>
          <button
            id="footer-status-link"
            type="button"
            onClick={onOpenNodesModal}
            className="font-mono text-xs text-[#c2c6d7] hover:text-[#ffb693] transition-colors uppercase tracking-wider cursor-pointer"
          >
            Status
          </button>
          <button
            id="footer-nodes-link"
            type="button"
            onClick={onOpenNodesModal}
            className="font-mono text-xs text-[#c2c6d7] hover:text-[#ffb693] transition-colors uppercase tracking-wider cursor-pointer"
          >
            Nodes
          </button>
        </div>

        {/* Right copyright */}
        <div className="text-[#c2c6d7] text-center md:text-right">
          © 2024 CryptoTrail Forensic Protocol. Institutional Grade.
        </div>
      </div>
    </footer>
  );
};
