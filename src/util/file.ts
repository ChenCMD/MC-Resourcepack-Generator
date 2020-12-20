import * as fs from 'fs';
import { TextEncoder } from 'util';
import { FileSystemError, Uri, workspace } from 'vscode';
const fsp = fs.promises;

function flatPath(pathOrUri: string | Uri) {
    return pathOrUri instanceof Uri ? pathOrUri : Uri.file(pathOrUri);
}

const encoder = new TextEncoder();
function encode(str: string | string[], joinStr?: string): Uint8Array {
    if (Array.isArray(str)) str = str.join(joinStr);
    return encoder.encode(str);
}

export async function copyFile(fromPath: string | Uri, toPath: string | Uri): Promise<void> {
    if (await pathAccessible(toPath))
        throw FileSystemError.FileExists(toPath);
    else
        await workspace.fs.copy(flatPath(fromPath), flatPath(toPath));
}

export async function createFile(filePath: string | Uri, content: string | string[]): Promise<void> {
    if (await pathAccessible(filePath))
        throw FileSystemError.FileExists(filePath);
    else
        await workspace.fs.writeFile(flatPath(filePath), encode(content));
}

export async function createDir(dirPath: string | Uri): Promise<void> {
    await workspace.fs.createDirectory(flatPath(dirPath),);
}

/**
 * @license
 * MIT License
 *
 * Copyright (c) 2019-2020 SPGoding
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
export async function pathAccessible(testPath: string | Uri): Promise<boolean> {
    return await fsp.access(flatPath(testPath).fsPath)
        .then(() => true)
        .catch(() => false);
}

/**
 * @license
 * MIT License
 *
 * Copyright (c) 2019-2020 SPGoding
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
export async function readFile(path: string | Uri): Promise<string> {
    return await new Promise((resolve, reject) => {
        let data = '';
        fs.createReadStream(flatPath(path).fsPath, { encoding: 'utf-8', highWaterMark: 128 * 1024 })
            .on('data', chunk => data += chunk)
            .on('end', () => resolve(data))
            .on('error', reject);
    });
}

export async function writeFile(path: string | Uri, content: string): Promise<void> {
    return await workspace.fs.writeFile(flatPath(path), encode(content));
}