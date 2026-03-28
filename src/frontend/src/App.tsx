import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Check,
  ChevronDown,
  Flower2,
  Heart,
  MessageCircle,
  PartyPopper,
  Phone,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Category,
  type DecorationItem,
  useGetItemsByCategory,
} from "./hooks/useQueries";

const FALLBACK_ITEMS: DecorationItem[] = [
  {
    id: BigInt(1),
    name: "Rose Petal Arch",
    description:
      "Stunning arch adorned with fresh pink and white roses, perfect for wedding ceremonies.",
    price: BigInt(15000),
    category: Category.Marriage,
    typ: { __kind__: "Flower" } as any,
    imageUrl: "",
  },
  {
    id: BigInt(2),
    name: "Birthday Balloon Bouquet",
    description:
      "Vibrant mixed balloon arrangement in pastel shades. Makes any birthday magical.",
    price: BigInt(4500),
    category: Category.Birthday,
    typ: { __kind__: "Balloon" } as any,
    imageUrl: "",
  },
  {
    id: BigInt(3),
    name: "Elegant Lily Wreath",
    description:
      "Graceful white lily wreath with soft green foliage. A dignified tribute.",
    price: BigInt(8000),
    category: Category.Funeral,
    typ: { __kind__: "Flower" } as any,
    imageUrl: "",
  },
  {
    id: BigInt(4),
    name: "Wedding Balloon Arch",
    description:
      "Organic balloon arch in ivory, blush, and sage. A dreamy backdrop for your big day.",
    price: BigInt(22000),
    category: Category.Marriage,
    typ: { __kind__: "Balloon" } as any,
    imageUrl: "",
  },
  {
    id: BigInt(5),
    name: "Sunflower Party Pack",
    description:
      "Cheerful sunflower centerpieces and matching balloons for a festive birthday.",
    price: BigInt(6500),
    category: Category.Birthday,
    typ: { __kind__: "Flower" } as any,
    imageUrl: "",
  },
  {
    id: BigInt(6),
    name: "Memorial Sympathy Spray",
    description:
      "Soft white chrysanthemums and lavender in a peaceful arrangement for remembrance.",
    price: BigInt(9500),
    category: Category.Funeral,
    typ: { __kind__: "Flower" } as any,
    imageUrl: "",
  },
];

const CATEGORY_IMAGES: Record<string, string> = {
  Birthday: "/assets/generated/category-birthday.dim_600x400.jpg",
  Marriage: "/assets/generated/category-marriage.dim_600x400.jpg",
  Funeral: "/assets/generated/category-funeral.dim_600x400.jpg",
};

const TYPE_IMAGES: Record<string, string> = {
  Flower: "/assets/generated/birthday-flower-decor.dim_800x600.jpg",
  Balloon: "/assets/generated/birthday-balloon-decor.dim_800x600.jpg",
  Birthday_Balloon: "/assets/generated/birthday-balloon-decor.dim_800x600.jpg",
  Birthday_Flower: "/assets/generated/birthday-flower-decor.dim_800x600.jpg",
  Marriage_Flower: "/assets/generated/marriage-flower-decor.dim_800x600.jpg",
  Marriage_Balloon: "/assets/generated/marriage-balloon-decor.dim_800x600.jpg",
  Funeral_Flower: "/assets/generated/funeral-flower-decor.dim_800x600.jpg",
  Funeral_Balloon: "/assets/generated/funeral-flower-decor.dim_800x600.jpg",
};

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6"];

function getItemImage(item: DecorationItem): string {
  if (item.imageUrl) return item.imageUrl;
  const typName =
    typeof item.typ === "object" && item.typ !== null
      ? ((item.typ as any).__kind__ ?? String(item.typ))
      : String(item.typ);
  const key = `${String(item.category)}_${typName}`;
  return TYPE_IMAGES[key] || TYPE_IMAGES[typName] || TYPE_IMAGES.Flower;
}

function getTypeName(typ: any): string {
  if (typeof typ === "object" && typ !== null && "__kind__" in typ)
    return typ.__kind__;
  return String(typ);
}

