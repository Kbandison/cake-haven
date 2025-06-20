import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import ProductGrid from "@/components/ProductGrid";
import About from "@/components/About";
import BestSellers from "@/components/BestSellers";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <section
        id="products"
        className="relative z-10 py-20 bg-[var(--cake-bg)]"
      >
        <SectionHeader
          title="Our Cakes"
          subtitle="Browse our selection of delicious, handcrafted cakes. Each one made with love and the finest ingredients."
          id="products"
        />
        <ProductGrid />
        <BestSellers />
        <About />
      </section>
    </main>
  );
}
