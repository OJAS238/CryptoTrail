import React, { useState } from 'react';
import { Server, ShieldCheck, CheckCircle2, ChevronDown, User, ExternalLink } from 'lucide-react';

interface HeaderProps {
  currentTab: 'new-trace' | 'history';
  onSelectTab: (tab: 'new-trace' | 'history') => void;
  historyCount: number;
  onOpenNodesModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  historyCount,
  onOpenNodesModal,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0e13]/90 backdrop-blur-md border-b border-[#1e1f25]">
      <div className="h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onSelectTab('new-trace')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img 
              alt="CryptoTrail Logo"
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1U2-uNkZ_4dUWJhmYH7TGnHdkKSWQdiOUIsPZDx2TZTnzqSEs6Hh4tc1bHqUY9L5-PRF284b1oC9s9RgbqBnGWOphiEyhz6c7ZmntSoGwTJ8cUBSA_a1G2yh8COcgdtwUcydny_YPeB_vN4ypmxZQL5arw65MOI_Ydrr7NxeXgF71Eo67I1tKt-w2L4R6URBtNOurQLCY5__IFHV2a2TmiVB56MW-jtWgSgV548KOW9GU8NqcY_sitMEp8b"
            />
            <span className="font-semibold text-lg tracking-tight text-[#e3e1e9] group-hover:text-white transition-colors">
              CryptoTrail
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-1 bg-[#1a1b21] border border-[#292a2f] rounded">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6b00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6b00]"></span>
            </span>
            <span className="font-mono text-[10px] tracking-wider text-[#a98a7d] uppercase font-medium">
              MAINNET TELEMETRY
            </span>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-[#1a1b21] border border-[#292a2f] rounded-xl shadow-inner">
          <button
            id="tab-new-trace"
            type="button"
            onClick={() => onSelectTab('new-trace')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              currentTab === 'new-trace'
                ? 'bg-[#ff6b00] text-[#121318] shadow-sm font-bold'
                : 'text-[#c2c6d7] hover:bg-[#292a2f] hover:text-[#e3e1e9]'
            }`}
          >
            New Trace
          </button>
          <button
            id="tab-history"
            type="button"
            onClick={() => onSelectTab('history')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              currentTab === 'history'
                ? 'bg-[#ff6b00] text-[#121318] shadow-sm font-bold'
                : 'text-[#c2c6d7] hover:bg-[#292a2f] hover:text-[#e3e1e9]'
            }`}
          >
            <span>History</span>
            {historyCount > 0 && (
              <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
                currentTab === 'history' ? 'bg-[#561f00] text-[#ffdbcc]' : 'bg-[#292a2f] text-[#c2c6d7]'
              }`}>
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Info & Profile */}
        <div className="flex items-center gap-3">
          <button
            id="btn-node-sync"
            type="button"
            onClick={onOpenNodesModal}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#1a1b21] hover:bg-[#292a2f] border border-[#292a2f] hover:border-[#a98a7d]/40 rounded transition-colors group text-left cursor-pointer"
            title="Click to view Node Ingest Telemetry"
          >
            <Server className="w-3.5 h-3.5 text-[#9ccaff] group-hover:text-[#ff6b00] transition-colors" />
            <span className="font-mono text-xs text-[#c2c6d7] tracking-tight">
              SYNCED <span className="text-[#ffb693]">#19482103</span>
            </span>
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              id="profile-dropdown-btn"
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-0.5 rounded-full ring-1 ring-[#292a2f] hover:ring-[#ff6b00] transition-all"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida/AEtjO1UjQqPQmhKhJZUmWQC09DdfbQ16goa7aQtkOw4RbUyOyzlEhkY7WU_-VXy0iuvzXYZBMLXvGNxoQt056oNanOTlZeq044up3bxSGgmnPv3JW_g1DDZmVSOScVc-23A95U37wU27XgluNYe_Nxpu10qdhg9iNTzWhc-8H4zZuF42qBSZFfNJVSdxsH3uAWbZJrVj680_9pOEGffAtuvnoq40g2P8-MQ2UZnqz0OMlZmjC5Aiho2dFGJ6M4gh"
              />
            </button>

            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 p-3 bg-[#1e1f25] border border-[#292a2f] rounded-xl shadow-2xl z-50 text-xs"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#292a2f]">
                  <img
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-[#ff6b00]"
                    src="https://lh3.googleusercontent.com/aida/AEtjO1UjQqPQmhKhJZUmWQC09DdfbQ16goa7aQtkOw4RbUyOyzlEhkY7WU_-VXy0iuvzXYZBMLXvGNxoQt056oNanOTlZeq044up3bxSGgmnPv3JW_g1DDZmVSOScVc-23A95U37wU27XgluNYe_Nxpu10qdhg9iNTzWhc-8H4zZuF42qBSZFfNJVSdxsH3uAWbZJrVj680_9pOEGffAtuvnoq40g2P8-MQ2UZnqz0OMlZmjC5Aiho2dFGJ6M4gh"
                  />
                  <div>
                    <div className="font-semibold text-[#e3e1e9]">Forensic Analyst</div>
                    <div className="text-[11px] text-[#c2c6d7] truncate">ojas.babbar.ug25@nsut.ac.in</div>
                  </div>
                </div>

                <div className="pt-2.5 space-y-1.5 text-[#c2c6d7]">
                  <div className="flex justify-between items-center py-1 px-1.5 rounded bg-[#121318]">
                    <span className="text-[11px]">License Tier:</span>
                    <span className="font-mono font-semibold text-[#ffb693] text-[11px]">INSTITUTIONAL CORE</span>
                  </div>
                  <div className="flex justify-between items-center py-1 px-1.5 rounded bg-[#121318]">
                    <span className="text-[11px]">Daily Quota:</span>
                    <span className="font-mono text-[#9ccaff] text-[11px]">8,421 / 10,000</span>
                  </div>
                  <div className="flex justify-between items-center py-1 px-1.5 rounded bg-[#121318]">
                    <span className="text-[11px]">RPC Region:</span>
                    <span className="font-mono text-[#e3e1e9] text-[11px]">GLOBAL-ANYCAST</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
