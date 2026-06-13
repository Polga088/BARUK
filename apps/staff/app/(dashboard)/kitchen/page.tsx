import { KitchenBoard } from "../../../components/kitchen-board";

export default function KitchenPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-cream-100">Écran cuisine</h1>
        <p className="text-baruk-300">
          Commandes en cours · mise à jour automatique entre postes.
        </p>
      </div>
      <KitchenBoard />
    </div>
  );
}
