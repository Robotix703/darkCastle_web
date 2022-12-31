//Définition d'un type de donnée
export interface Color {
  //ID
  id: string;
  //Nom de la couleur
  name: string;
  //Gamme de peinture
  gamme: string;
  //Type de peinture
  type: string;
  //Code couleur
  colorCode: string;
  //Nom du tiroir
  drawerName: string;
  //Position X dans le tiroir
  positionX: number;
  //Position Y dans le tiroir
  positionY: number;
  //A acheter
  toBuy: Boolean;
}

export class colorHTMLDisplay {
  private html;
  constructor(colorName: string, colorCode: string) {
      this.html = `<h1>` + colorName + `</h1>`;
  }

  getHTML() {
    return this.html;
  }
}

export const colorGammes = [
  'Citadel', 'Army Painter', 'Air Printer'
]

export const colorTypes = [
  'Air', 'Dry', 'Base', 'Layer', 'Contrast', 'Shader', 'Texture', 'Dry', 'Technical', 'Glaze', 'Spray'
]