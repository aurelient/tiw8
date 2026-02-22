export interface OneDollarOptions {
  score?: number; // Seuil de similarité (en %)
  parts?: number; // Nombre de points de resampling
  step?: number; // Degré de rotation par pas (en degrés)
  angle?: number; // Angle limite de rotation (en degrés)
  size?: number; // Taille de la bounding box (côté en pixels)
}

export type Point = [number, number];

export type GestureDefinition = [number, number][];

export type Gesture = {
  name: string;
  score: number;
  recognized: boolean;
  path: {
    start: Point;
    end: Point;
    centroid: Point;
  };
  ranking: { name: string; score: number }[];
  candidate: Point[];
};

export default class OneDollar {
  // Stockage des options, templates, callbacks et candidats
  private _options: OneDollarOptions;
  private _templates: { [name: string]: Point[] } = {};
  private _binds: { [name: string]: (gesture: Gesture) => void } = {};
  private _hasBinds = false;
  private _candidates: { [id: number]: Point[] } = {};

  // Variables de configuration internes
  private ANGLE: number;
  private HALF: number;
  private SIZE: number;
  private STEP: number;
  private readonly PHI = 0.5 * (-1.0 + Math.sqrt(5.0));

  constructor(options?: OneDollarOptions) {
    this._options = options || {};

    if (!("score" in this._options)) {
      this._options.score = 80;
    }
    if (!("parts" in this._options)) {
      this._options.parts = 64;
    }
    if (!("angle" in this._options)) {
      this._options.angle = 45;
    }
    this.ANGLE = this.degToRad(this._options.angle!);

    if (!("step" in this._options)) {
      this._options.step = 2;
    }
    this.STEP = this.degToRad(this._options.step!);

    if (!("size" in this._options)) {
      this._options.size = 250.0;
    }
    this.SIZE = this._options.size!;
    this.HALF = 0.5 * Math.sqrt(this.SIZE * this.SIZE + this.SIZE * this.SIZE);
  }

