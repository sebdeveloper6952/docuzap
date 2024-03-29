import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const modifyPdf = async (existingPdfBytes: ArrayBuffer) => {
	// Load a PDFDocument from the existing PDF bytes
	const pdfDoc = await PDFDocument.load(existingPdfBytes);

	// Embed the Helvetica font
	const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

	// Get the first page of the document
	const pages = pdfDoc.getPages();
	const firstPage = pages[0];

	// Get the width and height of the first page
	const { width, height } = firstPage.getSize();

	// Draw a string of text diagonally across the first page
	firstPage.drawText('#SovEng', {
		x: width / 2 - 100,
		y: height / 2 + 300,
		size: 75,
		font: helveticaFont,
		color: rgb(0.95, 0.1, 0.1),
		rotate: degrees(-45)
	});

	// Serialize the PDFDocument to bytes (a Uint8Array)
	return pdfDoc.save();
};
