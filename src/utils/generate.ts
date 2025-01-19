import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportPDF = (fileName: string) => {
  const qrContainer = document.getElementById("qr-container");
  if (!qrContainer) {
    console.error("QR container element not found!");
    return;
  }

  html2canvas(qrContainer)
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a5"); // PDF dimensions in mm
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate the image height based on the PDF width
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let yOffset = 0; // Tracks the vertical position on the page

      // Loop through the image height and add pages as needed
      while (yOffset < imgHeight) {
        pdf.addImage(
          imgData,
          "PNG",
          0,
          -yOffset, // Adjust the vertical position of the image
          imgWidth,
          imgHeight
        );

        // If there is more content to render, add a new page
        yOffset += pdfHeight;
        if (yOffset < imgHeight) {
          pdf.addPage();
        }
      }

      pdf.save(fileName);
    })
    .catch((err) => {
      console.error("Error generating PDF:", err);
    });
};
