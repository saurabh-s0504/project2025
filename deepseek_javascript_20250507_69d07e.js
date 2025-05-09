const pdf = require('pdf-lib');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const convertPdfToJpg = async (pdfBuffer, options) => {
  const { quality, format, pages } = options;
  const pdfDoc = await pdf.PDFDocument.load(pdfBuffer);
  
  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  
  const outputFiles = [];
  const pageIndices = parsePageRange(pages, pdfDoc.getPageCount());
  
  for (const pageIndex of pageIndices) {
    const page = pdfDoc.getPage(pageIndex);
    const { width, height } = page.getSize();
    
    const image = await page.renderToImage();
    const imageBuffer = await image.asBuffer();
    
    const outputPath = path.join(tempDir, `page_${pageIndex + 1}.${format}`);
    
    await sharp(imageBuffer)
      .jpeg({ quality })
      .toFile(outputPath);
    
    outputFiles.push(outputPath);
  }
  
  // Create zip if multiple pages
  if (outputFiles.length > 1) {
    const zipPath = await createZip(outputFiles);
    return { outputFile: zipPath, pagesConverted: outputFiles.length };
  }
  
  return { outputFile: outputFiles[0], pagesConverted: 1 };
};