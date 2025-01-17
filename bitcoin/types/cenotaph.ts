import { Artifact } from './artifacts';
import { Flaw } from './flaw';
import { Rune } from './rune';
import { RuneId } from './rune_id';

export class Cenotaph extends Artifact {
  public etching: Rune | null;
  public _flaws: bigint;

  constructor({ etching, flaws, mint }: { etching: Rune | null; flaws: bigint; mint: RuneId | null }) {
    super();
    this.etching = etching;
    this._flaws = flaws;
    this.setMint(mint);
  }

  public flaws(): Flaw[] {
    return Flaw.ALL.map(d => d)
      .filter(f => {
        let op = new Flaw(f).flag() & this._flaws;
        return op !== BigInt(0);
      })
      .map(d => new Flaw(d));
  }
}
