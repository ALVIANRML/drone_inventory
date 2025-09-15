import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

export const handlePrintPDF = (detailData, filteredSpesifikasiData,setIsPrintModalOpen,setSelectedPrintFormat ) => {
  try {
    const doc = new jsPDF("landscape", "mm", "a4");

    doc.setFontSize(18);
    doc.text(
      `Data Spesifikasi Drone: ${detailData?.nama || "Unknown"}`,
      14,
      22
    );

    doc.setFontSize(12);
    doc.text(
      `Tanggal Export: ${new Date().toLocaleDateString("id-ID")}`,
      14,
      30
    );
    doc.text(`Total Data: ${filteredSpesifikasiData.length} item`, 14, 38);

    const pdfTableData = filteredSpesifikasiData.map((item, index) => [
      index + 1,
      item.SERIAL_NUMBER || "-",
      item.SPESIFIKASI || "-",
      item.TANGGAL
        ? new Date(item.TANGGAL).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "-",
      item.QUANTITY || 0,
      item.HARGA_SATUAN
        ? "Rp " + Number(item.HARGA_SATUAN).toLocaleString("id-ID")
        : "-",
      item.TOTAL_HARGA
        ? "Rp " + Number(item.TOTAL_HARGA).toLocaleString("id-ID")
        : "-",
      item.BAIK || 0,
      item.PERBAIKAN || 0,
      item.AFKIR === true ? "Tidak Layak" : "Layak",
    ]);

    autoTable(doc, {
      head: [
        [
          "No",
          "Serial Number",
          "Spesifikasi Drone",
          "Tanggal",
          "Qty",
          "Harga Satuan",
          "Total Harga",
          "Baik",
          "Perbaikan",
          "Status",
        ],
      ],
      body: pdfTableData,
      startY: 45,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 9,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 50 },
        2: { cellWidth: 25 },
        3: { cellWidth: 15 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        6: { cellWidth: 15 },
        7: { cellWidth: 20 },
        8: { cellWidth: 25 },
      },
      margin: { left: 14, right: 14 },
    });

    const fileName = `Data_Spesifikasi_${detailData?.nama?.replace(
      /\s+/g,
      "_"
    )}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);

    setIsPrintModalOpen(false);
    setSelectedPrintFormat("");

    Swal.fire({
      icon: "success",
      title: "Export PDF Berhasil!",
      text: `File ${fileName} telah diunduh`,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error export PDF:", error);
    Swal.fire({
      icon: "error",
      title: "Export PDF Gagal",
      text: "Terjadi kesalahan saat export ke PDF",
    });
  }
};
