import { Button, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
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

export default function ModalTambahMerk({
  setNama,
  setGambar,
  editMerk,
  setIdMerk,
}) {
  const [form] = Form.useForm();
  const variant = Form.useWatch("variant", form);

  useEffect(() => {
    if (editMerk) {
      const initialValues = {
        nama: editMerk.NAMA || "",
      };

      // Set form fields
      form.setFieldsValue(initialValues);

      // Set state values
      setNama(editMerk.NAMA || "");
      setIdMerk(editMerk.ID);

      // Set initial gambar jika ada
      if (editMerk.GAMBAR) {
        const initialFileList = [
          {
            uid: `existing-image-${editMerk.ID}`,
            name: editMerk.GAMBAR,
            status: "done",
            url: `${BaseURL}/attachments/drone/bukti_realisasi/${editMerk.GAMBAR}`,
            // Mark sebagai existing file, bukan new upload
            isExisting: true,
          },
        ];

        // Set field value untuk form
        form.setFieldValue("gambar", initialFileList);
        // Update state
        setGambar(initialFileList);
      }
    } else {
      // Reset form untuk mode tambah
      form.resetFields();
      setNama("");
      setGambar([]);
    }
  }, [editMerk, form, setNama, setGambar, setIdMerk]);

  const handleUploadChange = ({ fileList }) => {
    setGambar(fileList);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setNama(value);
    // Update form field juga
    form.setFieldValue("nama", value);
  };

  // Custom beforeUpload untuk mencegah auto upload
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Hanya file gambar yang diperbolehkan!");
      return false;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ukuran file maksimal 2MB!");
      return false;
    }

    return false; // Prevent auto upload
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      layout="vertical"
      variant={variant || "outlined"}
      style={{ maxWidth: 1000 }}
    >
      <Form.Item
        label="Merk Drone"
        name="nama"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <Input
          onChange={handleNameChange}
          placeholder="Masukkan nama merk drone"
        />
      </Form.Item>

      <Form.Item
        name="gambar"
        label="Upload Gambar"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="Format: JPG, PNG, maksimal 2MB"
      >
        <Upload
          name="gambar"
          listType="picture"
          accept="image/*"
          maxCount={1}
          beforeUpload={beforeUpload}
          onChange={handleUploadChange}
          onRemove={(file) => {
            return true;
          }}
        >
          <Button icon={<UploadOutlined />}>
            {editMerk ? "Ganti Gambar" : "Upload Gambar"}
          </Button>
        </Upload>
      </Form.Item>
    </Form>
  );
}
