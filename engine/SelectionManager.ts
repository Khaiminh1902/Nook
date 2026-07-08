import { useGameStore } from "@/store/gameStore";

export default class SelectionManager {
  select(x: number, y: number) {
    useGameStore.getState().setSelectedTile({ x, y });
  }

  clear() {
    useGameStore.getState().setSelectedTile(null);
  }

  getSelected() {
    return useGameStore.getState().selectedTile;
  }

  hasSelection() {
    return this.getSelected() !== null;
  }
}
