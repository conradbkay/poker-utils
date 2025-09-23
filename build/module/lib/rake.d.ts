type Cutoff = [number, number[]];
declare const cap: (cutoffs: Cutoff[]) => (BB: number, dealt: number) => number;
export declare const rake: Record<string, {
    atEnd: boolean;
    percent: (bb: number) => number;
    cap: ReturnType<typeof cap>;
}>;
export {};
