import { Routes, Route, useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import CreateRoomPage from "./pages/CreateRoomPage";
import googleImage from "./google.png";
import whenwemeetImage from "./WhenWeMeet.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function Navbar() {
  const navigate = useNavigate();

  const [member, setMember] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          return null;
        }
        return res.json();
      })
      .then((data) => {
        setMember(data);
      })
      .catch(() => {});
  }, []);

  const logout = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <img src={whenwemeetImage} alt="WhenWeMeet" height="90px" />
      </Link>

      <div className="nav-menu">
        

        <button
          onClick={async () => {
            try {
              const response = await fetch(
                `${API_BASE_URL}/api/auth/me`,
                {
                  credentials: "include",
                }
              );

              if (!response.ok) {
                alert("로그인 후 이용 가능합니다.");
                navigate("/login");
                return;
              }

              navigate("/rooms/new");
            } catch (err) {
              alert("로그인 확인 중 오류가 발생했습니다.");
            }
          }}
        >
          방 만들기
        </button>

        {!member && (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </>
        )}

        {member && (
          <>
            <Link to="/mypage">마이페이지</Link>
            <span>{member.name}님</span>
            <button onClick={logout}>
              로그아웃
            </button> </>
        )}
      </div>
    </nav>
  );
}

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    loginId: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const login = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      alert("로그인 성공!");
      navigate("/");
      window.location.reload();
    } catch (err) {
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>로그인</h1>

        <label>아이디</label>
        <input name="loginId" value={form.loginId} onChange={handleChange} />

        <label>비밀번호</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <button onClick={login}>로그인</button>
        <div className="social-login-box">
          <button
            type="button"
            className="google-login-btn"
            onClick={() => {
              window.location.href =
                `${API_BASE_URL}/oauth2/authorization/google`;
            }}
          >
            <img
              src={googleImage}
              alt="Google 로그인"
              className="google-login-icon"
            />

            <span>Google로 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    loginId: "",
    password: "",
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const signup = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();

        try {
          const errorData = JSON.parse(errorText);
          alert(
            errorData.message ||
              Object.values(errorData)[0] ||
              "회원가입 실패"
          );
        } catch {
          alert(errorText || "회원가입 실패");
        }

        return;
      }

      alert("회원가입 성공!");
      navigate("/login");
    } catch (err) {
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>회원가입</h1>

        <label>이름</label>
        <input name="name" value={form.name} onChange={handleChange} />

        <label>아이디</label>
        <input name="loginId" value={form.loginId} onChange={handleChange} />

        <label>이메일</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@email.com"
        />

        <label>비밀번호</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <button onClick={signup}>회원가입</button>
      </div>
    </div>
  );
}

function PasswordResetPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [sendingCode, setSendingCode] = useState(false);

  const [form, setForm] = useState({
    loginId: "",
    email: "",
    code: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const sendCode = async () => {
    if (sendingCode) {
      return;
    }

    setSendingCode(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/password-reset/code`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: form.loginId,
          email: form.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || "인증코드 발송 실패");
        return;
      }

      alert("인증코드가 이메일로 발송되었습니다.");
      setStep(2);
    } catch (err) {
      alert("인증코드 발급 중 오류가 발생했습니다.");
    } finally {
      setSendingCode(false);
    }
  };

  const verifyCode = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/password-reset/verify`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: form.loginId,
          email: form.email,
          code: form.code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || "인증코드 확인 실패");
        return;
      }

      alert("인증코드가 확인되었습니다.");
      setStep(3);
    } catch (err) {
      alert("인증코드 확인 중 오류가 발생했습니다.");
    }
  };

  const resetPassword = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/password-reset/confirm`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: form.loginId,
          email: form.email,
          code: form.code,
          newPassword: form.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || "비밀번호 변경 실패");
        return;
      }

      alert("비밀번호가 변경되었습니다.");
      navigate("/login");
    } catch (err) {
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>비밀번호 찾기</h1>

        <label>아이디</label>
        <input
          name="loginId"
          value={form.loginId}
          onChange={handleChange}
          disabled={step !== 1}
        />

        <label>이메일</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        {step === 1 && (
          <button onClick={sendCode} disabled={sendingCode}>
            {sendingCode ? "인증코드 발송 중..." : "인증코드 발급"}
          </button>
        )}

        {sendingCode && (
          <p className="loading-text">
            이메일을 보내는 중입니다. 잠시만 기다려주세요.
          </p>
        )}
        

        {step >= 2 && (
          <>
            <label>인증코드</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              disabled={step === 3}
            />

            {step === 2 && (
              <button onClick={verifyCode}>
                인증코드 확인
              </button>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <label>새 비밀번호</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
            />

            <button onClick={resetPassword}>
              비밀번호 변경
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => navigate("/login")}
        >
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();

  const [inviteCode, setInviteCode] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");

  const enterByInviteCode = async () => {
    if (!inviteCode.trim()) {
      alert("초대코드를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/rooms/invite/${inviteCode.trim()}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        const message =
          errorData?.message ||
          (response.status === 500
            ? "서버 오류가 발생했습니다. 백엔드 로그를 확인해주세요."
            : "존재하지 않는 초대코드입니다.");

        alert(message);
        return;
      }

      navigate(`/invite/${inviteCode.trim()}`);
    } catch (err) {
      alert("초대코드 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container">
      <section className="hero-section">
        <div className="hero-badge">Team Schedule Planner</div>

        <h1 className="hero-title">WhenWeMeet</h1>

        <p className="hero-description">
          여러 사람의 가능한 날짜를 모아서 가장 좋은 만남 날짜를 쉽게 정하세요.
        </p>

        <div className="hero-actions">
          <button onClick={() => navigate("/mypage")}>
            내 일정방 보기
          </button>
        </div>
      </section>

      <section className="main-action-grid">
        <div className="card main-action-card">
          <h2>초대코드로 참여하기</h2>
          <p className="sub-text">
            받은 초대코드를 입력하고 일정 조율에 참여하세요.
          </p>

          <input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="초대코드를 입력하세요"
          />

          <button onClick={enterByInviteCode}>
            참여하러 가기
          </button>
        </div>

        <div className="card main-action-card">
          <h2>새 일정방 만들기</h2>
          <p className="sub-text">
            모임 이름과 기간을 정하고 친구들에게 초대코드를 공유하세요.
          </p>

          <button
            onClick={async () => {
              try {
                const response = await fetch(
                  `${API_BASE_URL}/api/auth/me`,
                  {
                    credentials: "include",
                  }
                );

                if (!response.ok) {
                  alert("로그인 후 이용 가능합니다.");
                  navigate("/login");
                  return;
                }

                navigate("/rooms/new");
              } catch (err) {
                alert("로그인 확인 중 오류가 발생했습니다.");
              }
            }}
          >
            일정방 만들기
          </button>
        </div>
      </section>

      <section className="card guide-card">
        <h2>사용 방법</h2>

        <div className="guide-grid">
          <div>
            <strong>1. 방 만들기</strong>
            <p>모임 제목과 후보 기간을 설정합니다.</p>
          </div>

          <div>
            <strong>2. 초대하기</strong>
            <p>초대코드나 초대링크를 공유합니다.</p>
          </div>

          <div>
            <strong>3. 날짜 선택</strong>
            <p>참가자들이 가능한 날짜를 선택합니다.</p>
          </div>

          <div>
            <strong>4. 일정 확정</strong>
            <p>모두 가능한 날짜를 확인하고 일정을 확정합니다.</p>
          </div>
        </div>
      </section>

      {error && <div className="error">{error}</div>}
    </div>
  );
}

function MyPage() {
  const navigate = useNavigate();

  const [ownedRooms, setOwnedRooms] = useState([]);
  const [member, setMember] = useState(null);
  const [joinedRooms, setJoinedRooms] = useState([]);

  useEffect(() => {
    const fetchJson = async (url, failMessage) => {
      const res = await fetch(url, {
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();

        let message = failMessage;

        try {
          const errorData = JSON.parse(text);
          message = errorData?.message || failMessage;
        } catch (e) {
          message = text || failMessage;
        }

        throw new Error(message);
      }

      return res.json();
    };

    const fetchMyPageData = async () => {
      try {
        const memberData = await fetchJson(
          `${API_BASE_URL}/api/auth/me`,
          "회원 정보 조회 실패"
        );

        setMember(memberData);

        const ownedData = await fetchJson(
          `${API_BASE_URL}/api/mypage/rooms/owned`,
          "내가 만든 방 조회 실패"
        );

        setOwnedRooms(Array.isArray(ownedData) ? ownedData : []);

        const joinedData = await fetchJson(
          `${API_BASE_URL}/api/mypage/rooms/joined`,
          "참여한 방 조회 실패"
        );

        setJoinedRooms(Array.isArray(joinedData) ? joinedData : []);
      } catch (err) {
        console.error("마이페이지 조회 오류:", err);
        alert(err?.message || "마이페이지 조회 중 오류가 발생했습니다.");
      }
    };

    fetchMyPageData();
  }, []);

  return (
    <div className="container">
      <h1>마이페이지</h1>
          {member && (
      <div className="card">
        <h2>내 정보</h2>

        <p>이름: {member.name}</p>

        <p>
          아이디/이메일: {member.loginId}
        </p>

        <p>
          로그인 방식:
          {" "}
          {member.provider === "GOOGLE"
            ? "Google 소셜 로그인"
            : "일반 로그인"}
        </p>

        <p>
          가입일:
          {" "}
          {member.createdAt?.replace("T", " ")}
        </p>
        <button
          onClick={async () => {

            const confirmed = window.confirm(
              "정말 회원탈퇴 하시겠습니까?"
            );

            if (!confirmed) {
              return;
            }

            try {
              const response = await fetch(
                `${API_BASE_URL}/api/auth/me`,
                {
                  method: "DELETE",
                  credentials: "include",
                }
              );

              if (!response.ok) {
                alert("회원탈퇴 실패");
                return;
              }

              alert("회원탈퇴 완료");

              window.location.href = "/";
            } catch (err) {
              alert("회원탈퇴 중 오류가 발생했습니다.");
            }
          }}
        >
          회원탈퇴
        </button>
      </div>
    )}

      <div className="card">
        <h2>내가 만든 일정방</h2>

        {ownedRooms.length === 0 ? (
          <p>아직 만든 일정방이 없습니다.</p>
        ) : (
          <div className="date-grid">
            {ownedRooms.map((room) => (
              <div className="date-card" key={room.id}>
                <div className="date">{room.title}</div>
                <div className="count">
                  {room.startDate} ~ {room.endDate}
                </div>

                <button onClick={() => navigate(`/rooms/${room.id}`)}>
                  상세보기
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="card">
        <h2>내가 참여한 일정방</h2>

        {joinedRooms.length === 0 ? (
          <p>참여 중인 일정방이 없습니다.</p>
        ) : (
          <div className="date-grid">
            {joinedRooms.map((room) => (
              <div className="date-card" key={room.id}>
                <div className="date">{room.title}</div>
                <div className="count">
                  {room.startDate} ~ {room.endDate}
                </div>

                <button onClick={() => navigate(`/rooms/${room.id}`)}>
                  상세보기
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [room, setRoom] = useState(null);
  const [dateCounts, setDateCounts] = useState([]);
  const [commonDates, setCommonDates] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [member, setMember] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [pendingParticipants, setPendingParticipants] = useState([]);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [selectedCalendarResult, setSelectedCalendarResult] = useState(null);
  

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/rooms/${roomId}`, {
      credentials: "include",
    })
      .then(async (res) => {

        if (!res.ok) {

          const errorData = await res.json().catch(() => null);

          const message =
            errorData?.message || "방 정보를 찾을 수 없습니다.";

          alert(message);

          navigate("/");

          throw new Error(message);
        }

        return res.json();
      })
      .then((data) => {
        setRoom(data);

        setEditForm({
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
        });
      });

    fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => setMember(data))
      .catch(() => setMember(null));

    fetch(`${API_BASE_URL}/api/rooms/${roomId}/result`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setDateCounts(data));

    fetch(`${API_BASE_URL}/api/rooms/${roomId}/result/pending`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPendingParticipants(data));

    fetch(`${API_BASE_URL}/api/rooms/${roomId}/result/common`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCommonDates(data));

    

    fetch(`${API_BASE_URL}/api/rooms/${roomId}/participants`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error("참여자 명단 조회 실패:", text);
          return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : [];
      })
      .then((data) => setParticipants(data))
      .catch((err) => {
        console.error("참여자 명단 요청 오류:", err);
        setParticipants([]);
      });
  }, [roomId]);

  if (!room) {
    return <div className="container">불러오는 중...</div>;
  }

  console.log("room =", room);
  console.log("member =", member);
  console.log("ownerId =", room?.ownerId);
  console.log("memberId =", member?.id);

  const isOwner =
    member &&
    room &&
    Number(room.ownerId) === Number(member.id);

  const isConfirmed = !!room.confirmedDate;

  const confirmDate = async (date) => {
    const confirmed = window.confirm(`${date}로 일정을 확정하시겠습니까?`);

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/rooms/${roomId}/confirm?date=${date}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || "일정 확정 실패");
        return;
      }

      alert("일정이 확정되었습니다.");

      setRoom({
        ...room,
        confirmedDate: date,
      });
    } catch (err) {
      alert("일정 확정 중 오류가 발생했습니다.");
    }
  };
  
  const cancelConfirmedDate = async () => {
    const confirmed = window.confirm("확정된 일정을 취소하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}/confirm/cancel`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || "일정 확정 취소 실패");
        return;
      }

      const updatedRoom = await response.json();

      setRoom({
        ...updatedRoom,
        confirmedDate: null,
      });

      alert("일정 확정이 취소되었습니다.");
    } catch (err) {
      alert("일정 확정 취소 중 오류가 발생했습니다.");
    }
  };
  
  const updateRoom = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/rooms/${roomId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || "방 수정 실패");
        return;
      }

      const updatedRoom = await response.json();

      setRoom(updatedRoom);
      setEditMode(false);
      alert("방 수정 완료");
    } catch (err) {
      alert("방 수정 중 오류가 발생했습니다.");
    }
  };

  const inviteUrl = `${window.location.origin}/invite/${room.inviteCode}`;


  const copyInviteUrl = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      alert("초대 링크가 복사되었습니다.");
    } catch (err) {
      alert("초대 링크 복사에 실패했습니다.");
    }
  };

  const totalParticipantCount = participants.length;

  const resultEvents = dateCounts.map((item) => {
    const availableCount = item.participants.length;

    const isAllAvailable =
      totalParticipantCount > 0 &&
      availableCount === totalParticipantCount;

    return {
      title: isAllAvailable ? "모두 가능" : `${availableCount}명 가능`,
      date: item.date,
      className: isAllAvailable
        ? "event-all-available"
        : "event-partial-available",
      extendedProps: {
        participants: item.participants,
      },
    };
  });

  return (
    <div className="container">
      <h1>{room.title}</h1>

      {room.confirmedDate && (
        <div className="card confirmed-card">
          <div className="confirmed-badge">
            일정 확정 완료
          </div>

          <h2>확정된 일정</h2>

          <p className="confirmed-date">
            {room.confirmedDate}
          </p>

          {isOwner && (
            <button
              className="cancel-confirm-button"
              onClick={cancelConfirmedDate}
            >
              확정 취소
            </button>
          )}
        </div>
      )}
    {isOwner && (
      <button
        onClick={async () => {

          const confirmed = window.confirm(
            "정말 이 방을 삭제하시겠습니까?"
          );

          if (!confirmed) {
            return;
          }

          try {

            const response = await fetch(
              `${API_BASE_URL}/api/rooms/${roomId}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );

            if (!response.ok) {

              const text = await response.text();

              alert(text || "방 삭제 실패");
              return;
            }

            alert("방 삭제 완료");

            navigate("/mypage");

          } catch (err) {
            alert("방 삭제 중 오류가 발생했습니다.");
          }
        }}
      >
        방 삭제
      </button>
    )}
    {isConfirmed && (
      <div className="confirmed-lock-notice">
        이 방은 일정이 확정되어 날짜 선택과 방 수정이 제한됩니다.
      </div>
    )}

    <div className="card room-info-card">
      {editMode ? (
        <>
          <h2>방 정보 수정</h2>

          <label>제목</label>
          <input
            value={editForm.title}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                title: e.target.value,
              })
            }
          />

          <label>설명</label>
          <textarea
            value={editForm.description}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                description: e.target.value,
              })
            }
          />

          <label>시작일</label>
          <input
            type="date"
            value={editForm.startDate}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                startDate: e.target.value,
              })
            }
          />

          <label>종료일</label>
          <input
            type="date"
            value={editForm.endDate}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                endDate: e.target.value,
              })
            }
          />

          <button onClick={updateRoom}>수정 저장</button>
          <button onClick={() => setEditMode(false)}>취소</button>
        </>
      ) : (
        <>
          <div className="room-info-header">
            <h2>방 정보</h2>

            {isOwner && (
              <span className="owner-small-badge">
                👑 방장
              </span>
            )}
          </div>

          <p className="room-description">
            {room.description || "방 설명이 없습니다."}
          </p>

          <div className="room-info-list">
            <div className="room-info-row">
              <span className="room-info-label">기간</span>
              <span className="room-info-value">
                {room.startDate} ~ {room.endDate}
              </span>
            </div>

            <div className="room-info-row">
              <span className="room-info-label">초대코드</span>

              <div className="copy-row">
                <input value={room.inviteCode} readOnly />
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(room.inviteCode);
                      alert("초대코드가 복사되었습니다.");
                    } catch (err) {
                      alert("초대코드 복사에 실패했습니다.");
                    }
                  }}
                >
                  복사
                </button>
              </div>
            </div>

            <div className="room-info-row">
              <span className="room-info-label">초대링크</span>

              <div className="copy-row">
                <input value={inviteUrl} readOnly />
                <button onClick={copyInviteUrl}>복사</button>
              </div>
            </div>
          </div>

          <div className="room-action-area">
            {isOwner && !isConfirmed && (
              <button onClick={() => setEditMode(true)}>
                방 수정
              </button>
            )}

            {!isConfirmed && (
              <button onClick={() => navigate(`/invite/${room.inviteCode}`)}>
                내 가능 날짜 수정하기
              </button>
            )}
          </div>
        </>
      )}
    </div>

      <div className="card">
        <h2>방 참여자 명단</h2>

        {participants.length === 0 ? (
          <p>아직 참여자가 없습니다.</p>
        ) : (
          <div className="date-grid">
            {participants.map((participant, index) => (
              <div className="participant-card" key={participant.id}>
                <div className="participant-avatar">
                  {participant.name?.charAt(0)}
                </div>

                <div className="participant-info">
                  <div className="participant-name">
                    {participant.name}
                  </div>

                  <div className="participant-role">
                    {participant.loginId ? `@${participant.loginId}` : `참가자 #${participant.id}`}
                  </div>

                  {participant.owner && (
                    <div className="owner-badge">
                      👑 방장
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pendingParticipants.length > 0 && (
        <div className="pending-section">
          <h3>아직 날짜를 선택하지 않은 참가자</h3>

          <div className="date-grid">
            {pendingParticipants.map((participant) => (
              <div
                key={participant.participantId}
                className="participant-card pending-card"
              >
                <div className="participant-avatar">
                  {participant.name?.charAt(0)}
                </div>

                <div className="participant-info">
                  <div className="participant-name">
                    {participant.name}
                  </div>

                  <div className="participant-role pending-role">
                    날짜 미선택
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2>일정 결과 캘린더</h2>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={room.startDate}
          events={resultEvents}
          height="auto"
          eventClick={(info) => {
            const participants =
              info.event.extendedProps.participants || [];

            setSelectedCalendarResult({
              date: info.event.startStr,
              title: info.event.title,
              participants,
            });
          }}
          eventMouseEnter={(info) => {
            const participants =
              info.event.extendedProps.participants || [];

            setSelectedCalendarResult({
              date: info.event.startStr,
              title: info.event.title,
              participants,
            });
          }}
        />

        <div className="date-card common-date-card" style={{ marginTop: "16px" }}>
          {selectedCalendarResult ? (
            <>
              <div className="common-badge">
                선택한 날짜
              </div>

              <div className="date">
                {selectedCalendarResult.date}
              </div>

              <div className="count">
                {selectedCalendarResult.title}
              </div>

              {selectedCalendarResult.participants.length === 0 ? (
                <p>가능한 참가자가 없습니다.</p>
              ) : (
                <div className="participants participant-chip-list">
                  {selectedCalendarResult.participants.map((participant) => (
                    <span key={participant.id} className="participant-chip">
                      {participant.name}
                      {participant.loginId && (
                        <small>@{participant.loginId}</small>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p style={{ margin: 0 }}>
              캘린더의 초록색/주황색 일정 표시를 클릭하면 가능한 참가자가 여기에 표시됩니다.
            </p>
          )}
        </div>
      </div>

      <div className="card">
        <h2>모두 가능한 날짜</h2>

        {commonDates.length === 0 ? (
          <p>아직 모두 가능한 날짜가 없습니다.</p>
        ) : (
          <div className="date-grid">
            {commonDates.map((date) => {
              const matched = dateCounts.find((item) => item.date === date);
              const dateParticipants = matched?.participants || [];

          return (
            <div className="date-card common-date-card" key={date}>
              <div className="common-badge">
                모두 가능
              </div>

              <div className="date">
                {date}
              </div>

              <div className="count">
                {dateParticipants.length}명 가능
              </div>

              <div className="participants participant-chip-list">
                {dateParticipants.map((participant) => (
                  <span key={participant.id} className="participant-chip">
                    {participant.name}
                    {participant.loginId && (
                      <small>@{participant.loginId}</small>
                    )}
                  </span>
                ))}
              </div>

              {isOwner && !isConfirmed && (
                <button
                  className="confirm-date-button"
                  onClick={() => confirmDate(date)}
                >
                  이 날짜로 확정
                </button>
              )}
            </div>
          );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function InvitePage() {
  const navigate = useNavigate();
  const { inviteCode } = useParams();

  const [room, setRoom] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [error, setError] = useState("");

  const leaveRoom = async () => {
  const confirmed = window.confirm("정말 이 방에서 나가시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/rooms/${room.id}/participants/me`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        alert(errorData?.message || "방 나가기 실패");
        return;
      }

      alert("방에서 나갔습니다.");

      setParticipantId(null);
      setSelectedDates([]);

      navigate(`/rooms/${room.id}`);
    } catch (err) {
      alert("방 나가기 중 오류가 발생했습니다.");
    }
  };
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/rooms/invite/${inviteCode}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          const message = errorData?.message || "방 정보를 찾을 수 없습니다.";

          alert(message);
          navigate("/");
          throw new Error(message);
        }

        return res.json();
      })
      .then((data) => {
        setRoom(data);

        return fetch(
          `${API_BASE_URL}/api/rooms/${data.id}/participants/me`,
          {
            credentials: "include",
          }
        );
      })
      .then((res) => {
        if (!res.ok) {
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setParticipantId(data);

          return fetch(
            `${API_BASE_URL}/api/participants/${data}/available-dates`,
            {
              credentials: "include",
            }
          );
        }

        return null;
      })
      .then((res) => {
        if (!res) {
          return null;
        }

        return res.json();
      })
      .then((dates) => {
        if (dates) {
          setSelectedDates(dates);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [inviteCode]);

  const joinRoom = async () => {
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/rooms/${room.id}/participants`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "참여 실패");
      }

      const id = await response.json();

      setParticipantId(id);
      alert("참여 완료!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentDate = new Date(clickedDate);

    if (currentDate < today) {
      return;
    }

    if (selectedDates.includes(clickedDate)) {
      setSelectedDates(
        selectedDates.filter((d) => d !== clickedDate)
      );
    } else {
      setSelectedDates([...selectedDates, clickedDate]);
    }
  };

  const saveAvailableDates = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/participants/${participantId}/available-dates`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dates: selectedDates,
          }),
        }
      );

      if (!response.ok) {
        alert("가능 날짜 저장 실패");
        return;
      }

      alert("가능 날짜 저장 완료!");
      navigate(`/rooms/${room.id}`);
    } catch (err) {
      alert("가능 날짜 저장 중 오류가 발생했습니다.");
    }
  };

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!room) {
    return <div className="container">불러오는 중...</div>;
  }

  const events = selectedDates.map((date) => ({
    title: "가능",
    date,
    className: "selected-date-event",
  }));

  return (
    <div className="container">
      <h1 className="room-title">{room.title}</h1>
      <p>{room.description}</p>

      <div className="card">
        <p>
          기간: {room.startDate} ~ {room.endDate}
        </p>

        {!participantId && (
          <>
            <p>로그인한 계정으로 이 일정에 참여합니다.</p>
            <button onClick={joinRoom}>참여하기</button>
          </>
        )}

        {participantId && (
          <>
            <p>가능한 날짜를 클릭해서 수정하세요.</p>
            <button onClick={leaveRoom}>
              방 나가기
            </button>

            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              initialDate={room.startDate}
              dateClick={handleDateClick}
              events={events}
              height="auto"
              dayCellClassNames={(arg) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (arg.date < today) {
                  return ["past-day"];
                }

                return [];
              }}
            />

            <button onClick={saveAvailableDates}>가능 날짜 저장</button>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms/new" element={<CreateRoomPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/rooms/:roomId" element={<RoomPage />} />
        <Route path="/invite/:inviteCode" element={<InvitePage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>

        <footer className="footer">
          <p>문의사항은 "whenwemeet.service@gmail.com" 으로 보내주세요!</p>
          <p>© 2026 WhenWeMeet. All rights reserved.</p>
          <br></br>
        </footer>
    </>
  );
}

export default App;