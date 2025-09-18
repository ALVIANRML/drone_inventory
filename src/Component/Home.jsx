import { Card, Row, Col, Input, Modal, Dropdown, Menu, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import logoptpn4 from "../assets/Img/logoptpn4.png";
import { RightOutlined } from "@ant-design/icons";
import { BaseURL } from "../URL/BaseUrl";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../Context/AppContext";
import Swal from "sweetalert2";
const { Search } = Input;
import BreadCrumpComponent from "../Component/BreadCrumpComponent";
import ModalTambahMerk from "./ModalTambahMerk";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateAddMerk, setUpdateAddMerk] = useState(null);
  const token = localStorage.getItem("tokenUser");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { setRoute, merkData, setDetailData, refreshMerkData } =
    useContext(AppContext);
  const [nama, setNama] = useState("");
  const [gambar, setGambar] = useState("");
  const [merkSpesifikasiData, setMerkSpesifikasiData] = useState([]);
  const [totalBagusPerbaikan, setTotalBagusPerbaikan] = useState([]);
  const [filteredMerkData, setFilteredMerkData] = useState([]);
  const [editMerk, setEditMerk] = useState(null);
  const [idMerk, setIdMerk] = useState(null);

  useEffect(() => {
    if (!merkData) return;
    const filtered = merkData.filter((item) =>
      item.NAMA.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredMerkData(filtered);
  }, [merkData, searchKeyword]);

  const onSearch = (value) => {
    setSearchKeyword(value);
  };

  const showModal = () => {
    setUpdateAddMerk(0);
    resetModalState();
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const formData = new FormData();
      formData.append("nama", nama);

      if (gambar && gambar.length > 0) {
        const hasNewFile = gambar.some((file) => file.originFileObj);

        if (hasNewFile) {
          const newFile = gambar.find((file) => file.originFileObj);
          formData.append("gambar", newFile.originFileObj);
        } else if (updateAddMerk === 1 && editMerk?.GAMBAR) {
          formData.append("keep_existing_image", "true");
        }
      } else if (updateAddMerk === 1 && editMerk?.GAMBAR) {
        formData.append("keep_existing_image", "true");
      }

      let response;
      if (updateAddMerk === 0) {
        response = await axios.post(`${BaseURL}/drone/merk`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.put(
          `${BaseURL}/drone/merk/${idMerk}`,
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
          updateAddMerk === 0
            ? "Data Berhasil Ditambah"
            : "Data Berhasil Diedit",
        showConfirmButton: false,
        timer: 1500,
      });

      await refreshMerkData();
      getTotalBagusPerbaikan();
      getMerkSpesifikasi();

      // Reset state sebelum menutup modal
      resetModalState();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: updateAddMerk === 0 ? "Gagal Tambah Data" : "Gagal Edit Data",
        text: "Silahkan coba lagi",
      });
    }
  };

  const resetModalState = () => {
    setEditMerk(null);
    setNama("");
    setGambar([]); // Pastikan array kosong, bukan string kosong
    setIdMerk(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    // Reset state setelah modal ditutup
    setTimeout(() => {
      resetModalState();
    }, 100); // Delay sedikit untuk memastikan modal benar-benar tertutup
  };

  const handleClick = (item) => {
    setDetailData({
      id: item.ID,
      nama: item.NAMA,
    });

    setRoute("detail");
  };

  const getMerkSpesifikasi = async () => {
    try {
      const response = await axios.get(`${BaseURL}/drone/visualisasi`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMerkSpesifikasiData(response.data);
    } catch (error) {
      console.error("Error Message:", error);
    }
  };

  const getTotalBagusPerbaikan = async () => {
    try {
      const response = await axios.get(
        `${BaseURL}/drone/visualisasi/jumlah-drone`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTotalBagusPerbaikan(response.data);
    } catch (error) {
      console.error("Error Message:", error);
    }
  };

  useEffect(() => {
    getMerkSpesifikasi();
  }, []);

  useEffect(() => {
    getTotalBagusPerbaikan();
  }, []);

  const handleDelete = async (item) => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (!result.isConfirmed) return;

      const response = await axios.delete(`${BaseURL}/drone/merk/${item}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data berhasil dihapus!",
        timer: 1500,
        showConfirmButton: false,
      });

      await refreshMerkData();
      getMerkSpesifikasi();
      getTotalBagusPerbaikan();
    } catch (error) {
      console.error("Error Message:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data!",
      });
    }
  };

  const handleEditData = (item) => {
    // Reset dulu sebelum set data edit
    resetModalState();

    setUpdateAddMerk(1);
    setEditMerk(item);
    setNama(item.NAMA);
    setIdMerk(item.ID);
    // Gambar akan di-set di ModalTambahMerk component
    setIsModalOpen(true);
  };

  return (
    <>
      <BreadCrumpComponent Number={1} />
      <div className="w-full flex justify-center mb-10">
        <Search
          placeholder="Cari Merk Drone"
          allowClear
          style={{ width: "50%", zIndex: 200 }}
          enterButton="Search"
          size="large"
          onSearch={onSearch}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <p className="text-3xl font-bold">
        Total Drone: {totalBagusPerbaikan?.[0]?.TOTAL_QUANTITY || 0}
      </p>

      <div className="flex space-x-5">
        <p>Bagus: {totalBagusPerbaikan?.[0]?.TOTAL_BAIK || 0}</p>
        <p>Perbaikan: {totalBagusPerbaikan?.[0]?.TOTAL_PERBAIKAN || 0}</p>
      </div>

      <Row gutter={[8, 8]} className="mt-10">
        {filteredMerkData.length > 0 ? (
          filteredMerkData.map((item) => {
            const spesifikasi = merkSpesifikasiData?.find(
              (s) => s.ID_MERK === item.ID
            );

            return (
              <Col xs={24} sm={12} md={12} lg={12} xl={6} xxl={6} key={item.ID}>
                <Card
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "40vh",
                    minHeight: "400px",
                    border: "2px solid #d9d9d9",
                    position: "relative",
                  }}
                  className="transition-transform duration-300 hover:scale-105 hover:shadow-xl "
                >
                  <div style={{ position: "absolute", top: 10, right: 10 }}>
                    <Button style={{ width: "1vw" }}>
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item
                              key="edit"
                              onClick={() => handleEditData(item)}
                            >
                              ✏️ Edit
                            </Menu.Item>
                            <Menu.Item
                              key="delete"
                              danger
                              onClick={() => handleDelete(item.ID)}
                            >
                              🗑️ Delete
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={["click"]}
                      >
                        <MoreOutlined
                          style={{ fontSize: "20px", cursor: "pointer" }}
                        />
                      </Dropdown>
                    </Button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "10px",
                      minHeight: "150px",
                    }}
                  >
                    <img
                      src={
                        item.GAMBAR
                          ? `${BaseURL}/attachments/drone/bukti_realisasi/${item.GAMBAR}`
                          : logoptpn4
                      }
                      alt={item.NAMA || "Drone"}
                      style={{
                        maxWidth: "200px",
                        maxHeight: "150px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <p className="font-bold text-3xl text-center mb-2">
                    {item.NAMA}
                  </p>
                  {/* <p className="font-bold text-1lg">
                    Jumlah Unit: {spesifikasi?.TOTAL_QUANTITY ?? 0}
                  </p> */}
                  <hr />
                  <p className="font-bold text-1lg text-green-600">
                    Kondisi Bagus: {spesifikasi?.TOTAL_BAIK ?? 0}
                  </p>
                  <p className="font-bold text-1lg text-yellow-500">
                    Kondisi Perbaikan: {spesifikasi?.TOTAL_PERBAIKAN ?? 0}
                  </p>
                  <p className="font-bold text-1lg text-red-600">
                    Kondisi Afkir: {spesifikasi?.TOTAL_AFKIR ?? 0}
                  </p>
                  <p className="font-bold text-1lg text-blue-600">
                    Total Drone: {spesifikasi?.TOTAL_QUANTITY ?? 0}
                  </p>
                  <button
                    className="absolute bottom-3 right-3 
               bg-blue-500 text-white p-2 rounded-full shadow-md 
               transition transform 
               hover:bg-blue-600 hover:scale-110 
               active:bg-blue-700 active:scale-95 w-20"
                    onClick={() => handleClick(item)}
                  >
                    <RightOutlined />
                  </button>
                </Card>
              </Col>
            );
          })
        ) : searchKeyword ? (
          <div className="w-full text-center py-10">
            <p className="text-xl text-gray-500">
              Tidak ada merk drone yang ditemukan dengan kata kunci "
              {searchKeyword}"
            </p>
          </div>
        ) : null}
      </Row>

      <button
        className="fixed bottom-5 w-18 right-5 bg-green-600 text-white text-2xl p-5 rounded-full shadow-lg 
        hover:bg-green-700 hover:scale-110 active:scale-95 transition transform"
        onClick={showModal}
      >
        +
      </button>
      <Modal
        title={updateAddMerk === 0 ? "Tambah Merk Drone" : "Edit Merk Drone"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true} // Penting: destroy modal content ketika ditutup
      >
        <ModalTambahMerk
          key={`${updateAddMerk}-${isModalOpen}-${idMerk || "new"}`} // Key unik setiap kali modal dibuka
          setNama={setNama}
          setGambar={setGambar}
          updateAddMerk={updateAddMerk}
          editMerk={editMerk}
          setEditMerk={setEditMerk}
          setIdMerk={setIdMerk}
        />
      </Modal>
    </>
  );
}
