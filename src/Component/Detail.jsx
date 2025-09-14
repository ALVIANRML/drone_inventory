import { Carousel, Modal, Input, Table, Space, Select } from "antd";
const { Column } = Table;
const { Search } = Input;
const { Option } = Select;
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { BaseURL } from "../URL/BaseUrl";
import "../assets/css/Carousel.css";
import logoptpn4 from "../assets/Img/logoptpn4.png";
import BreadCrumpComponent from "./BreadCrumpComponent";
import Swal from "sweetalert2";
import {
  CheckCircleTwoTone,
  EditOutlined,
  CloseCircleTwoTone,
  DeleteOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import ModalFormSpesifikasi from "./ModalFormSpesifikasi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Detail() {
  const { detailData, setRoute } = useContext(AppContext);
  const [spesifikasiData, setSpesifikasiData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentImages, setCurrentImages] = useState([]);
  const [editData, setEditData] = useState(null);
  const [spesifikasi, setSpesifikasi] = useState("");
  const [tanggal, setTanggal] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [hargaSatuan, setHargaSatuan] = useState(null);
  const [totalHarga, setTotalHarga] = useState(
    spesifikasiData?.[0]?.TOTAL_HARGA || null
  );
  const [baik, setBaik] = useState(null);
  const [perbaikan, setPerbaikan] = useState(null);
  const [afkir, setAfkir] = useState(0);
  const [gambarSatu, setGambarSatu] = useState("");
  const [gambarDua, setGambarDua] = useState("");
  const [gambarTiga, setGambarTiga] = useState("");
  const [gambarEmpat, setGambarEmpat] = useState("");
  const [gambarLima, setGambarLima] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSpesifikasiOpen, setIsModalSpesifikasiOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPrintFormat, setSelectedPrintFormat] = useState("");
  const [updateEditData, setUpdateAddData] = useState(null);

  const token = localStorage.getItem("tokenUser");

  const filteredSpesifikasiData = Array.isArray(spesifikasiData)
    ? spesifikasiData.filter(
        (item) =>
          item.SPESIFIKASI &&
          item.SPESIFIKASI.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : [];

  const onSearch = (value) => {
    setSearchKeyword(value);
  };

  const handleEditDataById = (record) => {
    setUpdateAddData(1);
    resetModalState();
    setEditData(record);
    setIsModalSpesifikasiOpen(true);
  };

  const handleTambahDataSpesifikasi = (detailData) => {
    setUpdateAddData(0);
    resetModalState();
    setEditData(null);
    setIsModalSpesifikasiOpen(true);
  };

  const handleCancel = () => {
    resetModalState();
    setIsModalSpesifikasiOpen(false);
  };

  const handlePrintData = () => {
    setIsPrintModalOpen(true);
  };

  const handlePrintModalCancel = () => {
    setIsPrintModalOpen(false);
    setSelectedPrintFormat("");
  };

  const resetModalState = () => {
    setEditData(null);
    setSpesifikasi("");
    setTanggal(null);
    setQuantity(0);
    setHargaSatuan(0);
    setTotalHarga(0);
    setBaik(null);
    setPerbaikan(null);
    setAfkir(0);

    setGambarSatu([]);
    setGambarDua([]);
    setGambarTiga([]);
    setGambarEmpat([]);
    setGambarLima([]);
  };

  const handlePrintExcel = () => {
    try {
      const excelData = filteredSpesifikasiData.map((item, index) => ({
        No: index + 1,
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
      const ws = XLSX.utils.json_to_sheet(excelData);

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

  const handlePrintPDF = () => {
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

  const handleFormatSelection = () => {
    if (selectedPrintFormat === "excel") {
      handlePrintExcel();
    } else if (selectedPrintFormat === "pdf") {
      handlePrintPDF();
    }
  };

  const handleOk = async () => {
    try {
      const formData = new FormData();
      formData.append("id_merk", detailData.id);
      formData.append("spesifikasi", spesifikasi);
      formData.append("tanggal", tanggal);
      formData.append("quantity", Number(quantity) || 0);
      formData.append("harga_satuan", Number(hargaSatuan) || 0);
      formData.append("total_harga", Number(totalHarga) || 0);
      formData.append("baik", Number(baik) || 0);
      formData.append("perbaikan", Number(perbaikan) || 0);
      formData.append("afkir", afkir ? 1 : 0);

      if (gambarSatu && gambarSatu[0]) {
        if (gambarSatu[0].originFileObj) {
          formData.append("gambar1", gambarSatu[0].originFileObj);
        } else {
          formData.append("gambar1", data?.GAMBAR1);
        }
      }
      if (gambarDua && gambarDua[0]) {
        if (gambarDua[0].originFileObj) {
          formData.append("gambar2", gambarDua[0].originFileObj);
        } else {
          formData.append("gambar2", data?.GAMBAR2);
        }
      }

      if (gambarTiga && gambarTiga[0]) {
        if (gambarTiga[0].originFileObj) {
          formData.append("gambar3", gambarTiga[0].originFileObj);
        } else {
          formData.append("gambar3", data?.GAMBAR3);
        }
      }

      if (gambarEmpat && gambarEmpat[0]) {
        if (gambarEmpat[0].originFileObj) {
          formData.append("gambar4", gambarEmpat[0].originFileObj);
        } else {
          formData.append("gambar4", data?.GAMBAR4);
        }
      }

      if (gambarLima && gambarLima[0]) {
        if (gambarLima[0].originFileObj) {
          formData.append("gambar5", gambarLima[0].originFileObj);
        } else {
          formData.append("gambar5", data?.GAMBAR5);
        }
      }
      let response;
      if (updateEditData === 0) {
        response = await axios.post(`${BaseURL}/drone/spesifikasi`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.put(
          `${BaseURL}/drone/spesifikasi/${spesifikasiData?.[0]?.ID}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      Swal.fire({
        icon: "success",
        title:
          updateEditData === 0
            ? "Data Berhasil Ditambah"
            : "Data Berhasil Diedit",
        showConfirmButton: false,
        timer: 1500,
      });

      setSpesifikasiData(response.data);
      getSpesifikasiData();
      resetModalState();
      handleCancel();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: updateEditData === 0 ? "Gagal Tambah Data" : "Gagal Edit Data",
        text: "Silahkan coba lagi",
      });
    }
  };

  const getSpesifikasiData = async () => {
    try {
      const response = await axios.get(`${BaseURL}/drone/spesifikasi`, {
        params: {
          id: detailData?.id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSpesifikasiData(response.data);
    } catch (error) {
      console.error("Error Message:", error);
    }
  };

  useEffect(() => {
    getSpesifikasiData();
  }, []);

  const handleOpenModal = (record) => {
    const images = [
      record.GAMBAR1
        ? `${BaseURL}/attachments/drone/bukti_realisasi/${record.GAMBAR1}`
        : null,
      record.GAMBAR2
        ? `${BaseURL}/attachments/drone/bukti_realisasi/${record.GAMBAR2}`
        : null,
      record.GAMBAR3
        ? `${BaseURL}/attachments/drone/bukti_realisasi/${record.GAMBAR3}`
        : null,
      record.GAMBAR4
        ? `${BaseURL}/attachments/drone/bukti_realisasi/${record.GAMBAR4}`
        : null,
      record.GAMBAR5
        ? `${BaseURL}/attachments/drone/bukti_realisasi/${record.GAMBAR5}`
        : null,
    ].filter(Boolean);

    setCurrentImages(images);
    setIsModalOpen(true);
  };

  const handleDeleteDataById = async (record) => {
    try {
      const response = await axios.delete(
        `${BaseURL}/drone/spesifikasi/${record.ID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data berhasil dihapus!",
        timer: 1500,
        showConfirmButton: false,
      });

      setSpesifikasiData(response.data);
      getSpesifikasiData();
    } catch (error) {
      console.error("Error Message:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data!",
      });
    }
  };

  const handleDeleteAllData = async (detailData) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak bisa dipulihkan kembali!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${BaseURL}/drone/spesifikasi/alldelete/${detailData.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Swal.fire({
            icon: "success",
            title: "Data terhapus!",
            text: "Semua data berhasil dihapus.",
            timer: 2000,
            showConfirmButton: false,
          });

          setSpesifikasiData(response.data);
          getSpesifikasiData();
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Gagal hapus data",
            text: "Terjadi kesalahan saat menghapus.",
          });
        }
      }
    });
  };

  return (
    <>
      <BreadCrumpComponent
        number={2}
        data={detailData.nama}
        setRoute={setRoute}
      />
      <h1
        style={{
          fontWeight: "bold",
          fontSize: "8rem",
          marginBottom: "1vh",
          textAlign: "center",
        }}
      >
        {detailData?.nama}
      </h1>

      <div className="w-full flex justify-center mb-5">
        <Search
          placeholder="Cari Spesifikasi Drone"
          allowClear
          style={{ width: "50%" }}
          enterButton="Search"
          size="large"
          onSearch={onSearch}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <div className="w-full flex justify-between">
        <div className="flex gap-3">
          <button
            className="mb-5 px-4 py-2 bg-blue-500 text-white rounded-lg 
               hover:bg-blue-600 active:bg-blue-400 focus:outline-none"
            onClick={() => handleTambahDataSpesifikasi(detailData)}
          >
            Tambah Spesifikasi Drone
          </button>

          <button
            className="mb-5 px-4 py-2 bg-green-500 text-white rounded-lg 
               hover:bg-green-600 active:bg-green-400 focus:outline-none flex items-center gap-2"
            onClick={handlePrintData}
          >
            <PrinterOutlined />
            Print Data Spesifikasi
          </button>
        </div>

        <button
          onClick={() => handleDeleteAllData(detailData)}
          className="mb-5 px-4 py-2 bg-red-500 text-white rounded-lg 
             hover:bg-red-600 active:bg-red-400 focus:outline-none"
        >
          Delete All Data
        </button>
      </div>

      <Table
        dataSource={filteredSpesifikasiData}
        rowKey="ID"
        locale={{
          emptyText: searchKeyword
            ? `Tidak ada spesifikasi yang ditemukan dengan kata kunci "${searchKeyword}"`
            : "Tidak ada data",
        }}
      >
        <Column
          title="Gambar"
          dataIndex="GAMBAR1"
          key="GAMBAR1"
          render={(text, record) =>
            text ? (
              <img
                src={
                  text
                    ? `${BaseURL}/attachments/drone/bukti_realisasi/${text}`
                    : logoptpn4
                }
                alt="gambar"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
                onClick={() => handleOpenModal(record)}
              />
            ) : (
              <span>Tidak ada gambar</span>
            )
          }
        />
        <Column
          title="Spesifikasi Drone"
          dataIndex="SPESIFIKASI"
          key="SPESIFIKASI"
          render={(text) => {
            if (!searchKeyword || !text) return text;

            const regex = new RegExp(`(${searchKeyword})`, "gi");
            const parts = text.split(regex);

            return (
              <span>
                {parts.map((part, index) =>
                  regex.test(part) ? (
                    <mark
                      key={index}
                      style={{ backgroundColor: "yellow", padding: "0 2px" }}
                    >
                      {part}
                    </mark>
                  ) : (
                    part
                  )
                )}
              </span>
            );
          }}
        />
        <Column
          title="Tanggal Pengesahan"
          dataIndex="TANGGAL"
          key="TANGGAL"
          render={(text) => {
            if (!text) return "-";
            return new Date(text).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
          }}
        />

        <Column title="Quantity" dataIndex="QUANTITY" key="QUANTITY" />
        <Column
          title="Harga Satuan"
          dataIndex="HARGA_SATUAN"
          key="HARGA_SATUAN"
          render={(value) => {
            if (value == null) return "-";
            return "Rp " + Number(value).toLocaleString("en-US");
          }}
        />

        <Column
          title="Total Harga"
          dataIndex="TOTAL_HARGA"
          key="TOTAL_HARGA"
          render={(value) => {
            if (value == null) return "-";
            return "Rp " + Number(value).toLocaleString("en-US");
          }}
        />
        <Column title="Baik" dataIndex="BAIK" key="BAIK" />
        <Column title="Perbaikan" dataIndex="PERBAIKAN" key="PERBAIKAN" />
        <Column
          title="Afkir"
          dataIndex="AFKIR"
          key="AFKIR"
          render={(value) =>
            value === true ? (
              <span style={{ color: "red", fontWeight: "bold" }}>
                <CloseCircleTwoTone twoToneColor="#ff4d4f" /> Tidak Layak
              </span>
            ) : (
              <span style={{ color: "green", fontWeight: "bold" }}>
                <CheckCircleTwoTone twoToneColor="#52c41a" /> Layak
              </span>
            )
          }
        />
        <Column
          title="Aksi"
          key="AKSI"
          render={(_, record) => (
            <Space size="middle">
              <EditOutlined
                onClick={() => handleEditDataById(record)}
                style={{ color: "#FFD32C", fontSize: "20px" }}
              />
              <DeleteOutlined
                onClick={() => {
                  Swal.fire({
                    title: "Apakah Anda yakin?",
                    text: "Data yang sudah dihapus tidak dapat dikembalikan!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Ya, hapus!",
                    cancelButtonText: "Batal",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleDeleteDataById(record);
                    }
                  });
                }}
                style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
              />
            </Space>
          )}
        />
      </Table>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <PrinterOutlined style={{ color: "#1890ff" }} />
            Pilih Format Export
          </div>
        }
        open={isPrintModalOpen}
        onCancel={handlePrintModalCancel}
        footer={[
          <button
            key="cancel"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            onClick={handlePrintModalCancel}
          >
            Batal
          </button>,
          <button
            key="print"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleFormatSelection}
            disabled={!selectedPrintFormat}
          >
            Export
          </button>,
        ]}
        width={400}
        centered
      >
        <div className="py-4">
          <p className="mb-4 text-gray-600">
            Pilih format file yang ingin Anda export:
          </p>
          <Select
            placeholder="Pilih format export"
            style={{ width: "100%" }}
            size="large"
            value={selectedPrintFormat}
            onChange={setSelectedPrintFormat}
          >
            <Option value="excel">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <FileExcelOutlined style={{ color: "#52c41a" }} />
                Export ke Excel (.xlsx)
              </div>
            </Option>
            <Option value="pdf">
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <FilePdfOutlined style={{ color: "#ff4d4f" }} />
                Export ke PDF (.pdf)
              </div>
            </Option>
          </Select>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">
              <strong>Informasi Export:</strong>
            </p>
            <p className="text-sm text-blue-600">
              • Data yang akan diexport: {filteredSpesifikasiData.length} item
            </p>
            <p className="text-sm text-blue-600">
              • Drone: {detailData?.nama || "Unknown"}
            </p>
            {searchKeyword && (
              <p className="text-sm text-blue-600">
                • Filter pencarian: "{searchKeyword}"
              </p>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        centered
        className="custom-modal"
      >
        <Carousel arrows infinite dots={true} className="custom-carousel">
          {currentImages.map((src, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <img
                src={src}
                alt={`gambar-${idx}`}
                style={{
                  maxHeight: "20vh",
                  maxWidth: "100%",
                  objectFit: "contain",
                  margin: "0 auto",
                }}
              />
            </div>
          ))}
        </Carousel>
      </Modal>

      <Modal
        title={
          updateEditData === 0
            ? "Tambah Data Spesifikasi Drone"
            : "Edit Data Spesifikasi Drone"
        }
        open={isModalSpesifikasiOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <ModalFormSpesifikasi
          key={updateEditData === 0 ? "add" : editData?.ID}
          data={updateEditData === 0 ? null : editData}
          setSpesifikasi={setSpesifikasi}
          setTanggal={setTanggal}
          setQuantity={setQuantity}
          setHargaSatuan={setHargaSatuan}
          setTotalHarga={setTotalHarga}
          setBaik={setBaik}
          setPerbaikan={setPerbaikan}
          setAfkir={setAfkir}
          setGambarSatu={setGambarSatu}
          setGambarDua={setGambarDua}
          setGambarTiga={setGambarTiga}
          setGambarEmpat={setGambarEmpat}
          setGambarLima={setGambarLima}
          spesifikasi={spesifikasi}
          tanggal={tanggal}
          quantity={quantity}
          hargaSatuan={hargaSatuan}
          totalHarga={totalHarga}
          baik={baik}
          perbaikan={perbaikan}
          afkir={perbaikan}
          gambarSatu={gambarSatu}
          gambarDua={gambarDua}
          gambarTiga={gambarTiga}
          gambarEmpat={gambarEmpat}
          gambarLima={gambarLima}
        />
      </Modal>
    </>
  );
}