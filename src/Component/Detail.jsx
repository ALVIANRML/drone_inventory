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
import { handlePrintExcel } from "./DownloadFile/DownloadExcel";
import { handlePrintPDF } from "./DownloadFile/DownloadPDF";
import ModalFormSpesifikasi from "./ModalFormSpesifikasi";

export default function Detail() {
  const { detailData, setRoute } = useContext(AppContext);
  const [spesifikasiData, setSpesifikasiData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentImages, setCurrentImages] = useState([]);
  const [editData, setEditData] = useState(null);
  const [tanggal, setTanggal] = useState(null);
  const [spesifikasi, setSpesifikasi] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
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
    setSerialNumber("");
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

  const handleFormatSelection = () => {
    if (selectedPrintFormat === "excel") {
      handlePrintExcel(
        detailData,
        filteredSpesifikasiData,
        setIsPrintModalOpen,
        setSelectedPrintFormat
      );
    } else if (selectedPrintFormat === "pdf") {
      handlePrintPDF(
        detailData,
        filteredSpesifikasiData,
        setIsPrintModalOpen,
        setSelectedPrintFormat
      );
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

      const formObj = {};
      formData.forEach((value, key) => {
        formObj[key] = value;
      });
      console.log(formObj);

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
    <div className="px-2 sm:px-4 lg:px-6">
      <BreadCrumpComponent
        number={2}
        data={detailData.nama}
        setRoute={setRoute}
      />
      
      {/* Responsive Title */}
      <h1
        className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 lg:mb-8 text-center"
        style={{
          fontSize: "clamp(2rem, 8vw, 8rem)",
        }}
      >
        {detailData?.nama}
      </h1>

      {/* Responsive Search */}
      <div className="w-full flex justify-center mb-4 sm:mb-6 px-2">
        <Search
          placeholder="Cari Spesifikasi Drone"
          allowClear
          className="w-full sm:w-3/4 lg:w-1/2"
          enterButton="Search"
          size="large"
          onSearch={onSearch}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      {/* Responsive Button Layout */}
      <div className="w-full mb-4 sm:mb-6">
        {/* Mobile Layout - Stack buttons vertically */}
        <div className="flex flex-col sm:hidden gap-3">
          <button
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg 
               hover:bg-blue-600 active:bg-blue-400 focus:outline-none text-sm"
            onClick={() => handleTambahDataSpesifikasi(detailData)}
          >
            Tambah Spesifikasi Drone
          </button>

          <button
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg 
               hover:bg-green-600 active:bg-green-400 focus:outline-none flex items-center justify-center gap-2 text-sm"
            onClick={handlePrintData}
          >
            <PrinterOutlined />
            Print Data Spesifikasi
          </button>

          <button
            onClick={() => handleDeleteAllData(detailData)}
            className="w-full px-4 py-3 bg-red-500 text-white rounded-lg 
               hover:bg-red-600 active:bg-red-400 focus:outline-none text-sm"
          >
            Delete All Data
          </button>
        </div>

        {/* Desktop Layout - Horizontal layout */}
        <div className="hidden sm:flex sm:justify-between sm:flex-wrap sm:gap-3">
          <div className="flex flex-wrap gap-3">
            <button
              className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg 
                 hover:bg-blue-600 active:bg-blue-400 focus:outline-none text-sm sm:text-base"
              onClick={() => handleTambahDataSpesifikasi(detailData)}
            >
              Tambah Spesifikasi Drone
            </button>

            <button
              className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded-lg 
                 hover:bg-green-600 active:bg-green-400 focus:outline-none flex items-center gap-2 text-sm sm:text-base"
              onClick={handlePrintData}
            >
              <PrinterOutlined />
              <span className="hidden sm:inline">Print Data Spesifikasi</span>
              <span className="sm:hidden">Print</span>
            </button>
          </div>

          <button
            onClick={() => handleDeleteAllData(detailData)}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white rounded-lg 
               hover:bg-red-600 active:bg-red-400 focus:outline-none text-sm sm:text-base"
          >
            Delete All Data
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <div className="min-w-full inline-block align-middle">
          <Table
            dataSource={filteredSpesifikasiData}
            rowKey="ID"
            scroll={{ x: 1200 }}
            size="small"
            className="responsive-table"
            locale={{
              emptyText: searchKeyword
                ? `Tidak ada spesifikasi yang ditemukan dengan kata kunci "${searchKeyword}"`
                : "Tidak ada data",
            }}
          >
            <Column
              title="Serial Number"
              dataIndex="SERIAL_NUMBER"
              key="SERIAL_NUMBER"
              width={120}
              className="text-xs sm:text-sm"
            />
            <Column
              title="Gambar"
              dataIndex="GAMBAR1"
              key="GAMBAR1"
              width={100}
              render={(text, record) =>
                text ? (
                  <img
                    src={
                      text
                        ? `${BaseURL}/attachments/drone/bukti_realisasi/${text}`
                        : logoptpn4
                    }
                    alt="gambar"
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-lg cursor-pointer"
                    onClick={() => handleOpenModal(record)}
                  />
                ) : (
                  <span className="text-xs sm:text-sm">Tidak ada gambar</span>
                )
              }
            />
            <Column
              title="Spesifikasi Drone"
              dataIndex="SPESIFIKASI"
              key="SPESIFIKASI"
              width={200}
              className="text-xs sm:text-sm"
              render={(text) => {
                if (!searchKeyword || !text) return (
                  <div className="max-w-48 truncate" title={text}>
                    {text}
                  </div>
                );

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
              width={140}
              className="text-xs sm:text-sm"
              render={(text) => {
                if (!text) return "-";
                return new Date(text).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
              }}
            />

            <Column 
              title="Qty" 
              dataIndex="QUANTITY" 
              key="QUANTITY" 
              width={80}
              className="text-xs sm:text-sm"
            />
            <Column
              title="Harga Satuan"
              dataIndex="HARGA_SATUAN"
              key="HARGA_SATUAN"
              width={120}
              className="text-xs sm:text-sm"
              render={(value) => {
                if (value == null) return "-";
                return (
                  <div className="truncate" title={`Rp ${Number(value).toLocaleString("en-US")}`}>
                    Rp {Number(value).toLocaleString("en-US")}
                  </div>
                );
              }}
            />

            <Column
              title="Total Harga"
              dataIndex="TOTAL_HARGA"
              key="TOTAL_HARGA"
              width={120}
              className="text-xs sm:text-sm"
              render={(value) => {
                if (value == null) return "-";
                return (
                  <div className="truncate" title={`Rp ${Number(value).toLocaleString("en-US")}`}>
                    Rp {Number(value).toLocaleString("en-US")}
                  </div>
                );
              }}
            />
            <Column 
              title="Baik" 
              dataIndex="BAIK" 
              key="BAIK" 
              width={60}
              className="text-xs sm:text-sm"
            />
            <Column 
              title="Perbaikan" 
              dataIndex="PERBAIKAN" 
              key="PERBAIKAN" 
              width={80}
              className="text-xs sm:text-sm"
            />
            <Column
              title="Status"
              dataIndex="AFKIR"
              key="AFKIR"
              width={100}
              className="text-xs sm:text-sm"
              render={(value) =>
                value === true ? (
                  <span className="text-red-600 font-bold flex items-center gap-1">
                    <CloseCircleTwoTone twoToneColor="#ff4d4f" className="text-sm" />
                    <span className="hidden sm:inline">Tidak Layak</span>
                    <span className="sm:hidden">Tidak</span>
                  </span>
                ) : (
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <CheckCircleTwoTone twoToneColor="#52c41a" className="text-sm" />
                    <span className="hidden sm:inline">Layak</span>
                    <span className="sm:hidden">Ya</span>
                  </span>
                )
              }
            />
            <Column
              title="Aksi"
              key="AKSI"
              width={100}
              fixed="right"
              render={(_, record) => (
                <Space size="small">
                  <EditOutlined
                    onClick={() => handleEditDataById(record)}
                    className="text-yellow-500 text-base sm:text-lg cursor-pointer hover:text-yellow-600"
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
                    className="text-red-500 text-base sm:text-lg cursor-pointer hover:text-red-600"
                  />
                </Space>
              )}
            />
          </Table>
        </div>
      </div>

      {/* Print Modal - Responsive */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <PrinterOutlined className="text-blue-500" />
            Pilih Format Export
          </div>
        }
        open={isPrintModalOpen}
        onCancel={handlePrintModalCancel}
        footer={[
          <button
            key="cancel"
            className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm sm:text-base"
            onClick={handlePrintModalCancel}
          >
            Batal
          </button>,
          <button
            key="print"
            className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ml-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            onClick={handleFormatSelection}
            disabled={!selectedPrintFormat}
          >
            Export
          </button>,
        ]}
        width="90%"
        style={{ maxWidth: "400px" }}
        centered
      >
        <div className="py-4">
          <p className="mb-4 text-gray-600 text-sm sm:text-base">
            Pilih format file yang ingin Anda export:
          </p>
          <Select
            placeholder="Pilih format export"
            className="w-full"
            size="large"
            value={selectedPrintFormat}
            onChange={setSelectedPrintFormat}
          >
            <Option value="excel">
              <div className="flex items-center gap-2">
                <FileExcelOutlined className="text-green-500" />
                <span className="text-sm sm:text-base">Export ke Excel (.xlsx)</span>
              </div>
            </Option>
            <Option value="pdf">
              <div className="flex items-center gap-2">
                <FilePdfOutlined className="text-red-500" />
                <span className="text-sm sm:text-base">Export ke PDF (.pdf)</span>
              </div>
            </Option>
          </Select>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-1 font-semibold">
              Informasi Export:
            </p>
            <p className="text-xs sm:text-sm text-blue-600">
              • Data yang akan diexport: {filteredSpesifikasiData.length} item
            </p>
            <p className="text-xs sm:text-sm text-blue-600 truncate">
              • Drone: {detailData?.nama || "Unknown"}
            </p>
            {searchKeyword && (
              <p className="text-xs sm:text-sm text-blue-600 truncate">
                • Filter pencarian: "{searchKeyword}"
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* Image Carousel Modal - Responsive */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: "800px" }}
        centered
        className="custom-modal"
      >
        <Carousel arrows infinite dots={true} className="custom-carousel">
          {currentImages.map((src, idx) => (
            <div key={idx} className="text-center">
              <img
                src={src}
                alt={`gambar-${idx}`}
                className="max-h-60 sm:max-h-80 lg:max-h-96 max-w-full object-contain mx-auto"
              />
            </div>
          ))}
        </Carousel>
      </Modal>

      {/* Specification Modal - Responsive */}
      <Modal
        title={
          updateEditData === 0
            ? "Tambah Data Spesifikasi Drone"
            : `Edit Data Spesifikasi Drone ${editData?.SERIAL_NUMBER || ""}`
        }
        open={isModalSpesifikasiOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
        width="90%"
        style={{ maxWidth: "800px" }}
        className="responsive-modal"
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
          serialNumber={serialNumber}
          setSerialNumber={setSerialNumber}
        />
      </Modal>
    </div>
  );
}