import { useApp } from '@/context/AppContext';

const FAB = () => {
  const { user, openModal } = useApp();
  if (!user || user.is_admin) return null;

  return (
    <button
      onClick={openModal}
      className="fixed bottom-[30px] right-[30px] max-[768px]:bottom-5 max-[768px]:right-5 w-[54px] h-[54px] max-[768px]:w-[50px] max-[768px]:h-[50px] rounded-full border-none cursor-pointer flex items-center justify-center text-2xl max-[768px]:text-[22px] text-white z-[200] animate-fab-in transition-all hover:scale-[1.12] hover:rotate-[8deg] active:scale-95"
      style={{
        background: 'linear-gradient(135deg, #7c4dba, #c2537a)',
        boxShadow: '0 8px 28px rgba(124,77,186,0.45)',
      }}
      title="Report damage"
    >
      ＋
    </button>
  );
};

export default FAB;
