export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <div className="h-16 border-b border-stone-200/80 bg-white animate-pulse" />
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 rounded-full border-2 border-stone-300 border-t-stone-800 animate-spin" />
        <p className="font-serif text-sm tracking-widest uppercase text-stone-500 font-light">
          Memuat Koleksi Busana...
        </p>
      </div>
      <div className="h-24 border-t border-stone-200/80 bg-stone-50" />
    </div>
  );
}
