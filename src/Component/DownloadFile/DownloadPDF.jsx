import { BaseURL } from "../../URL/BaseUrl";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// === Ambil gambar asli tanpa resize kecil ===
const getBase64ImageFromUrl = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result); // langsung return base64 tanpa compress
    };
    reader.readAsDataURL(blob);
  });
};

// === Hitung umur (dalam tahun, bisa disesuaikan) ===
const calculateAge = (dateString) => {
  if (!dateString) return "-";
  const today = new Date();
  const date = new Date(dateString);
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--; // kalau belum lewat bulan & tanggal
  }
  return `${age} tahun`;
};

export const handlePrintPDF = async (
  detailData,
  filteredSpesifikasiData,
  setIsPrintModalOpen,
  setSelectedPrintFormat
) => {
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

    // === convert gambar ke base64 ===
    const pdfTableData = await Promise.all(
      filteredSpesifikasiData.map(async (item, index) => {
        let imgBase64 = null;
        if (item.GAMBAR1) {
          const url = `${BaseURL}/attachments/drone/bukti_realisasi/${item.GAMBAR1}`;
          imgBase64 = await getBase64ImageFromUrl(url);
        }

        const tanggal = item.TANGGAL
          ? new Date(item.TANGGAL).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "-";

        return {
          row: [
            index + 1,
            item.SERIAL_NUMBER || "-",
            "__IMAGE__", // placeholder
            item.SPESIFIKASI || "-",
            tanggal,
            calculateAge(item.TANGGAL), // ✅ umur ditambahkan di sini
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
          ],
          imgBase64,
        };
      })
    );

    autoTable(doc, {
      head: [
        [
          "No",
          "Serial Number",
          "Gambar",
          "Spesifikasi Drone",
          "Tanggal",
          "Umur", // ✅ header umur baru
          "Qty",
          "Harga Satuan",
          "Total Harga",
          "Baik",
          "Perbaikan",
          "Status",
        ],
      ],
      body: pdfTableData.map((item) => item.row),
      startY: 50,
      styles: {
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 35 },
        2: { cellWidth: 50, minCellHeight: 40, halign: "center" }, // kolom gambar lebih besar
        5: { cellWidth: 20 }, // kolom umur
      },
      didDrawCell: (data) => {
        if (data.column.index === 2 && data.cell.section === "body") {
          const rowIndex = data.row.index;
          const img = pdfTableData[rowIndex]?.imgBase64;
          if (img) {
            const cell = data.cell;

            // Ukuran gambar (proporsional)
            const imgWidth = 40;
            const imgHeight = 30;
            const x = cell.x + (cell.width - imgWidth) / 2;
            const y = cell.y + (cell.height - imgHeight) / 2;

            doc.addImage(img, "JPEG", x, y, imgWidth, imgHeight);
          }
        }
      },
    });

    const fileName = `Data_Spesifikasi_${detailData?.nama?.replace(
      /\s+/g,
      "_"
    )}_${new Date().toISOString().slice(0, 10)}.pdf`;

    doc.save(fileName);

    setIsPrintModalOpen(false);
    setSelectedPrintFormat("");
  } catch (error) {
    console.error("Error export PDF:", error);
  }
};