const CATEGORIES = [
  {
    key: Category.Birthday,
    label: "Birthday",
    icon: <PartyPopper className="w-6 h-6" />,
    desc: "Playful and vibrant decor to make every birthday unforgettable.",
    image: CATEGORY_IMAGES.Birthday,
  },
  {
    key: Category.Marriage,
    label: "Marriage",
    icon: <Heart className="w-6 h-6" />,
    desc: "Timeless floral elegance and romantic balloon arrangements.",
    image: CATEGORY_IMAGES.Marriage,
  },
  {
    key: Category.Funeral,
    label: "Funeral",
    icon: <Flower2 className="w-6 h-6" />,
    desc: "Dignified and peaceful tributes to honor those we love.",
    image: CATEGORY_IMAGES.Funeral,
  },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: backendItems, isLoading } =
    useGetItemsByCategory(activeCategory);
  const items =
    backendItems && backendItems.length > 0
      ? backendItems
      : FALLBACK_ITEMS.filter(
          (i) => activeCategory === null || i.category === activeCategory,
        );

  const selectedItems = (
    backendItems && backendItems.length > 0 ? backendItems : FALLBACK_ITEMS
  ).filter((item) => selectedIds.has(String(item.id)));

  function toggleItem(item: DecorationItem) {
    const id = String(item.id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast(`Removed "${item.name}" from selection`);
      } else {
        next.add(id);
        toast.success(`Added "${item.name}" to selection!`);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Toaster position="top-right" />

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-rose/20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-xl font-bold text-navy tracking-wide">
              SRI VIJAYA DECORATIONS
            </span>
            <span className="text-xs text-rose font-sans tracking-widest uppercase">
              Flowers &amp; Balloons
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              type="button"
              onClick={() => scrollTo("categories")}
              className="text-sm font-medium text-foreground/70 hover:text-navy transition-colors"
              data-ocid="nav.categories.link"
            >
              Categories
            </button>
            <button
              type="button"
              onClick={() => scrollTo("packages")}
              className="text-sm font-medium text-foreground/70 hover:text-navy transition-colors"
              data-ocid="nav.packages.link"
            >
              Packages
            </button>
            <button
              type="button"
              onClick={() => scrollTo("customize")}
              className="text-sm font-medium text-foreground/70 hover:text-navy transition-colors"
              data-ocid="nav.customize.link"
            >
              Customize
            </button>
          </nav>

          <Button
            onClick={() => scrollTo("packages")}
            className="bg-navy text-primary-foreground hover:bg-navy/90 flex items-center gap-2 text-sm"
            data-ocid="header.view_selection.button"
          >
            <ShoppingBag className="w-4 h-4" />
            {selectedIds.size > 0 ? (
              <span>Selection ({selectedIds.size})</span>
            ) : (
              <span>View Selection</span>
            )}
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative w-full h-[85vh] min-h-[520px] flex items-center justify-center overflow-hidden"
        data-ocid="hero.section"
      >
        <img
          src="/assets/generated/hero-floral-balloon.dim_1600x900.jpg"
          alt="Floral and balloon decoration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
        <motion.div
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-rose/90 uppercase tracking-widest text-sm font-sans mb-4">
            Flowers &amp; Balloons for Every Occasion
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-6">
            Decor That Tells
            <br />
            <span className="italic text-rose/80">Your Story</span>
          </h1>
          <p className="text-white/80 text-lg mb-10 font-sans font-light max-w-xl mx-auto">
            From joyful birthdays to dreamy weddings and heartfelt farewells —
            we craft beautiful moments with flowers and balloons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-rose text-white hover:bg-rose/90 shadow-rose font-semibold px-8"
              onClick={() => scrollTo("packages")}
              data-ocid="hero.explore.button"
            >
              Explore Decorations
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-8"
              onClick={() => scrollTo("customize")}
              data-ocid="hero.customize.button"
            >
              Request Custom Order
            </Button>
          </div>
          <div className="mt-12 flex justify-center animate-bounce">
            <ChevronDown className="w-6 h-6 text-white/60" />
          </div>
        </motion.div>
      </section>

      {/* EVENT CATEGORIES */}
      <section id="categories" className="py-20 bg-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-rose uppercase tracking-widest text-xs font-sans mb-3">
              Browse By Occasion
            </p>
            <h2 className="font-serif text-4xl font-bold text-navy">
              Event Categories
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card
                  className={`overflow-hidden cursor-pointer border-2 transition-all duration-300 shadow-card hover:shadow-rose ${
                    activeCategory === cat.key
                      ? "border-rose ring-2 ring-rose/30"
                      : "border-transparent hover:border-rose/40"
                  }`}
                  onClick={() => {
                    setActiveCategory((prev) =>
                      prev === cat.key ? null : cat.key,
                    );
                    setTimeout(() => scrollTo("packages"), 100);
                  }}
                  data-ocid={`categories.item.${i + 1}`}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    {activeCategory === cat.key && (
                      <div className="absolute inset-0 bg-rose/20 flex items-center justify-center">
                        <Check className="w-10 h-10 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2 text-rose">
                      {cat.icon}
                      <span className="font-serif text-xl font-semibold text-navy">
                        {cat.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {cat.desc}
                    </p>
                    <Button
                      variant={
                        activeCategory === cat.key ? "default" : "outline"
                      }
                      className={
                        activeCategory === cat.key
                          ? "bg-navy text-primary-foreground w-full"
                          : "border-navy/30 text-navy w-full hover:bg-navy hover:text-white"
                      }
                      size="sm"
                      data-ocid={`categories.filter.${i + 1}.button`}
                    >
                      {activeCategory === cat.key ? "Showing" : "Browse"}{" "}
                      {cat.label}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DECORATIONS GRID */}
      <section id="packages" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-rose uppercase tracking-widest text-xs font-sans mb-3">
              Pick Your Style
            </p>
            <h2 className="font-serif text-4xl font-bold text-navy">
              {activeCategory
                ? `${activeCategory} Decorations`
                : "Curated Decor Packages"}
            </h2>
            {activeCategory && (
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="mt-3 text-sm text-rose hover:underline flex items-center gap-1 mx-auto"
                data-ocid="packages.clear_filter.button"
              >
                <X className="w-3 h-3" /> Clear filter
              </button>
            )}
          </motion.div>

          {isLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="packages.loading_state"
            >
              {SKELETON_KEYS.map((k) => (
                <div key={k} className="space-y-3">
                  <Skeleton className="h-56 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16" data-ocid="packages.empty_state">
              <Flower2 className="w-12 h-12 text-rose mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground font-serif text-lg">
                No items found for this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, i) => {
                const id = String(item.id);
                const selected = selectedIds.has(id);
                const typName = getTypeName(item.typ);
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (i % 6) * 0.07 }}
                    data-ocid={`packages.item.${i + 1}`}
                  >
                    <Card
                      className={`overflow-hidden border transition-all duration-300 shadow-card hover:shadow-rose ${
                        selected
                          ? "border-rose ring-2 ring-rose/30"
                          : "border-border hover:border-rose/30"
                      }`}
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={getItemImage(item)}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        {selected && (
                          <div className="absolute top-3 right-3 bg-rose text-white rounded-full p-1">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge
                            className={
                              typName === "Flower"
                                ? "bg-rose/90 text-white border-0"
                                : "bg-navy/90 text-white border-0"
                            }
                          >
                            {typName === "Flower" ? (
                              <Flower2 className="w-3 h-3 mr-1" />
                            ) : (
                              <PartyPopper className="w-3 h-3 mr-1" />
                            )}
                            {typName}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <div className="mb-2">
                          <h3 className="font-serif text-lg font-semibold text-navy leading-tight">
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="text-xs border-navy/20 text-navy/60"
                          >
                            {String(item.category)}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => toggleItem(item)}
                            className={
                              selected
                                ? "bg-rose text-white hover:bg-rose/80"
                                : "bg-navy text-white hover:bg-navy/90"
                            }
                            data-ocid={`packages.select.${i + 1}.button`}
                          >
                            {selected ? (
                              <>
                                <X className="w-3 h-3 mr-1" /> Remove
                              </>
                            ) : (
                              <>
                                <Star className="w-3 h-3 mr-1" /> Select
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CUSTOMIZE SECTION */}
      <section id="customize" className="py-20 bg-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-rose">
                <img
                  src="/assets/generated/marriage-flower-decor.dim_800x600.jpg"
                  alt="Custom floral arrangement"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 w-36 h-36 rounded-xl overflow-hidden border-4 border-white shadow-card hidden sm:block">
                <img
                  src="/assets/generated/birthday-flower-decor.dim_800x600.jpg"
                  alt="Flowers close-up"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p className="text-rose uppercase tracking-widest text-xs font-sans mb-3">
                Bespoke Creations
              </p>
              <h2 className="font-serif text-4xl font-bold text-navy mb-5">
                Need Something Custom?
              </h2>
              <p className="text-foreground/70 mb-8 leading-relaxed">
                Every occasion is unique. If you have a special vision for your
                flowers or balloon decor — a specific color palette, theme, or
                arrangement — we'd love to bring it to life. Reach out directly
                and our team will craft something unforgettable just for you.
              </p>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-rose/20 shadow-xs">
                <p className="text-xs uppercase tracking-widest text-rose font-sans mb-3">
                  Contact the Proprietor
                </p>
                <p className="font-serif text-3xl font-bold text-navy mb-6 tracking-wide">
                  +1 (555) 123-4567
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    className="bg-navy text-primary-foreground hover:bg-navy/90 flex-1"
                    data-ocid="customize.call.button"
                  >
                    <a
                      href="tel:+9866629203"
                      className="flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="bg-[#25D366] text-white hover:bg-[#22c55e] flex-1"
                    data-ocid="customize.whatsapp.button"
                  >
                    <a
                      href="https://wa.me/9866629203"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy text-primary-foreground pt-14 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="mb-4">
                <span className="font-serif text-xl font-bold tracking-wide">
                  SRI VIJAYA DECORATIONS
                </span>
                <p className="text-xs tracking-widest text-rose mt-1 uppercase">
                  Flowers &amp; Balloons
                </p>
              </div>
              <p className="text-primary-foreground/60 text-sm leading-relaxed">
                Beautiful decor for every life moment. Birthdays, weddings, and
                farewells — we make it memorable.
              </p>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4 text-rose">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo("categories")}
                    className="hover:text-rose transition-colors"
                    data-ocid="footer.categories.link"
                  >
                    Event Categories
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo("packages")}
                    className="hover:text-rose transition-colors"
                    data-ocid="footer.packages.link"
                  >
                    Decor Packages
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo("customize")}
                    className="hover:text-rose transition-colors"
                    data-ocid="footer.customize.link"
                  >
                    Custom Orders
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4 text-rose">
                Categories
              </h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li>Birthday Celebrations</li>
                <li>Wedding &amp; Marriage</li>
                <li>Funeral &amp; Memorial</li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4 text-rose">
                Contact
              </h4>
              <p className="text-sm text-primary-foreground/70 mb-2">
                +1 (555) 123-4567
              </p>
              <p className="text-sm text-primary-foreground/70 mb-4">
                Mon – Sat, 9am – 6pm
              </p>
              <Button
                asChild
                size="sm"
                className="bg-rose text-white hover:bg-rose/80"
                data-ocid="footer.contact.button"
              >
                <a href="tel:+9866629203" className="flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Call Us
                </a>
              </Button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-primary-foreground/40">
            <span>
              © {new Date().getFullYear()} SRI VIJAYA DECORATIONS. All rights
              reserved.
            </span>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rose transition-colors"
            >
              Built with ♥ using caffeine.ai
            </a>
          </div>
        </div>
      </footer>

      {/* SELECTION SUMMARY BAR */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md border-t border-rose/20 shadow-rose"
            data-ocid="selection.panel"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <ShoppingBag className="w-5 h-5 text-rose shrink-0" />
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold">
                    {selectedIds.size} item{selectedIds.size !== 1 ? "s" : ""}{" "}
                    selected
                  </p>
                  <p className="text-primary-foreground/60 text-xs truncate hidden sm:block">
                    {selectedItems.map((i) => i.name).join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={clearSelection}
                  data-ocid="selection.clear.button"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="bg-rose text-white hover:bg-rose/80"
                  onClick={() => scrollTo("customize")}
                  data-ocid="selection.request_quote.button"
                >
                  Request Quote
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
