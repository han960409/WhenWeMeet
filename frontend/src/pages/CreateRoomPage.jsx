import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateRoomPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createRoom = async () => {
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/rooms", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "방 생성 실패");
      }

      const roomId = await response.json();

      alert("방 생성 완료!");
      navigate(`/rooms/${roomId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>새 일정방 만들기</h1>

      <div className="card">
        <label>제목</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="예: 주말 스터디 일정"
        />

        <label>설명</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="어떤 모임인지 간단히 적어주세요"
        />

        <label>시작일</label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
        />

        <label>종료일</label>
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
        />

        <button onClick={createRoom}>방 만들기</button>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          메인으로 돌아가기
        </button>
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default CreateRoomPage;