  // Conversion des degrés en radians
  private degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180.0;
  }

  // Ajoute un template de geste à partir d'une liste de points
  public add(name: string, points: Point[]): this {
    if (points.length > 0) {
      this._templates[name] = this.transform(points);
    }
    return this;
  }

  // Supprime un template
  public remove(name: string): this {
    if (this._templates[name] !== undefined) {
      delete this._templates[name];
    }
    return this;
  }

  // Associe un callback à un template (ou à tous si "*" est passé)
  public on(name: string, fn: (gesture: Gesture) => void): this {
    let names: string[] = [];
    if (name === "*") {
      names = Object.keys(this._templates);
    } else {
      names = name.split(" ");
    }
    for (const n of names) {
      if (this._templates[n] !== undefined) {
        this._binds[n] = fn;
        this._hasBinds = true;
      } else {
        throw new Error(`The template '${n}' isn't defined.`);
      }
    }
    return this;
  }

  // Désassocie un callback d'un template
  public off(name: string): this {
    if (this._binds[name] !== undefined) {
      delete this._binds[name];
      this._hasBinds = false;
      for (const key in this._binds) {
        if (Object.prototype.hasOwnProperty.call(this._templates, key)) {
          this._hasBinds = true;
          break;
        }
      }
    }
    return this;
  }

  // Renvoie l'état interne de l'instance
  public toObject(): {
    options: OneDollarOptions;
    templates: { [name: string]: Point[] };
    binds: { [name: string]: (gesture: Gesture) => void };
  } {
    return {
      options: this._options,
      templates: this._templates,
      binds: this._binds,
    };
  }

  // Commence la capture d'un geste (identifié par son id)
  public start(id: number, point?: Point): this {
    // Si id est omis, on utilise -1
    if (typeof id === "object" && point === undefined) {
      point = id as Point;
      id = -1;
    }
    this._candidates[id] = [];
    this.update(id, point!);
    return this;
  }

  // Ajoute un point au geste en cours
  public update(id: number, point?: Point): this {
    if (typeof id === "object" && point === undefined) {
      point = id as Point;
      id = -1;
    }
    if (!this._candidates[id]) {
      this._candidates[id] = [];
    }
    this._candidates[id].push(point!);
    return this;
  }

  // Termine la capture d'un geste et lance la reconnaissance
  public end(id: number, point?: Point): Gesture | false {
    if (typeof id === "object" && point === undefined) {
      point = id as Point;
      id = -1;
    }
    this.update(id, point!);
    const result = this.check(this._candidates[id]);
    delete this._candidates[id];
    return result;
  }

  // Vérifie si le candidat correspond à un geste connu
  public check(candidate: Point[]): Gesture | false {
    if (candidate.length < 3) {
      return false;
    }
    const numPoints = candidate.length;
    const path = {
      start: [candidate[0][0], candidate[0][1]] as Point,
      end: [candidate[numPoints - 1][0], candidate[numPoints - 1][1]] as Point,
      centroid:
        numPoints > 1
          ? this.centroid(candidate)
          : ([candidate[0][0], candidate[0][1]] as Point),
    };

    candidate = this.transform(candidate);
    const ranking: { name: string; score: number }[] = [];

    for (const name in this._templates) {
      const template = this._templates[name];
      if (!this._hasBinds || this._binds[name] !== undefined) {
        const dist = this.findBestMatch(candidate, template);
        let score = parseFloat(((1.0 - dist / this.HALF) * 100).toFixed(2));
        if (isNaN(score)) {
          score = 0.0;
        }
        ranking.push({ name, score });
      }
    }

    if (ranking.length > 0) {
      if (ranking.length > 1) {
        ranking.sort((a, b) => b.score - a.score);
      }
      const result: Gesture = {
        name: ranking[0].name,
        score: ranking[0].score,
        recognized: false,
        path: path,
        ranking: ranking,
        candidate: candidate,
      };

      if (ranking[0].score >= this._options.score!) {
        result.recognized = true;
        if (this._hasBinds && this._binds[ranking[0].name]) {
          this._binds[ranking[0].name](result);
        }
      }
      return result;
    }

    return {
      name: "",
      score: 0,
      recognized: false,
      path: path,
      ranking: [],
      candidate: candidate,
    };
  }

  // --------------------------------------------------
  // Méthodes privées utilitaires pour la transformation des points
  // --------------------------------------------------

  // Applique la transformation complète : resampling, rotation, scaling, translation
  private transform(points: Point[]): Point[] {
    let newPoints = this.resample(points);
    newPoints = this.rotateToZero(newPoints);
    newPoints = this.scaleToSquare(newPoints);
    newPoints = this.translateToOrigin(newPoints);
    return newPoints;
  }

  // Recherche la meilleure correspondance entre le candidat et un template
  private findBestMatch(candidate: Point[], template: Point[]): number {
    let lt = -this.ANGLE;
    let rt = this.ANGLE;
    const c = this.centroid(candidate);
    let x1 = this.PHI * lt + (1.0 - this.PHI) * rt;
    let f1 = this.distanceAtAngle(candidate, template, x1, c);
    let x2 = (1.0 - this.PHI) * lt + this.PHI * rt;
    let f2 = this.distanceAtAngle(candidate, template, x2, c);

    while (Math.abs(rt - lt) > this.STEP) {
      if (f1 < f2) {
        rt = x2;
        x2 = x1;
        f2 = f1;
        x1 = this.PHI * lt + (1.0 - this.PHI) * rt;
        f1 = this.distanceAtAngle(candidate, template, x1, c);
      } else {
        lt = x1;
        x1 = x2;
        f1 = f2;
        x2 = (1.0 - this.PHI) * lt + this.PHI * rt;
        f2 = this.distanceAtAngle(candidate, template, x2, c);
      }
    }
    return Math.min(f1, f2);
  }

  // Rééchantillonne le tracé en un nombre fixe de points
  private resample(points: Point[]): Point[] {
    const numPoints = this._options.parts!;
    const I = this.pathLength(points) / (numPoints - 1);
    let D = 0.0;
    const newPoints: Point[] = [points[0]];
    let idx = 1;

    while (idx < points.length) {
      const prev = points[idx - 1];
      const point = points[idx];
      const d = this.distance(prev, point);
      if (D + d >= I) {
        const t = (I - D) / d;
        const newX = prev[0] + t * (point[0] - prev[0]);
        const newY = prev[1] + t * (point[1] - prev[1]);
        const newPoint: Point = [newX, newY];
        newPoints.push(newPoint);
        // Insertion du point dans le tracé original
        points.splice(idx, 0, newPoint);
        D = 0.0;
      } else {
        D += d;
      }
      idx++;
    }
    // S'il manque des points, on répète le dernier point
    while (newPoints.length < numPoints) {
      newPoints.push(points[points.length - 1]);
    }
    return newPoints;
  }

  // Ramène le tracé à une rotation "zéro" (pour l'invariance de rotation)
  private rotateToZero(points: Point[]): Point[] {
    const c = this.centroid(points);
    const theta = Math.atan2(c[1] - points[0][1], c[0] - points[0][0]);
    return this.rotate(points, -theta, c);
  }

  // Met à l'échelle le tracé pour qu'il tienne dans un carré de taille SIZE
  private scaleToSquare(points: Point[]): Point[] {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const point of points) {
      minX = Math.min(point[0], minX);
      maxX = Math.max(point[0], maxX);
      minY = Math.min(point[1], minY);
      maxY = Math.max(point[1], maxY);
    }
    const deltaX = maxX - minX;
    const deltaY = maxY - minY;
    // Pour éviter la division par zéro, on considère une valeur minimale (ici 1)
    const safeDeltaX = deltaX === 0 ? 1 : deltaX;
    const safeDeltaY = deltaY === 0 ? 1 : deltaY;
    const scaleX = this.SIZE / safeDeltaX;
    const scaleY = this.SIZE / safeDeltaY;
    // Utilisation du facteur minimum pour conserver le ratio
    const factor = Math.min(scaleX, scaleY);
    return this.scale(points, [factor, factor]);
  }

  // Translater le tracé pour le centrer sur l'origine (0,0)
  private translateToOrigin(points: Point[]): Point[] {
    const c = this.centroid(points);
    const offset: Point = [-c[0], -c[1]];
    return this.translate(points, offset);
  }

  // Calcule la distance moyenne entre deux tracés (après rotation)
  private distanceAtAngle(
    points1: Point[],
    points2: Point[],
    radians: number,
    c: Point
  ): number {
    const newPoints = this.rotate(points1, radians, c);
    return this.delta(newPoints, points2);
  }

  // Calcule la distance moyenne point-à-point entre deux listes de points
  private delta(points1: Point[], points2: Point[]): number {
    let sum = 0.0;
    for (let i = 0; i < points1.length; i++) {
      sum += this.distance(points1[i], points2[i]);
    }
    return sum / points1.length;
  }

  // Calcule la longueur totale du tracé
  private pathLength(points: Point[]): number {
    let length = 0.0;
    let prev: Point | null = null;
    for (const point of points) {
      if (prev !== null) {
        length += this.distance(prev, point);
      }
      prev = point;
    }
    return length;
  }

  // Calcule la distance euclidienne entre deux points
  private distance(p1: Point, p2: Point): number {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Calcule le centroïde (moyenne) d'une liste de points
  private centroid(points: Point[]): Point {
    let x = 0,
      y = 0;
    for (const point of points) {
      x += point[0];
      y += point[1];
    }
    return [x / points.length, y / points.length];
  }

  // Effectue une rotation de tous les points autour d'un pivot
  private rotate(points: Point[], radians: number, pivot: Point): Point[] {
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      const dx = x - pivot[0];
      const dy = y - pivot[1];
      points[i] = [
        dx * cos - dy * sin + pivot[0],
        dx * sin + dy * cos + pivot[1],
      ];
    }
    return points;
  }

  // Met à l'échelle chaque point selon un facteur donné (pour x et y)
  private scale(points: Point[], offset: Point): Point[] {
    for (let i = 0; i < points.length; i++) {
      points[i] = [points[i][0] * offset[0], points[i][1] * offset[1]];
    }
    return points;
  }

  // Translater chaque point d'un offset
  private translate(points: Point[], offset: Point): Point[] {
    for (let i = 0; i < points.length; i++) {
      points[i] = [points[i][0] + offset[0], points[i][1] + offset[1]];
    }
    return points;
  }
}
