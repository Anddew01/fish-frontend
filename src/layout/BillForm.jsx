import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";

const BillForm = () => {
  const [formData, setFormData] = useState({
    memberId: "",
    fishId: "",
    status: "ยังไม่จ่าย",
    dayDate: moment().tz("Asia/Bangkok").format("YYYY-MM-DD"),
    money: "",
  });
  const [fish, setFish] = useState([]);
  const [members, setMembers] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchFish = async () => {
      try {
        const response = await axios.get("http://localhost:8889/fish/fishes", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          setFish(response.data);
        } else {
          console.error("Error fetching fish:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching fish:", error.message);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8889/member/members",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setMembers(response.data);
        } else {
          console.error("Error fetching members:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching members:", error.message);
      }
    };

    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }

    fetchFish();
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBorrow = async (e) => {
    e.preventDefault();

    try {
      const selectedMemberId = formData.memberId;

      const response = await axios.post(
        "http://localhost:8889/bill/bills",
        {
          ...formData,
          memberId: selectedMemberId,
          dayDate: moment().tz("Asia/Bangkok").format("YYYY-MM-DD"),
          shotDate: null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);
      alert("เพิ่มบิลเรียบร้อยแล้ว");

      setFormData((prevData) => ({
        ...prevData,
        memberId: "",
        fishId: "",
        status: "ยังไม่จ่าย",
        dayDate: moment().tz("Asia/Bangkok").format("YYYY-MM-DD"),
        money: "",
      }));
    } catch (error) {
      console.error(error.message);
      alert("เกิดข้อผิดพลาดขณะทำรายการ กรุณาลองอีกครั้ง");
    }
  };

  return (
    <div className="p-5 border w-4/6 min-w-[500px] mx-auto rounded mt-5">
      <div className="text-3xl mb-5">เพิ่มบิล</div>
      <form className="flex flex-col gap-2" onSubmit={handleBorrow}>
        {/* ตัวเลือกลูกค้า */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">ชื่อลูกค้า</span>
          </div>
          <select
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
          >
            <option value="">-- เลือก ชื่อลูกค้า --</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>

        {/* ตัวเลือกพันธุ์ปลา */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">ชื่อพันธุ์ปลา</span>
          </div>
          <select
            name="fishId"
            value={formData.fishId}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
          >
            <option value="">-- เลือก พันธุ์ปลา --</option>
            {fish.map((fishItem) => (
              <option key={fishItem.id} value={fishItem.id}>
                {fishItem.title}
              </option>
            ))}
          </select>
        </label>

        {/* จำนวนเงิน */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">จำนวนเงิน</span>
          </div>
          <input
            type="text"
            name="money"
            value={formData.money}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
            placeholder="กรอกจำนวนเงิน"
          />
        </label>

        {/* สถานะ */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">สถานะ</span>
          </div>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
          >
            <option value="ยังไม่จ่าย">ยังไม่จ่าย</option>
            <option value="จ่ายแล้ว">จ่ายแล้ว</option>
          </select>
        </label>

        <div className="flex gap-5">
          {/* ปุ่มบันทึก */}
          <button type="submit" className="btn btn-outline btn-info mt-7">
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillForm;
