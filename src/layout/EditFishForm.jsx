import React, { useState, useEffect } from "react";
import axios from "axios";

const EditFishForm = ({ fishId, onClose, onEdit }) => {
  const [formData, setFormData] = useState({
    title: "",
  });

  useEffect(() => {
    const fetchFishDetails = async () => {
      try {
        const response = await axios.get
          (`http://localhost:8889/fish/fishes/${fishId}`
        );
        setFormData(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchFishDetails();
  }, [fishId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditFish = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:8889/fish/fishes/${fishId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onEdit(response.data);
      onClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-5 border w-4/6 min-w-[500px] mx-auto rounded mt-5">
      <div className="text-3xl mb-5">แก้ไขพันธุ์ปลา</div>
      <form
        className="flex flex-col gap-2 md:flex-row md:gap-4"
        onSubmit={handleEditFish}
      >
        <label className="form-control flex-grow max-w-xs">
          <div className="label">
            <span className="label-text">ชื่อปลา</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>

        <div className="flex gap-5 mt-5 md:mt-0">
          <button type="submit" className="btn btn-outline btn-info">
            บันทึก
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-danger"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFishForm;
