// FishManagement.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import EditFishForm from "./EditFishForm";

const FishManagement = () => {
  const [fishes, setFishes] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFishId, setEditFishId] = useState(null);

  useEffect(() => {
    const fetchFishes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8889/fish/fishes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFishes(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเรียกปลา:", error.message);
      }
    };

    fetchFishes();
  }, []);

  const handleEditFish = (editedFish) => {
    setFishes((prevFishes) =>
      prevFishes.map((fish) => (fish.id === editedFish.id ? editedFish : fish))
    );
    setShowEditForm(false);
  };

  const handleDeleteFish = async (fishId) => {
    try {
      const shouldDelete = window.confirm("คุณแน่ใจหรือไม่ที่จะลบรายการนี้?");
      if (!shouldDelete) {
        return;
      }
      await axios.delete(`http://localhost:8889/fish/fishes/${fishId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFishes((prevFishes) => prevFishes.filter((fish) => fish.id !== fishId));
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบปลา:", error.message);
    }
  };

  return (
    <div className="p-5 border w-4/6 min-w-full mx-auto rounded mt-5">
      {showEditForm && (
        <EditFishForm
          fishId={editFishId}
          onClose={() => setShowEditForm(false)}
          onEdit={handleEditFish}
        />
      )}
      <h2 className="text-3xl m-5">จัดการปลา</h2>
      <ul className="flex flex-wrap">
        {fishes.map((fish) => (
          <li
            key={fish.id}
            className="mb-4 flex w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
          >
            <div>
              <div className="m-1">ชื่อปลา: {fish.title}</div>
              <div>
                <button
                  onClick={() => {
                    setShowEditForm(true);
                    setEditFishId(fish.id);
                  }}
                  className="btn btn-outline btn-info btn-sm mr-2 mb-2"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDeleteFish(fish.id)}
                  className="btn btn-outline btn-info btn-sm"
                >
                  ลบรายการ
                </button>
              </div>
            </div>
            <div className="m-3">
              <img
                src={`http://localhost:8889/fish/uploads${fish.image}`}
                alt={fish.title}
                className="w-52 h-52"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FishManagement;
