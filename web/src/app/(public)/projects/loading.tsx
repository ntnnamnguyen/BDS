export default function ProjectsLoading() {
  return (
    <main className="min-h-screen bg-luxury-base pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="h-12 w-80 max-w-full animate-pulse bg-luxury-taupe/30" />
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="space-y-5">
              <div className="aspect-[4/5] animate-pulse bg-luxury-taupe/30" />
              <div className="h-5 w-2/3 animate-pulse bg-luxury-taupe/30" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
