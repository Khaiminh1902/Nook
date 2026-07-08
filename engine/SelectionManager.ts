import { useGameStore } from "@/store/gameStore";

export default class SelectionManager {
  select(x: number, y: number) {
    useGameStore.getState().setSelectedTile({ x, y });
  }

  toggle(x: number, y: number) {
    const selectedTile = this.getSelected();

    if (selectedTile?.x === x && selectedTile.y === y) {
      this.clear();
      return;
    }

    this.select(x, y);
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
