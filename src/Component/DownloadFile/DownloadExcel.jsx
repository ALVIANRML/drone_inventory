import * as XLSX from "xlsx";
import Swal from "sweetalert2";

const calculateAge = (dateString) => {
  if (!dateString) return "-";
  const today = new Date();
  const date = new Date(dateString);
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  return `${age} tahun`;
};

export const handlePrintExcel = (
  detailData,
  filteredSpesifikasiData,
  setIsPrintModalOpen,
  setSelectedPrintFormat
) => {
  try {
    const excelData = filteredSpesifikasiData.map((item, index) => ({
      No: index + 1,
      "Serial Number": item.SERIAL_NUMBER || "-",
      "Spesifikasi Drone": item.SPESIFIKASI || "-",
      "Tanggal Pengesahan": item.TANGGAL
        ? new Date(item.TANGGAL).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "-",
      Umur: calculateAge(item.TANGGAL), // ✅ kolom umur baru
      Quantity: item.QUANTITY || 0,
      "Harga Satuan": item.HARGA_SATUAN
        ? "Rp " + Number(item.HARGA_SATUAN).toLocaleString("id-ID")
        : "-",
      "Total Harga": item.TOTAL_HARGA
        ? "Rp " + Number(item.TOTAL_HARGA).toLocaleString("id-ID")
        : "-",
      Baik: item.BAIK || 0,
      Perbaikan: item.PERBAIKAN || 0,
      Afkir: item.AFKIR === true ? "Tidak Layak" : "Layak",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData, { origin: "A5" });

    const headerData = [
      [`Data Spesifikasi Drone: ${detailData?.nama || "Unknown"}`],
      [`Tanggal Export: ${new Date().toLocaleDateString("id-ID")}`],
      [`Total Data: ${excelData.length} item`],
      [],
    ];

    XLSX.utils.sheet_add_aoa(ws, headerData, { origin: "A1" });

    const range = XLSX.utils.decode_range(ws["!ref"]);
    range.e.r = range.s.r + headerData.length + excelData.length;
    ws["!ref"] = XLSX.utils.encode_range(range);

    ws["!cols"] = [
      { wch: 5 },  // No
      { wch: 30 }, // Serial Number
      { wch: 25 }, // Spesifikasi Drone
      { wch: 20 }, // Tanggal Pengesahan
      { wch: 10 }, // Umur
      { wch: 10 }, // Qty
      { wch: 15 }, // Harga Satuan
      { wch: 15 }, // Total Harga
      { wch: 8 },  // Baik
      { wch: 10 }, // Perbaikan
      { wch: 12 }, // Afkir
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Data Spesifikasi");

    const fileName = `Data_Spesifikasi_${detailData?.nama?.replace(
      /\s+/g,
      "_"
    )}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);

    setIsPrintModalOpen(false);
    setSelectedPrintFormat("");

    Swal.fire({
      icon: "success",
      title: "Export Excel Berhasil!",
      text: `File ${fileName} telah diunduh`,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error export Excel:", error);
    Swal.fire({
      icon: "error",
      title: "Export Excel Gagal",
      text: "Terjadi kesalahan saat export ke Excel",
    });
  }
};
