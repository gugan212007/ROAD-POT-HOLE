import { useApp } from '@/context/AppContext';

const HamburgerMenu = () => {
  const { user, mobileMenu, toggleMenu } = useApp();
  if (!user) return null;

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed top-3 left-3 z-[300] w-[42px] h-[42px] rounded-[11px] border-none cursor-pointer flex md:hidden items-center justify-center flex-col gap-1 transition-all hover:scale-[1.08]"
        style={{
          background: 'linear-gradient(135deg, #7c4dba, #c2537a)',
          boxShadow: '0 4px 16px rgba(107,63,160,0.35)',
        }}
      >
        <span className={`block w-[18px] h-0.5 bg-white rounded-sm transition-all duration-300 ${mobileMenu ? 'translate-y-[6px] rotate-45' : ''}`} />
        <span className={`block w-[18px] h-0.5 bg-white rounded-sm transition-all duration-300 ${mobileMenu ? 'opacity-0 scale-x-0' : ''}`} />
        <span className={`block w-[18px] h-0.5 bg-white rounded-sm transition-all duration-300 ${mobileMenu ? '-translate-y-[6px] -rotate-45' : ''}`} />
      </button>
      {/* Backdrop */}
      {mobileMenu && (
        <div
          className="fixed inset-0 bg-foreground/45 backdrop-blur-sm z-[90] md:hidden animate-fade-up"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default HamburgerMenu;
