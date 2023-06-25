export function generateUniqueString() {
    const timestamp = Date.now().toString();
    const randomStr = Math.random().toString(36).substr(2, 4); // Modified to generate 4 characters
    return `${timestamp}-${randomStr}`;
}

export function generateRandomUniqueString(len: number): string {
    let uniqueStr = '';
  
    while (uniqueStr.length !== len) { // Loop until we have a 6-characters long string
        uniqueStr = generateUniqueString().substr(0, len+1); // Take only the first 7 characters to eliminate possible '-' character(s)
    }
    
    return uniqueStr;
}

export function generateRandomString(len: number): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const characters = `${letters}${numbers}`;
    let result = '';
    result += letters.charAt(Math.floor(Math.random() * letters.length)); // Start with a lowercase letter
    for (let i = 1; i < len; i++) { // Generate 9 more characters
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export function generateRandomNumberWithSigma(sigma: number): number {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    const x = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return x * sigma;
}

export async function delayUtil(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}