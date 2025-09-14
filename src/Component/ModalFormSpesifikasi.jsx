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
    sm: { span: 14 },
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
        totalHarga: (data.QUANTITY || null) * (data.HARGA_SATUAN || null),
        baik: data.BAIK || 0,
        perbaikan: data.PERBAIKAN || 0,
        afkir: data.AFKIR || false,
      };

      form.setFieldsValue(initialValues);

      setSpesifikasi(data.SPESIFIKASI || "");
      setTanggal(data.TANGGAL || "");
      setQuantity(data.QUANTITY || null);
      setHargaSatuan(data.HARGA_SATUAN || null);
      setTotalHarga((data.QUANTITY || null) * (data.HARGA_SATUAN || null));
      setBaik(data.BAIK || 0);
      setPerbaikan(data.PERBAIKAN || 0);
      setAfkir(data.AFKIR || false);
    }
  }, [data]);

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
    <Form
      {...formItemLayout}
      form={form}
      layout="vertical"
      variant={variant || "outlined"}
      style={{ maxWidth: 1000 }}
    >
      <Form.Item
        label="Spesifikasi Drone"
        name="spesifikasi"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <Input onChange={(e) => setSpesifikasi(e.target.value)} />
      </Form.Item>

      <Form.Item
        label="Tanggal Pengesahan"
        name="tanggal"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <DatePicker
          style={{ width: "100%" }}
          onChange={(date, dateString) => setTanggal(dateString)}
        />
      </Form.Item>

      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: "Please input number!" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          onChange={(value) => setQuantity(value || 0)}
        />
      </Form.Item>

      <Form.Item
        label="Harga Satuan"
        name="harga_satuan"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          formatter={(value) =>
            `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }
          parser={(value) => value?.replace(/Rp\s?|(\.*)/g, "")}
          onChange={(value) => setHargaSatuan(value || 0)}
        />
      </Form.Item>

      <Form.Item label="Total Harga" name="totalHarga">
        <InputNumber
          style={{ width: "100%" }}
          disabled
          formatter={(value) =>
            `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }
          parser={(value) => value?.replace(/Rp\s?|(\.*)/g, "")}
        />
      </Form.Item>

      <Form.Item
        label="Baik"
        name="baik"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          onChange={(value) => setBaik(value || 0)}
        />
      </Form.Item>

      <Form.Item
        label="Perbaikan"
        name="perbaikan"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          onChange={(value) => setPerbaikan(value || 0)}
        />
      </Form.Item>

      <Form.Item label="Afkir" name="afkir" valuePropName="checked">
        <Checkbox
          disabled={disableAfkir}
          onChange={(e) => setAfkir(e.target.checked)}
        >
          Afkir
        </Checkbox>
      </Form.Item>

      <Form.Item
        name="gambar1"
        label="Upload Gambar 1"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        initialValue={
          data?.GAMBAR1 && data !== null
            ? [
                {
                  uid: "-1",
                  name: "gambar1.png",
                  status: "done",
                  url: `${BaseURL}/attachments/drone/bukti_realisasi/${data.GAMBAR1}`,
                },
              ]
            : []
        }
      >
        <Upload
          name="gambar1"
          listType="picture"
          accept="image/*"
          maxCount={1}
          beforeUpload={() => false}
          onChange={({ fileList }) => setGambarSatu(fileList)}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="gambar2"
        label="Upload Gambar 2"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        initialValue={
          data?.GAMBAR2 && data !== null
            ? [
                {
                  uid: "-2",
                  name: "gambar2.png",
                  status: "done",
                  url: `${BaseURL}/attachments/drone/bukti_realisasi/${data.GAMBAR2}`,
                },
              ]
            : []
        }
      >
        <Upload
          name="gambar2"
          listType="picture"
          accept="image/*"
          maxCount={1}
          beforeUpload={() => false}
          onChange={({ fileList }) => setGambarDua(fileList)}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="gambar3"
        label="Upload Gambar 3"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        initialValue={
          data?.GAMBAR3 && data !== null
            ? [
                {
                  uid: "-3",
                  name: "gambar3.png",
                  status: "done",
                  url: `${BaseURL}/attachments/drone/bukti_realisasi/${data.GAMBAR3}`,
                },
              ]
            : []
        }
      >
        <Upload
          name="gambar3"
          listType="picture"
          accept="image/*"
          maxCount={1}
          beforeUpload={() => false}
          onChange={({ fileList }) => setGambarTiga(fileList)}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="gambar4"
        label="Upload Gambar 4"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        initialValue={
          data?.GAMBAR4 && data !== null
            ? [
                {
                  uid: "-4",
                  name: "gambar4.png",
                  status: "done",
                  url: `${BaseURL}/attachments/drone/bukti_realisasi/${data.GAMBAR4}`,
                },
              ]
            : []
        }
      >
        <Upload
          name="gambar4"
          listType="picture"
          accept="image/*"
          maxCount={1}
          beforeUpload={() => false}
          onChange={({ fileList }) => setGambarEmpat(fileList)}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="gambar5"
        label="Upload Gambar 5"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        initialValue={
          data?.GAMBAR5 && data !== null
            ? [
                {
                  uid: "-5",
                  name: "gambar5.png",
                  status: "done",
                  url: `${BaseURL}/attachments/drone/bukti_realisasi/${data.GAMBAR5}`,
                },
              ]
            : []
        }
      >
        <Upload
          name="gambar5"
          listType="picture"
          accept="image/*"
          maxCount={1}
          beforeUpload={() => false}
          onChange={({ fileList }) => setGambarLima(fileList)}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
}
