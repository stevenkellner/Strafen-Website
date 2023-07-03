import { BytesToBitIterator } from './bytes-to-bit-iterator';
import { PseudoRandom } from './pseudo-random';

export class RandomBitIterator implements Iterator<0 | 1, undefined> {
    private readonly pseudoRandom: PseudoRandom;

    private bitIterator: Iterator<0 | 1>;

    public constructor(seed: Uint8Array) {
        this.pseudoRandom = new PseudoRandom(seed);
        this.bitIterator = new BytesToBitIterator(Uint8Array.from([this.pseudoRandom.randomByte()]));
    }

    public next(): IteratorResult<0 | 1, undefined> {
        let bitResult = this.bitIterator.next();
        while (bitResult.done ?? false) {
            this.bitIterator = new BytesToBitIterator(Uint8Array.from([this.pseudoRandom.randomByte()]));
            bitResult = this.bitIterator.next();
        }
        return { value: bitResult.value };
    }
}
