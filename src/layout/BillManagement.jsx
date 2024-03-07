import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-timezone";

const BillManagement = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("token");

        const billResponse = await axios.get(
          "http://localhost:8889/bill/bills",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const membersResponse = await axios.get(
          "http://localhost:8889/member/members",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fishsResponse = await axios.get(
          "http://localhost:8889/fish/fishes",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const billDataWithDetails = billResponse.data.map((bill) => {
          const fish = fishsResponse.data.find(
            (fish) => fish.id === bill.fishId
          );
          const member = membersResponse.data.find(
            (member) => member.id === bill.memberId
          );

          return {
            ...bill,
            fishTitle: fish ? fish.title : "N/A",
            memberPhone: member ? member.phone : "N/A",
            memberName: member ? member.name : "N/A",
            memberAddress: member ? member.address : "N/A",
          };
        });

        setBills(billDataWithDetails);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchBills();
  }, []);

  const handleReturn = async (billId) => {
    try {
      const shouldReturn = window.confirm(
        "คุณแน่ใจหรือไม่ที่จะทำการคืนอุปกรณ์กีฬา?"
      );
      if (!shouldReturn) {
        return;
      }
  
      const thaiCurrentDate = moment().tz("Asia/Bangkok").format("YYYY-MM-DD");
      await axios.put(
        `http://localhost:8889/bill/bills/${billId}/return`, // เพิ่มเส้นทาง "/return" สำหรับ API การ Return
        { status: "จ่ายแล้ว", shotDate: thaiCurrentDate },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      // Update bills state after a successful return transaction
      setBills((bills) =>
        bills.map((bill) =>
          bill.id === billId
            ? { ...bill, status: "จ่ายแล้ว", shotDate: thaiCurrentDate }
            : bill
        )
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (billId) => {
    try {
      const shouldDelete = window.confirm("คุณแน่ใจหรือไม่ที่จะลบรายการนี้?");
      if (!shouldDelete) {
        return;
      }

      await axios.delete(`http://localhost:8889/bill/bills/${billId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setBills((bills) => bills.filter((bill) => bill.id !== billId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-5 border w-4/6 min-w-[1000px] mx-auto rounded mt-5">
      <h2 className="text-3xl m-5">รายการบิลทั้งหมด</h2>
      <ul>
        {bills.map((bill) => (
          <li key={bill.id} className="mb-2">
            <div className="m-1">ชื่อพันธุ์ปลา : {bill.fishTitle}</div>
            <div className="m-1 mb-3">ชื่อลูกค้า : {bill.memberName}</div>
            <div className="m-1 mb-3">ที่อยู่ : {bill.memberAddress}</div>
            <div className="m-1 mb-3">เบอร์โทรศัพท์ : {bill.memberPhone}</div>
            <div className="m-1 mb-3">วันที่เพิ่มบิล : {bill.dayDate}</div>
            <div className="m-1 mb-3">วันที่จ่าย : {bill.shotDate}</div>
            <div className="m-1 mb-3">สถานะ : {bill.status}</div>
            <div className="flex">
              {bill.status === "ยังไม่จ่าย" && (
                <button
                  onClick={() => handleReturn(bill.id)}
                  className="btn btn-outline btn-info btn-sm mr-2"
                >
                  จ่ายเงิน
                </button>
              )}
              <button
                onClick={() => handleDelete(bill.id)}
                className="btn btn-outline btn-info btn-sm"
              >
                ลบรายการ
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BillManagement;
