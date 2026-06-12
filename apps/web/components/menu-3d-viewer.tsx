"use client";

import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Html, OrbitControls, Text } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { MenuCard } from "@repo/ui/marketing";

export interface MenuCategoryView {
  id: string;
  name: string;
  description: string | null;
  items: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl?: string | null;
  }[];
}

const COLORS = ["#c4694a", "#d4a574", "#c9a227"] as const;

function Plate3D({
  category,
  index,
  active,
  onSelect,
}: {
  category: MenuCategoryView;
  index: number;
  active: boolean;
  onSelect: () => void;
}) {
  const x = (index - 1) * 2.6;
  const color = COLORS[index % COLORS.length];

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.35}>
      <group position={[x, 0, active ? 0.5 : -0.3]} onClick={onSelect}>
        <mesh scale={active ? 1.12 : 0.92} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.95, 0.85, 0.08, 32]} />
          <meshStandardMaterial color={color} metalness={0.35} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.04, 32]} />
          <meshStandardMaterial color="#f5ede0" metalness={0.1} roughness={0.6} />
        </mesh>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.16}
          color="#3d2914"
          anchorX="center"
          maxWidth={1.6}
        >
          {category.name}
        </Text>
        <Html center position={[0, -0.15, 0.2]} distanceFactor={5}>
          <div className="rounded-full bg-warm-900/80 px-3 py-1 text-center text-[10px] font-medium text-gold-400 backdrop-blur-sm">
            {category.items.length} plats
          </div>
        </Html>
      </group>
    </Float>
  );
}

function MenuScene({
  categories,
  activeIndex,
  onSelect,
}: {
  categories: MenuCategoryView[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <>
      <color attach="background" args={["#f5ede0"]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#fff5e6" />
      <pointLight position={[-3, 2, 2]} intensity={0.4} color="#c4694a" />
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} minDistance={4} maxDistance={8} />
      {categories.map((category, index) => (
        <Plate3D
          key={category.id}
          category={category}
          index={index}
          active={index === activeIndex}
          onSelect={() => onSelect(index)}
        />
      ))}
    </>
  );
}

function CategoryTabs({
  categories,
  activeIndex,
  onSelect,
}: {
  categories: MenuCategoryView[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category, index) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(index)}
          className={`min-w-[130px] shrink-0 rounded-xl px-4 py-3 text-left transition-all ${
            index === activeIndex
              ? "bg-baruk-600 text-white shadow-[var(--shadow-warm-md)]"
              : "border border-baruk-200/60 bg-cream-50 text-baruk-800 hover:border-gold-500/40"
          }`}
        >
          <p className="font-display font-semibold">{category.name}</p>
          <p className="text-xs opacity-80">{category.items.length} plats</p>
        </button>
      ))}
    </div>
  );
}

export function Menu3DViewer({
  categories,
}: {
  categories: MenuCategoryView[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [use3d, setUse3d] = useState(true);

  const activeCategory = useMemo(
    () => categories[activeIndex] ?? categories[0],
    [categories, activeIndex],
  );

  if (!categories.length) {
    return (
      <p className="rounded-2xl border border-baruk-200/60 bg-cream-50 p-8 text-center text-baruk-700/70">
        Le menu sera bientôt disponible.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
            Carte
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-baruk-900 md:text-5xl">
            Notre menu
          </h1>
          <p className="mt-2 text-baruk-800/70">
            Explorez nos catégories en 3D ou parcourez la grille classique.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setUse3d((v) => !v)}
          className="rounded-xl border border-baruk-300/60 px-4 py-2 text-sm font-medium text-baruk-700 transition hover:border-gold-500/50 hover:text-baruk-900"
        >
          {use3d ? "Mode grille" : "Mode 3D"}
        </button>
      </div>

      {use3d ? (
        <div className="h-[440px] overflow-hidden rounded-3xl border border-baruk-200/50 shadow-[var(--shadow-warm-md)]">
          <Canvas camera={{ position: [0, 2, 6], fov: 42 }}>
            <Suspense fallback={null}>
              <MenuScene
                categories={categories}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
              />
            </Suspense>
          </Canvas>
        </div>
      ) : (
        <CategoryTabs
          categories={categories}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory?.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold text-baruk-900">
              {activeCategory?.name}
            </h2>
            {activeCategory?.description && (
              <p className="mt-1 text-baruk-800/65">{activeCategory.description}</p>
            )}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeCategory?.items.map((item) => (
              <MenuCard
                key={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                imageUrl={item.imageUrl}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
