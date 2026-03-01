import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  UserPlus,
  CheckCircle,
  Loader2,
} from "lucide-react";
import CardCourse from "../../Common/CardCourse";
import { slugify } from "../../../../utils/slugify";
import { courseService } from "../../../../services/subscriber";
import { useAuth } from "../../../../context/AuthContext";
import { getAssetUrl } from "../../../../utils/assetHelpper";
import LockedFeature from "../../Common/LockedFeature";

function EventDetailContainer() {
  const { label } = useParams();
  const navigate = useNavigate();
  const { showAlert, isPremium } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const fetchEventData = async () => {
    try {
      setLoading(true);

      const allEvents = await courseService.getAllEvents();
      const foundInList = allEvents.find((e) => slugify(e.title) === label);

      if (!foundInList) {
        setEvent(null);
        return;
      }

      const detail = await courseService.getEventDetail(foundInList.id);

      if (detail) {
        setEvent(detail);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (label) {
      fetchEventData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  const handleJoinEvent = async () => {
    if (!event) return;

    try {
      setJoining(true);
      await courseService.joinEvent(event.id);

      showAlert("Berhasil mendaftar event!", "success");

      await fetchEventData();
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Gagal mendaftar event",
        "error",
      );
    } finally {
      setJoining(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading && !event)
    return (
      <div className="w-full py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!event)
    return (
      <div className="w-full py-20 text-center flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold text-slate-700">
          Event tidak ditemukan
        </h2>
        <p className="text-slate-500">Label: {label}</p>
        <Link
          to="/dashboard-subscriber/latihan"
          className="text-primary font-bold hover:underline"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    );

  // Destructure status user dari backend
  const { is_registered } = event.user_status || {};

  const isEventPremium = event?.jenis?.toLowerCase() === "berbayar";
  const shouldLock = isEventPremium && !isPremium;

  // --- LOGIC 3 FASE WAKTU (THE SMART GATEKEEPER) ---
  const now = new Date();
  const startDate = new Date(event.date_start);
  const endDate = new Date(event.date_end);

  const isUpcoming = now < startDate;
  const isExpired = now > endDate;
  // const isOngoing = now >= startDate && now <= endDate; // Tidak dideklarasikan karena jatuh ke kondisi 'else' terakhir

  return (
    <div className="w-full pb-20">
      {/* --- HERO BANNER --- */}
      <Link
        to="/dashboard-subscriber/latihan/events"
        className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold text-sm m-4 bg-blue-500/10 backdrop-blur-md px-3 py-1.5 rounded-full transition-colors border border-white/10"
      >
        <ArrowLeft size={14} /> Kembali
      </Link>

      <LockedFeature isLocked={shouldLock}>
        <div className="relative w-full h-[300px] md:h-[350px] rounded-2xl overflow-hidden mb-8 shadow-xl group">
          <img
            src={getAssetUrl(event.banner || event.image)}
            alt={event.title}
            className="w-full h-full object-cover "
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight drop-shadow-md">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-200">
                <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded">
                  <Calendar size={16} className="text-orange-400" />
                  {formatDate(event.date_start)} - {formatDate(event.date_end)}
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded">
                  <MapPin size={16} className="text-orange-400" />
                  Online / Daring
                </div>
              </div>
            </div>

            {/* --- KANAN: TOMBOL JOIN ACTION --- */}
            <div className="w-full md:w-auto">
              {is_registered ? (
                // STATE 1: SUDAH TERDAFTAR
                <div className="bg-green-500/90 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg border border-green-400 cursor-default">
                  <CheckCircle size={20} />
                  Kamu Terdaftar
                </div>
              ) : isExpired ? (
                // STATE 2: EVENT SUDAH SELESAI (EXPIRED)
                <button
                  disabled
                  className="bg-slate-500/80 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold w-full md:w-auto cursor-not-allowed"
                >
                  Event Sudah Berakhir
                </button>
              ) : isUpcoming ? (
                // STATE 3: EVENT BELUM MULAI (PRE-REGISTER)
                <button
                  onClick={handleJoinEvent}
                  disabled={joining}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  {joining ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />{" "}
                      Mendaftar...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} /> Daftar Pre-Register
                    </>
                  )}
                </button>
              ) : (
                // STATE 4: EVENT SEDANG BERLANGSUNG (ONGOING)
                <button
                  onClick={handleJoinEvent}
                  disabled={joining}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  {joining ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />{" "}
                      Mendaftar...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} /> Daftar Sekarang
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List Paket Soal */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Paket Soal Event
          </h2>
          {!is_registered && (
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              🔒 Daftar event untuk membuka soal
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {event.courses && event.courses.length > 0 ? (
            event.courses.map((course) => (
              <div key={course.id} className="relative group">
                <CardCourse
                  id={course.id}
                  title={course.title}
                  image={getAssetUrl(course.image)}
                  rating={4.8}
                  totalQuestion={course.total_soal || 0}
                  totalSoal={course.total_soal || 0}
                  category={event.category}
                  jenisPaket={!is_registered ? "locked" : "gratis"}
                  path={`/dashboard-subscriber/latihan/events/${slugify(event.title)}/${slugify(course.title)}`}
                  lockedReason={course.locked_reason}
                />
              </div>
            ))
          ) : (
            <div className="w-full py-10 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              Belum ada paket soal yang dirilis untuk event ini.
            </div>
          )}
        </div>
      </LockedFeature>
    </div>
  );
}

export default EventDetailContainer;
