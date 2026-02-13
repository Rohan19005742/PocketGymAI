"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Trash2, CheckCircle, Trophy, AlertCircle, Heart } from "lucide-react";

interface Notification {
  id: string;
  type: "achievement" | "reminder" | "milestone" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "achievement",
      title: "🏆 Workout Warrior",
      message: "You've completed 7 consecutive days of workouts!",
      timestamp: new Date(Date.now() - 2 * 60000),
      read: false,
    },
    {
      id: "2",
      type: "reminder",
      title: "💪 Time to Workout",
      message: "Your scheduled workout is coming up in 30 minutes.",
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
    },
    {
      id: "3",
      type: "milestone",
      title: "🎯 Goal Reached",
      message: "You've reached 50% of your monthly workout goal!",
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: true,
    },
    {
      id: "4",
      type: "system",
      title: "📢 New Features",
      message: "Check out our new AI meal planner feature.",
      timestamp: new Date(Date.now() - 24 * 3600000),
      read: true,
    },
    {
      id: "5",
      type: "achievement",
      title: "❤️ Personal Record",
      message: "New personal record! You squatted 150kg today.",
      timestamp: new Date(Date.now() - 48 * 3600000),
      read: true,
    },
  ]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case "reminder":
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
      case "milestone":
        return <Heart className="w-5 h-5 text-red-400" />;
      case "system":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-neutral-400" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 fade-in flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black gradient-text mb-2">Notifications</h1>
            <p className="text-neutral-400">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <p className="text-sm font-semibold text-blue-400">{unreadCount} New</p>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-400 text-lg">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((notif, i) => (
              <div
                key={notif.id}
                className={`border rounded-2xl p-4 transition-all fade-in ${
                  notif.read
                    ? "bg-neutral-900/50 border-neutral-800"
                    : "bg-neutral-900 border-neutral-700 shadow-lg shadow-neutral-900/50"
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getIcon(notif.type)}</div>

                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${notif.read ? "text-neutral-300" : "text-white"}`}>
                      {notif.title}
                    </h3>
                    <p className="text-neutral-400 text-sm mb-2">{notif.message}</p>
                    <p className="text-xs text-neutral-500">{formatTime(notif.timestamp)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="px-3 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800/50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
