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
  updateAddMerk,
}) {
  const [form] = Form.useForm();
  const variant = Form.useWatch("variant", form);

  useEffect(() => {
    if (updateAddMerk === 1 && editMerk) {
      // Mode edit
      const initialFileList = [
        {
          uid: `existing-image-${editMerk.ID}`,
          name: editMerk.GAMBAR,
          status: "done",
          url: `${BaseURL}/attachments/drone/bukti_realisasi/${editMerk.GAMBAR}`,
          isExisting: true,
        },
      ];
      
      form.setFieldsValue({
        nama: editMerk.NAMA,
        gambar: initialFileList,
      });
      
      setNama(editMerk.NAMA || "");
      setIdMerk(editMerk.ID);
      setGambar(initialFileList);
    } else if (updateAddMerk === 0) {
      // Mode tambah - reset semua
      form.resetFields();
      setNama("");
      setGambar([]);
      
      // Force reset form fields
      form.setFieldsValue({
        nama: "",
        gambar: [],
      });
    }
  }, [editMerk, updateAddMerk, form, setNama, setGambar, setIdMerk]);

  // Reset form ketika component unmount atau mode berubah
  useEffect(() => {
    return () => {
      if (updateAddMerk === 0) {
        form.resetFields();
        setNama("");
        setGambar([]);
      }
    };
  }, []);

  const handleUploadChange = ({ fileList }) => {
    // Filter hanya file yang valid
    const validFileList = fileList.filter(file => {
      if (file.originFileObj) {
        // File baru
        return true;
      } else if (file.isExisting) {
        // File existing (untuk edit mode)
        return true;
      }
      return false;
    });
    
    setGambar(validFileList);
    // Update form field juga
    form.setFieldValue("gambar", validFileList);
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

  const handleRemove = (file) => {
    // Allow remove dan update state
    const currentFileList = form.getFieldValue("gambar") || [];
    const newFileList = currentFileList.filter(item => item.uid !== file.uid);
    
    setGambar(newFileList);
    form.setFieldValue("gambar", newFileList);
    
    return true;
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      layout="vertical"
      variant={variant || "outlined"}
      style={{ maxWidth: 1000 }}
      preserve={false} // Penting: jangan preserve form values
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
          onRemove={handleRemove}
          fileList={form.getFieldValue("gambar") || []} // Explicitly set fileList
        >
          <Button icon={<UploadOutlined />}>
            {updateAddMerk === 1 ? "Ganti Gambar" : "Upload Gambar"}
          </Button>
        </Upload>
      </Form.Item>
    </Form>
  );
}