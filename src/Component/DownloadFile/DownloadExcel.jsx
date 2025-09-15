import * as XLSX from "xlsx";
import Swal from "sweetalert2";

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

    XLSX.utils.sheet_add_aoa(ws, headerData, { origin: "A1" });

    const range = XLSX.utils.decode_range(ws["!ref"]);
    range.e.r = range.s.r + headerData.length + excelData.length;
    ws["!ref"] = XLSX.utils.encode_range(range);

    ws["!cols"] = [
      { wch: 5 },
      { wch: 30 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 8 },
      { wch: 10 },
      { wch: 12 },
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
