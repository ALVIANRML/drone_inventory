import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Button,
  Form,
  Input,
  Upload,
  DatePicker,
  InputNumber,
  Checkbox,
  Row,
  Col,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { BaseURL } from "../URL/BaseUrl";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function ModalFormSpesifikasi({
  data,
  quantity,
  hargaSatuan,
  baik,
  perbaikan,
  setSpesifikasi,
  setTanggal,
  setQuantity,
  setHargaSatuan,
  setTotalHarga,
  setBaik,
  setPerbaikan,
  setAfkir,
  setGambarSatu,
  setGambarDua,
  setGambarTiga,
  setGambarEmpat,
  setGambarLima,
}) {
  const [form] = Form.useForm();
  const variant = Form.useWatch("variant", form);
  const [disableAfkir, setDisableAfkir] = useState(false);

  useEffect(() => {
    const qty = quantity || 0;
    const harga = hargaSatuan || 0;
    const total = qty * harga;

    setTotalHarga(total);
    form.setFieldsValue({ totalHarga: total });
  }, [quantity, hargaSatuan, setTotalHarga, form]);

  useEffect(() => {
    if (data) {
      const initialValues = {
        spesifikasi: data.SPESIFIKASI || "",
        tanggal: data.TANGGAL ? dayjs(data.TANGGAL) : null,
        quantity: data.QUANTITY || null,
        harga_satuan: data.HARGA_SATUAN || null,
        totalHarga: (data.QUANTITY || 0) * (data.HARGA_SATUAN || 0),
        baik: data.BAIK || 0,
        perbaikan: data.PERBAIKAN || 0,
        afkir: data.AFKIR || false,
      };

      form.setFieldsValue(initialValues);

      setSpesifikasi(data.SPESIFIKASI || "");
      setTanggal(data.TANGGAL || "");
      setQuantity(data.QUANTITY || 0);
      setHargaSatuan(data.HARGA_SATUAN || 0);
      setTotalHarga((data.QUANTITY || 0) * (data.HARGA_SATUAN || 0));
      setBaik(data.BAIK || 0);
      setPerbaikan(data.PERBAIKAN || 0);
      setAfkir(data.AFKIR || false);
    }
  }, [data, form, setSpesifikasi, setTanggal, setQuantity, setHargaSatuan, setTotalHarga, setBaik, setPerbaikan, setAfkir]);

  useEffect(() => {
    const baikValue = baik || 0;
    const perbaikanValue = perbaikan || 0;

    if (baikValue > 0 || perbaikanValue > 0) {
      setAfkir(false);
      setDisableAfkir(true);
      form.setFieldsValue({ afkir: false });
    } else {
      setDisableAfkir(false);
    }
  }, [baik, perbaikan, setAfkir, form]);

  return (
    <div className="responsive-modal-form p-2 sm:p-4">
      <Form
        {...formItemLayout}
        form={form}
        layout="vertical"
        variant={variant || "outlined"}
        style={{ width: "100%" }}
      >
        {/* Basic Information Section */}
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            Informasi Dasar
          </h3>
          
          <Form.Item
            label="Spesifikasi Drone"
            name="spesifikasi"
            rules={[{ required: true, message: "Mohon masukkan spesifikasi drone!" }]}
            className="mb-4"
          >
            <Input
              rows={3}
              placeholder="Masukkan spesifikasi detail drone..."
              onChange={(e) => setSpesifikasi(e.target.value)}
              style={{ width: "100%" }}
              className="resize-none"
            />
          </Form.Item>

          <Form.Item
            label="Tanggal Pengesahan"
            name="tanggal"
            rules={[{ required: true, message: "Mohon pilih tanggal pengesahan!" }]}
            className="mb-4"
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Pilih tanggal pengesahan"
              format="DD/MM/YYYY"
              onChange={(date, dateString) => setTanggal(dateString)}
              size="large"
            />
          </Form.Item>
        </div>

        {/* Financial Information Section */}
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            Informasi Keuangan
          </h3>
          
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: "Mohon masukkan quantity!" }]}
                className="mb-4"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Masukkan quantity"
                  size="large"
                  onChange={(value) => setQuantity(value || 0)}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Harga Satuan"
                name="harga_satuan"
                rules={[{ required: true, message: "Mohon masukkan harga satuan!" }]}
                className="mb-4"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Masukkan harga satuan"
                  size="large"
                  formatter={(value) =>
                    value ? `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
                  }
                  parser={(value) => value?.replace(/Rp\s?|(\.*)/g, "")}
                  onChange={(value) => setHargaSatuan(value || 0)}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={24} md={8}>
              <Form.Item 
                label="Total Harga" 
                name="totalHarga"
                className="mb-4"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  disabled
                  size="large"
                  formatter={(value) =>
                    value ? `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "Rp 0"
                  }
                  parser={(value) => value?.replace(/Rp\s?|(\.*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Condition Information Section */}
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            Kondisi Peralatan
          </h3>
          
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Kondisi Baik"
                name="baik"
                rules={[{ required: true, message: "Mohon masukkan jumlah kondisi baik!" }]}
                className="mb-4"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Jumlah kondisi baik"
                  size="large"
                  onChange={(value) => setBaik(value || 0)}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Perlu Perbaikan"
                name="perbaikan"
                rules={[{ required: true, message: "Mohon masukkan jumlah yang perlu perbaikan!" }]}
                className="mb-4"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Jumlah perlu perbaikan"
                  size="large"
                  onChange={(value) => setPerbaikan(value || 0)}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={24} md={8}>
              <Form.Item 
                label="Status Afkir" 
                name="afkir" 
                valuePropName="checked"
                className="mb-4"
              >
                <div className="flex items-center h-10">
                  <Checkbox
                    disabled={disableAfkir}
                    onChange={(e) => setAfkir(e.target.checked)}
                    className="text-sm sm:text-base"
                  >
                    Tandai sebagai Afkir
                  </Checkbox>
                </div>
                {disableAfkir && (
                  <div className="text-xs text-gray-500 mt-1">
                    Tidak bisa diafkir karena ada kondisi baik/perbaikan
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Image Upload Section */}
        <div className="mb-4">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
            Upload Gambar Dokumentasi
          </h3>
          
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4, 5].map((num) => {
              const setterMap = {
                1: setGambarSatu,
                2: setGambarDua, 
                3: setGambarTiga,
                4: setGambarEmpat,
                5: setGambarLima
              };

              const gambarKey = `GAMBAR${num}`;
              
              return (
                <Col xs={24} sm={12} lg={8} key={num}>
                  <Form.Item
                    name={`gambar${num}`}
                    label={`Upload Gambar ${num}`}
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    className="mb-4"
                    initialValue={
                      data?.[gambarKey] && data !== null
                        ? [
                            {
                              uid: `-${num}`,
                              name: `gambar${num}.png`,
                              status: "done",
                              url: `${BaseURL}/attachments/drone/bukti_realisasi/${data[gambarKey]}`,
                            },
                          ]
                        : []
                    }
                  >
                    <Upload
                      name={`gambar${num}`}
                      listType="picture-card"
                      accept="image/*"
                      maxCount={1}
                      beforeUpload={() => false}
                      onChange={({ fileList }) => setterMap[num](fileList)}
                      className="w-full"
                      style={{ width: "100%" }}
                    >
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        <UploadOutlined className="text-lg sm:text-xl mb-2 text-gray-400" />
                        <div className="text-xs sm:text-sm text-gray-500">
                          Upload Gambar
                        </div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">
              <strong>Tips Upload Gambar:</strong>
              <ul className="mt-2 ml-4 list-disc text-xs sm:text-sm">
                <li>Format yang didukung: JPG, PNG, GIF</li>
                <li>Ukuran maksimal: 5MB per gambar</li>
                <li>Resolusi yang disarankan: minimal 800x600px</li>
                <li>Pastikan gambar jelas dan tidak blur</li>
              </ul>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}