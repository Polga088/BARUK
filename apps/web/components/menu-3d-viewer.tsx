"use client";

import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Html, OrbitControls, Text } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

export interface MenuCategoryView {
  id: string;
  name: string;
  description: string | null;
  items: {
    id: string;
    name: string;
    description: string | null;
    price: number;
  }[];
}

function MenuCard3D({
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
  const x = (index - 1) * 2.4;
  const color = ["#d67f1f", "#b86318", "#944a17"][index % 3];

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group position={[x, 0, active ? 0.6 : -0.4]} onClick={onSelect}>
        <mesh scale={active ? 1.15 : 0.95}>
          <boxGeometry args={[1.8, 2.4, 0.12]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.35} />
        </mesh>
        <Text
          position={[0, 0.9, 0.08]}
          fontSize={0.18}
          color="#fff"
          anchorX="center"
          maxWidth={1.5}
        >
          {category.name}
        </Text>
        <Html center position={[0, -0.2, 0.08]} transform distanceFactor={4}>
          <div className="w-40 rounded-lg bg-black/70 p-2 text-center text-[10px] text-white">
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
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} />
      {categories.map((category, index) => (
        <MenuCard3D
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

function MenuFallback2D({
  categories,
  activeIndex,
  onSelect,
}: {
  categories: MenuCategoryView[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {categories.map((category, index) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(index)}
          className={`min-w-[140px] rounded-xl px-4 py-3 text-left transition ${
            index === activeIndex
              ? "bg-baruk-600 text-white"
              : "bg-white text-baruk-800 ring-1 ring-baruk-200"
          }`}
        >
          <p className="font-semibold">{category.name}</p>
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
      <p className="rounded-xl bg-white p-6 text-zinc-600">
        Le menu sera bientôt disponible.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-baruk-900">Notre menu</h1>
          <p className="text-zinc-600">
            Naviguez entre les catégories en 3D ou en mode classique.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setUse3d((v) => !v)}
          className="rounded-lg border border-baruk-300 px-3 py-2 text-sm text-baruk-700"
        >
          {use3d ? "Mode 2D" : "Mode 3D"}
        </button>
      </div>

      {use3d ? (
        <div className="h-[420px] overflow-hidden rounded-2xl bg-gradient-to-b from-baruk-100 to-baruk-200">
          <Canvas camera={{ position: [0, 1.2, 5], fov: 45 }}>
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
        <MenuFallback2D
          categories={categories}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory?.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-baruk-100"
        >
          <h2 className="text-2xl font-semibold text-baruk-800">
            {activeCategory?.name}
          </h2>
          {activeCategory?.description && (
            <p className="mt-1 text-zinc-600">{activeCategory.description}</p>
          )}
          <ul className="mt-6 divide-y divide-baruk-100">
            {activeCategory?.items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-4 py-4"
              >
                <div>
                  <p className="font-medium text-zinc-900">{item.name}</p>
                  {item.description && (
                    <p className="text-sm text-zinc-500">{item.description}</p>
                  )}
                </div>
                <p className="whitespace-nowrap font-semibold text-baruk-700">
                  {item.price.toFixed(0)} MAD
                </p>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
