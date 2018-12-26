import crypto from 'crypto';
import Radix10ToRadix64 from 'radix10toradix64';

/**
 * Generates a six-digit long string which is a radix 64 representation of a, cryptographically safe,
 * randomly generated decimal number.
 *
 * @returns {Promise<string>}
 */
const genBatchCode = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const arr = new Uint32Array(16);
    const convert = new Radix10ToRadix64();

    crypto.randomFill(arr, (err, buf) => {
      if (err) {
        reject(err.message);
        return;
      }
      const cryptoNum = buf.reduce((sum, num) => sum + num, 0);
      const cryptoRnd = convert.toRadix64(cryptoNum);
      resolve(cryptoRnd);
    });
  });
};

export default genBatchCode;
