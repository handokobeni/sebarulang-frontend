import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface FilterTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function FilterTabs({ selectedCategory, onCategoryChange }: FilterTabsProps) {
  const categories = [
    "Semua",
    "Makanan Berat",
    "Makanan Ringan",
    "Buah & Sayur",
    "Roti & Kue",
    "Minuman",
  ];

  return (
    <div className="border-b bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-3">
        <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
          <TabsList className="w-full justify-start h-auto flex-wrap">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-full px-4 py-2"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

