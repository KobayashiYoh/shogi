const fs = require('fs');
const path = require('path');

/**
 * 画像ファイルをBase64エンコードしてTypeScript定数ファイルを生成するスクリプト
 */

const ASSETS_DIR = path.join(__dirname, '..', 'Assets');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'constants', 'images.ts');

const pieceTypeMap = {
  'type=ohsyo.png': 'ou',
  'type=hisya.png': 'hisha',
  'type=kakugyo.png': 'kaku',
  'type=kinsyo.png': 'kin',
  'type=ginsyo.png': 'gin',
  'type=keima.png': 'keima',
  'type=kyosya.png': 'kyou',
  'type=hohei.png': 'fu',
  'type=ryuoh.png': 'ryuou',
  'type=ryuma.png': 'ryuuma',
  'type=narigin.png': 'narigin',
  'type=narikei.png': 'narikei',
  'type=narikyo.png': 'narikyo',
  'type=tokin.png': 'tokin',
};

function encodeImageToBase64(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  return `data:image/png;base64,${imageBuffer.toString('base64')}`;
}

function generateImageConstants() {
  let output = '/**\n * Base64エンコードされた将棋駒画像データ\n * このファイルは自動生成されます。直接編集しないでください。\n */\n\n';
  output += 'import type { PieceType } from \'shogi-core\';\n\n';

  const imageDataEntries = [];

  for (const [fileName, pieceType] of Object.entries(pieceTypeMap)) {
    const filePath = path.join(ASSETS_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${fileName} not found`);
      continue;
    }

    const base64Data = encodeImageToBase64(filePath);
    imageDataEntries.push(`  ${pieceType}: '${base64Data}'`);
  }

  output += 'export const PIECE_IMAGES: Record<PieceType, string> = {\n';
  output += imageDataEntries.join(',\n');
  output += '\n};\n';

  fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`   Encoded ${imageDataEntries.length} images`);
}

generateImageConstants();
