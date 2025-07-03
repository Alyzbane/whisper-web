/**
 * 
 * @param file - The file to compute the hash for.
 * @description Computes the SHA-256 hash of a file.
 * @returns A promise that resolves to the hexadecimal representation of the file's hash.
 */
export async function getFileHash(file: File): Promise<string> {
    const fileBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    return hashHex;
}