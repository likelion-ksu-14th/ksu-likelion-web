import MembersSection from "@/components/sections/MembersSection";
import GallerySection from "@/components/sections/GallerySection";

export default function MembersPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-28 pb-36">
      <div className="space-y-28">
        <MembersSection />
        <GallerySection />
      </div>
    </main>
  );
}
