import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export const exportPDF = (fineName: string) => {
    const qrContainer = document.getElementById("qr-container");
    html2canvas(qrContainer as HTMLElement)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a5");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(fineName);
      })
      .catch((err) => {
        console.log(err);
      });
  };

